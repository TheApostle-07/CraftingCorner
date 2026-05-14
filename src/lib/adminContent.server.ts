import { readFile, writeFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import path from 'node:path';

import {
  ADMIN_DATA_FILES,
  type AdminContent,
  validateAdminContent,
} from './adminContent';
import { getCmsDatabaseClient, hasCmsDatabaseConnection } from './database';

type GithubConfig = {
  token: string;
  owner: string;
  repo: string;
  branch: string;
  contentPath: string;
};

export type AdminContentResponse = {
  content: AdminContent;
  health: ReturnType<typeof validateAdminContent>;
  baseSha: string;
  storage: {
    mode: 'database' | 'github' | 'local';
    canUpdate: boolean;
    branch: string;
    note: string;
  };
};

function getGithubConfig(): GithubConfig | null {
  const token = process.env.GITHUB_TOKEN || process.env.SITE_STATUS_GITHUB_TOKEN || '';
  const owner = process.env.GITHUB_OWNER || process.env.SITE_STATUS_REPO_OWNER || '';
  const repo = process.env.GITHUB_REPO || process.env.SITE_STATUS_REPO_NAME || '';
  const branch =
    process.env.GITHUB_BRANCH || process.env.SITE_STATUS_REPO_BRANCH || 'main';
  const contentPath = process.env.GITHUB_CONTENT_PATH || 'src/data';

  if (!token || !owner || !repo) {
    return null;
  }

  return { token, owner, repo, branch, contentPath };
}

function dataPath(file: string) {
  return path.join(process.cwd(), 'src', 'data', file);
}

function contentToFiles(content: AdminContent) {
  return {
    'site.json': content.site,
    'homepage.json': content.homepage,
    'categories.json': content.categories,
    'productTypes.json': content.productTypes,
    'products.json': content.products,
    'testimonials.json': content.testimonials,
    'seo.json': content.seo,
    'footer.json': content.footer,
    'navigation.json': content.navigation,
  };
}

const DOCUMENT_TO_CONTENT_KEY: Record<string, keyof AdminContent> = {
  'site.json': 'site',
  'homepage.json': 'homepage',
  'categories.json': 'categories',
  'productTypes.json': 'productTypes',
  'products.json': 'products',
  'testimonials.json': 'testimonials',
  'seo.json': 'seo',
  'footer.json': 'footer',
  'navigation.json': 'navigation',
};

const CONTENT_KEY_TO_DOCUMENT = Object.entries(DOCUMENT_TO_CONTENT_KEY).reduce(
  (acc, [documentKey, contentKey]) => {
    acc[contentKey] = documentKey;
    return acc;
  },
  {} as Record<keyof AdminContent, string>,
);

async function readLocalJson<T>(file: string): Promise<T> {
  return JSON.parse(await readFile(dataPath(file), 'utf8')) as T;
}

async function readLocalContent(): Promise<AdminContent> {
  return {
    site: await readLocalJson('site.json'),
    homepage: await readLocalJson('homepage.json'),
    categories: await readLocalJson('categories.json'),
    productTypes: await readLocalJson('productTypes.json'),
    products: await readLocalJson('products.json'),
    testimonials: await readLocalJson('testimonials.json'),
    seo: await readLocalJson('seo.json'),
    footer: await readLocalJson('footer.json'),
    navigation: await readLocalJson('navigation.json'),
  };
}

function usesDatabaseContent() {
  return hasCmsDatabaseConnection() && process.env.CMS_CONTENT_STORAGE !== 'github';
}

async function ensureCmsTables() {
  const sql = getCmsDatabaseClient();

  await sql`
    create table if not exists cms_documents (
      key text primary key,
      data jsonb not null,
      version integer not null default 1,
      updated_at timestamptz not null default now(),
      updated_by text not null default 'system'
    )
  `;

  await sql`
    create table if not exists cms_revisions (
      id text primary key,
      key text not null,
      data jsonb not null,
      version integer not null,
      created_at timestamptz not null default now(),
      created_by text not null default 'admin'
    )
  `;
}

function buildDatabaseBaseSha(rows: { key: string; version: number }[]) {
  return rows
    .slice()
    .sort((a, b) => a.key.localeCompare(b.key))
    .map((row) => `${row.key}:${row.version}`)
    .join('|');
}

async function readDatabaseRows() {
  const sql = getCmsDatabaseClient();
  return sql<{ key: string; data: unknown; version: number }[]>`
    select key, data, version
    from cms_documents
    where key = any(${ADMIN_DATA_FILES as unknown as string[]})
  `;
}

async function seedMissingDatabaseDocuments(localContent: AdminContent) {
  const sql = getCmsDatabaseClient();
  const rows = await readDatabaseRows();
  const existingKeys = new Set(rows.map((row) => row.key));
  const files = contentToFiles(localContent);

  for (const [file, data] of Object.entries(files)) {
    if (existingKeys.has(file)) continue;

    await sql`
      insert into cms_documents (key, data, version, updated_at, updated_by)
      values (${file}, ${sql.json(data)}, 1, now(), 'seed')
      on conflict (key) do nothing
    `;
  }
}

async function readDatabaseContent(localContent?: AdminContent) {
  await ensureCmsTables();
  let fallbackContent = localContent;
  let rows = await readDatabaseRows();

  if (rows.length < ADMIN_DATA_FILES.length) {
    fallbackContent ||= await readLocalContent();
    await seedMissingDatabaseDocuments(fallbackContent);
    rows = await readDatabaseRows();
  }

  const byKey = new Map(rows.map((row) => [row.key, row]));
  const merged = {} as AdminContent;

  (Object.keys(CONTENT_KEY_TO_DOCUMENT) as (keyof AdminContent)[]).forEach(
    (contentKey) => {
      const documentKey = CONTENT_KEY_TO_DOCUMENT[contentKey];
      const rowData = byKey.get(documentKey)?.data;

      if (!rowData && !fallbackContent) {
        throw new Error(`CMS document ${documentKey} is missing from Neon.`);
      }

      (merged as Record<string, unknown>)[contentKey] =
        rowData || fallbackContent?.[contentKey];
    },
  );

  return {
    content: merged,
    baseSha: buildDatabaseBaseSha(rows),
  };
}

async function githubRequest<T>(
  config: GithubConfig,
  endpoint: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(`https://api.github.com${endpoint}`, {
    ...init,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${config.token}`,
      'Content-Type': 'application/json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(init?.headers || {}),
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`GitHub API failed (${response.status}): ${message}`);
  }

  return (await response.json()) as T;
}

async function getGithubHeadSha(config: GithubConfig) {
  const ref = await githubRequest<{ object: { sha: string } }>(
    config,
    `/repos/${config.owner}/${config.repo}/git/ref/heads/${config.branch}`,
  );

  return ref.object.sha;
}

export async function readAdminContent(): Promise<AdminContentResponse> {
  const localContent = await readLocalContent();

  if (usesDatabaseContent()) {
    const databaseContent = await readDatabaseContent(localContent);
    const health = validateAdminContent(databaseContent.content);

    return {
      content: databaseContent.content,
      health,
      baseSha: databaseContent.baseSha,
      storage: {
        mode: 'database',
        canUpdate: true,
        branch: 'neon',
        note: 'Reads and writes Crafting Corner content in Neon Postgres. Public pages update without a GitHub content commit.',
      },
    };
  }

  const config = getGithubConfig();
  const content = localContent;
  const health = validateAdminContent(content);

  if (!config) {
    return {
      content,
      health,
      baseSha: 'local',
      storage: {
        mode: 'local',
        canUpdate: process.env.NODE_ENV !== 'production',
        branch: 'local',
        note:
          process.env.NODE_ENV === 'production'
            ? 'GitHub env vars are required for production content saves.'
            : 'Local development mode writes JSON files directly to src/data.',
      },
    };
  }

  let baseSha = '';
  try {
    baseSha = await getGithubHeadSha(config);
  } catch {
    baseSha = '';
  }

  return {
    content,
    health,
    baseSha,
    storage: {
      mode: 'github',
      canUpdate: true,
      branch: config.branch,
      note: `Saves commit JSON changes to ${config.owner}/${config.repo}:${config.branch}.`,
    },
  };
}

async function writeLocalContent(content: AdminContent) {
  const files = contentToFiles(content);
  await Promise.all(
    Object.entries(files).map(([file, value]) =>
      writeFile(dataPath(file), `${JSON.stringify(value, null, 2)}\n`, 'utf8'),
    ),
  );
}

async function writeDatabaseContent(
  content: AdminContent,
  baseSha: string,
  updatedBy = 'admin',
) {
  await ensureCmsTables();
  const sql = getCmsDatabaseClient();
  const currentRows = await readDatabaseRows();
  const currentBaseSha = buildDatabaseBaseSha(currentRows);

  if (baseSha && baseSha !== currentBaseSha) {
    throw new Error(
      'Database content changed after this admin session loaded. Refresh before saving to avoid overwriting newer edits.',
    );
  }

  const files = contentToFiles(content);

  await sql.begin(async (tx) => {
    for (const [file, data] of Object.entries(files)) {
      const current = currentRows.find((row) => row.key === file);

      if (current) {
        await tx`
          insert into cms_revisions (id, key, data, version, created_at, created_by)
          values (${randomUUID()}, ${file}, ${tx.json(current.data)}, ${current.version}, now(), ${updatedBy})
        `;
      }

      await tx`
        insert into cms_documents (key, data, version, updated_at, updated_by)
        values (${file}, ${tx.json(data)}, 1, now(), ${updatedBy})
        on conflict (key) do update set
          data = excluded.data,
          version = cms_documents.version + 1,
          updated_at = now(),
          updated_by = excluded.updated_by
      `;
    }
  });

  const nextRows = await readDatabaseRows();
  return buildDatabaseBaseSha(nextRows);
}

async function writeGithubContent(
  content: AdminContent,
  baseSha: string,
  message: string,
) {
  const config = getGithubConfig();
  if (!config) {
    throw new Error('GitHub content storage is not configured.');
  }

  const latestSha = await getGithubHeadSha(config);
  if (baseSha && baseSha !== 'local' && latestSha !== baseSha) {
    throw new Error(
      'GitHub branch changed after this admin session loaded. Refresh before saving to avoid overwriting newer edits.',
    );
  }

  const baseCommit = await githubRequest<{ tree: { sha: string } }>(
    config,
    `/repos/${config.owner}/${config.repo}/git/commits/${latestSha}`,
  );

  const files = contentToFiles(content);
  const blobs = await Promise.all(
    Object.entries(files).map(async ([file, value]) => {
      const blob = await githubRequest<{ sha: string }>(
        config,
        `/repos/${config.owner}/${config.repo}/git/blobs`,
        {
          method: 'POST',
          body: JSON.stringify({
            content: `${JSON.stringify(value, null, 2)}\n`,
            encoding: 'utf-8',
          }),
        },
      );

      return {
        path: `${config.contentPath}/${file}`,
        mode: '100644',
        type: 'blob',
        sha: blob.sha,
      };
    }),
  );

  const tree = await githubRequest<{ sha: string }>(
    config,
    `/repos/${config.owner}/${config.repo}/git/trees`,
    {
      method: 'POST',
      body: JSON.stringify({
        base_tree: baseCommit.tree.sha,
        tree: blobs,
      }),
    },
  );

  const commit = await githubRequest<{ sha: string }>(
    config,
    `/repos/${config.owner}/${config.repo}/git/commits`,
    {
      method: 'POST',
      body: JSON.stringify({
        message,
        tree: tree.sha,
        parents: [latestSha],
      }),
    },
  );

  await githubRequest(
    config,
    `/repos/${config.owner}/${config.repo}/git/refs/heads/${config.branch}`,
    {
      method: 'PATCH',
      body: JSON.stringify({
        sha: commit.sha,
      }),
    },
  );

  return commit.sha;
}

export async function saveAdminContent(
  content: AdminContent,
  options: { baseSha: string; message?: string },
) {
  const health = validateAdminContent(content);
  if (health.errors > 0) {
    return {
      ok: false,
      health,
      message: 'Fix validation errors before saving.',
      commitSha: '',
    };
  }

  const config = getGithubConfig();
  const commitMessage =
    options.message || `Update Crafting Corner content (${new Date().toISOString()})`;

  if (usesDatabaseContent()) {
    const nextBaseSha = await writeDatabaseContent(content, options.baseSha);
    return {
      ok: true,
      health,
      message: 'Content saved to Neon. Public pages now read the updated database content.',
      commitSha: nextBaseSha,
    };
  }

  if (config) {
    const commitSha = await writeGithubContent(
      content,
      options.baseSha,
      commitMessage,
    );
    return {
      ok: true,
      health,
      message: 'Content committed to GitHub. Deployment will start from the branch update.',
      commitSha,
    };
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error('GitHub env vars are required for production content saves.');
  }

  await writeLocalContent(content);
  return {
    ok: true,
    health,
    message: 'Content saved to local JSON files.',
    commitSha: 'local',
  };
}

export async function readPublicContent(): Promise<AdminContent> {
  if (usesDatabaseContent()) {
    return (await readDatabaseContent()).content;
  }

  return readLocalContent();
}

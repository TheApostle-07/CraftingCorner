import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

import {
  ADMIN_DATA_FILES,
  type AdminContent,
  validateAdminContent,
} from './adminContent';

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
    mode: 'github' | 'local';
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
  const config = getGithubConfig();
  const content = await readLocalContent();
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

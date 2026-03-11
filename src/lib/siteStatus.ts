import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { unstable_noStore as noStore } from 'next/cache';

import { getDatabaseClient, hasDatabaseConnection } from '@/lib/database';

export type SiteStorageMode = 'database' | 'github' | 'local-file';

type RawSiteStatus = {
  active?: boolean;
  updatedAt?: string;
  updatedBy?: string;
};

type GitHubConfig = {
  owner: string;
  repo: string;
  branch: string;
  path: string;
  token?: string;
};

type DatabaseRow = {
  active: boolean;
  updated_at: string | Date;
  updated_by: string;
};

export type SiteStatus = {
  active: boolean;
  updatedAt: string;
  updatedBy: string;
  storageMode: SiteStorageMode;
};

export type SiteStorageInfo = {
  mode: SiteStorageMode;
  canUpdate: boolean;
  note: string;
};

const LOCAL_STATUS_FILE = path.join(process.cwd(), 'site-status.json');

function isHostedDeployment() {
  return process.env.NODE_ENV === 'production' || Boolean(process.env.VERCEL);
}

async function ensureDatabaseStatusTable() {
  const sql = getDatabaseClient();

  await sql`
    create table if not exists site_status_controls (
      key text primary key,
      active boolean not null default true,
      updated_at timestamptz not null default now(),
      updated_by text not null default 'system'
    )
  `;

  await sql`
    insert into site_status_controls (key, active, updated_at, updated_by)
    values ('public_site_status', true, now(), 'system')
    on conflict (key) do nothing
  `;
}

function normalizeStatus(
  raw: RawSiteStatus,
  storageMode: SiteStorageMode,
): SiteStatus {
  return {
    active: raw.active !== false,
    updatedAt: raw.updatedAt || new Date().toISOString(),
    updatedBy: raw.updatedBy || 'system',
    storageMode,
  };
}

function getGitHubConfig(): GitHubConfig | null {
  const token =
    process.env.SITE_STATUS_GITHUB_TOKEN || process.env.GITHUB_STATUS_TOKEN;
  const enabled =
    process.env.SITE_STATUS_STORAGE === 'github' || Boolean(token);

  if (!enabled) {
    return null;
  }

  return {
    owner: process.env.SITE_STATUS_REPO_OWNER || 'TheApostle-07',
    repo: process.env.SITE_STATUS_REPO_NAME || 'CraftingCorner',
    branch: process.env.SITE_STATUS_REPO_BRANCH || 'main',
    path: process.env.SITE_STATUS_FILE_PATH || 'site-status.json',
    token,
  };
}

function encodeGitHubPath(filePath: string) {
  return filePath.split('/').map(encodeURIComponent).join('/');
}

function buildRawGitHubUrl(config: GitHubConfig) {
  return `https://raw.githubusercontent.com/${config.owner}/${config.repo}/${config.branch}/${config.path}`;
}

async function readLocalStatus() {
  try {
    const rawFile = await readFile(LOCAL_STATUS_FILE, 'utf8');
    return normalizeStatus(JSON.parse(rawFile) as RawSiteStatus, 'local-file');
  } catch (error) {
    const err = error as NodeJS.ErrnoException;

    if (err.code !== 'ENOENT') {
      throw error;
    }

    const fallback = normalizeStatus(
      {
        active: true,
        updatedAt: new Date().toISOString(),
        updatedBy: 'system',
      },
      'local-file',
    );

    await writeLocalStatus(fallback);
    return fallback;
  }
}

async function writeLocalStatus(status: Omit<SiteStatus, 'storageMode'>) {
  const record = {
    active: status.active,
    updatedAt: status.updatedAt,
    updatedBy: status.updatedBy,
  };

  await writeFile(LOCAL_STATUS_FILE, `${JSON.stringify(record, null, 2)}\n`);

  return normalizeStatus(record, 'local-file');
}

async function readDatabaseStatus() {
  await ensureDatabaseStatusTable();

  const sql = getDatabaseClient();
  const rows = await sql<DatabaseRow[]>`
    select active, updated_at, updated_by
    from site_status_controls
    where key = 'public_site_status'
    limit 1
  `;

  const row = rows[0];

  if (!row) {
    throw new Error('Unable to read site status row from the database.');
  }

  return normalizeStatus(
    {
      active: row.active,
      updatedAt: new Date(row.updated_at).toISOString(),
      updatedBy: row.updated_by,
    },
    'database',
  );
}

async function writeDatabaseStatus(status: Omit<SiteStatus, 'storageMode'>) {
  await ensureDatabaseStatusTable();

  const sql = getDatabaseClient();

  await sql`
    insert into site_status_controls (key, active, updated_at, updated_by)
    values (
      'public_site_status',
      ${status.active},
      ${status.updatedAt}::timestamptz,
      ${status.updatedBy}
    )
    on conflict (key) do update set
      active = excluded.active,
      updated_at = excluded.updated_at,
      updated_by = excluded.updated_by
  `;

  return normalizeStatus(status, 'database');
}

async function readGitHubStatus(config: GitHubConfig) {
  const response = await fetch(buildRawGitHubUrl(config), {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Unable to read site status from GitHub (${response.status}).`);
  }

  return normalizeStatus(
    (await response.json()) as RawSiteStatus,
    'github',
  );
}

async function writeGitHubStatus(
  config: GitHubConfig,
  status: Omit<SiteStatus, 'storageMode'>,
) {
  if (!config.token) {
    throw new Error(
      'SITE_STATUS_GITHUB_TOKEN is required to update the site in GitHub mode.',
    );
  }

  const headers = {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${config.token}`,
    'Content-Type': 'application/json',
    'X-GitHub-Api-Version': '2022-11-28',
  };

  const apiUrl = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${encodeGitHubPath(config.path)}`;
  const currentResponse = await fetch(
    `${apiUrl}?ref=${encodeURIComponent(config.branch)}`,
    {
      headers,
      cache: 'no-store',
    },
  );

  let sha: string | undefined;

  if (currentResponse.ok) {
    const current = (await currentResponse.json()) as { sha?: string };
    sha = current.sha;
  } else if (currentResponse.status !== 404) {
    throw new Error(
      `Unable to fetch current GitHub file state (${currentResponse.status}).`,
    );
  }

  const payload = {
    message: `chore: set site ${status.active ? 'active' : 'inactive'}`,
    content: Buffer.from(
      `${JSON.stringify(
        {
          active: status.active,
          updatedAt: status.updatedAt,
          updatedBy: status.updatedBy,
        },
        null,
        2,
      )}\n`,
    ).toString('base64'),
    branch: config.branch,
    sha,
  };

  const updateResponse = await fetch(apiUrl, {
    method: 'PUT',
    headers,
    body: JSON.stringify(payload),
    cache: 'no-store',
  });

  if (!updateResponse.ok) {
    const details = await updateResponse.text();
    throw new Error(
      `Unable to update site status in GitHub (${updateResponse.status}): ${details}`,
    );
  }

  return normalizeStatus(status, 'github');
}

export function getSiteStorageInfo(): SiteStorageInfo {
  if (hasDatabaseConnection()) {
    return {
      mode: 'database',
      canUpdate: true,
      note: 'Persists the public site status in PostgreSQL via DATABASE_URL.',
    };
  }

  const gitHubConfig = getGitHubConfig();

  if (gitHubConfig) {
    return {
      mode: 'github',
      canUpdate: Boolean(gitHubConfig.token),
      note: gitHubConfig.token
        ? `Reads and writes ${gitHubConfig.owner}/${gitHubConfig.repo}/${gitHubConfig.path} on ${gitHubConfig.branch}.`
        : 'GitHub mode is enabled for reads, but updates require SITE_STATUS_GITHUB_TOKEN on the server.',
    };
  }

  if (isHostedDeployment()) {
    return {
      mode: 'local-file',
      canUpdate: false,
      note: 'Hosted deployments must use GitHub-backed status storage for a real persistent toggle. Add SITE_STATUS_GITHUB_TOKEN and the repo settings in the server environment.',
    };
  }

  return {
    mode: 'local-file',
    canUpdate: true,
    note: 'Uses /site-status.json on the local filesystem for development.',
  };
}

export async function getSiteStatus() {
  noStore();

  if (hasDatabaseConnection()) {
    return readDatabaseStatus();
  }

  const gitHubConfig = getGitHubConfig();

  if (gitHubConfig) {
    try {
      return await readGitHubStatus(gitHubConfig);
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('Falling back to local site status:', error);
      }
    }
  }

  return readLocalStatus();
}

export async function updateSiteStatus(active: boolean, updatedBy = 'admin') {
  noStore();

  const nextStatus = {
    active,
    updatedAt: new Date().toISOString(),
    updatedBy,
  };

  if (hasDatabaseConnection()) {
    return writeDatabaseStatus(nextStatus);
  }

  const gitHubConfig = getGitHubConfig();

  if (gitHubConfig) {
    return writeGitHubStatus(gitHubConfig, nextStatus);
  }

  if (isHostedDeployment()) {
    throw new Error(
      'Hosted status updates require GitHub-backed storage. Set SITE_STATUS_GITHUB_TOKEN and the repo configuration env vars first.',
    );
  }

  return writeLocalStatus(nextStatus);
}

import postgres from 'postgres';

declare global {
  var craftingCornerSql: ReturnType<typeof postgres> | undefined;
  var craftingCornerCmsSql: ReturnType<typeof postgres> | undefined;
}

function getConnectionString() {
  return process.env.SITE_STATUS_DATABASE_URL || process.env.DATABASE_URL || '';
}

function getCmsConnectionString() {
  return process.env.DATABASE_URL || '';
}

function createClient(connectionString: string) {
  return postgres(connectionString, {
    max: 1,
    prepare: false,
    idle_timeout: 20,
    connect_timeout: 15,
  });
}

export function hasDatabaseConnection() {
  return Boolean(getConnectionString());
}

export function hasCmsDatabaseConnection() {
  return Boolean(getCmsConnectionString());
}

export function getDatabaseClient() {
  const connectionString = getConnectionString();

  if (!connectionString) {
    throw new Error('DATABASE_URL is not configured.');
  }

  if (!globalThis.craftingCornerSql) {
    globalThis.craftingCornerSql = createClient(connectionString);
  }

  return globalThis.craftingCornerSql;
}

export function getCmsDatabaseClient() {
  const connectionString = getCmsConnectionString();

  if (!connectionString) {
    throw new Error('DATABASE_URL is not configured.');
  }

  if (!globalThis.craftingCornerCmsSql) {
    globalThis.craftingCornerCmsSql = createClient(connectionString);
  }

  return globalThis.craftingCornerCmsSql;
}

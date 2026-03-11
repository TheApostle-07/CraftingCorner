import postgres from 'postgres';

declare global {
  var craftingCornerSql: ReturnType<typeof postgres> | undefined;
}

function getConnectionString() {
  return process.env.SITE_STATUS_DATABASE_URL || process.env.DATABASE_URL || '';
}

export function hasDatabaseConnection() {
  return Boolean(getConnectionString());
}

export function getDatabaseClient() {
  const connectionString = getConnectionString();

  if (!connectionString) {
    throw new Error('DATABASE_URL is not configured.');
  }

  if (!globalThis.craftingCornerSql) {
    globalThis.craftingCornerSql = postgres(connectionString, {
      max: 1,
      prepare: false,
      idle_timeout: 20,
      connect_timeout: 15,
    });
  }

  return globalThis.craftingCornerSql;
}

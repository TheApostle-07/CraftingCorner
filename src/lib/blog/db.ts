import postgres from "postgres";
import { readFile } from "node:fs/promises";
import path from "node:path";

let client: ReturnType<typeof postgres> | undefined;
let initializing: Promise<void> | undefined;
export function blogTable(name: string) {
  if (!/^blog_[a-z_]+$/.test(name)) throw new Error("Invalid blog table.");
  return blogSql()(`${process.env.BLOG_DATABASE_SCHEMA || "public"}.${name}`);
}
// Dates and validated rich-text attributes are normalized to JSON before binding.
export function blogJSON(value: unknown): postgres.JSONValue {
  return JSON.parse(JSON.stringify(value));
}
export function blogDatabaseConfigured() {
  return Boolean(process.env.BLOG_DATABASE_URL || process.env.DATABASE_URL);
}
export function blogSql() {
  if (client) return client;
  const url = process.env.BLOG_DATABASE_URL || process.env.DATABASE_URL;
  if (!url)
    throw new Error("Blog database is not configured. Set DATABASE_URL.");
  const schema = process.env.BLOG_DATABASE_SCHEMA || "public";
  if (!/^[a-z][a-z0-9_]{0,62}$/.test(schema))
    throw new Error("Invalid blog database schema.");
  client = postgres(url, {
    max: 3,
    prepare: false,
    connect_timeout: 8,
    idle_timeout: 20,
    onnotice: () => {},
    connection: { search_path: schema, statement_timeout: 15000 },
  });
  return client;
}
export async function ensureBlogDatabase() {
  if (!initializing)
    initializing = (async () => {
      const sql = blogSql();
      const schema = process.env.BLOG_DATABASE_SCHEMA || "public";
      if (schema !== "public")
        await sql`create schema if not exists ${sql(schema)}`;
      const migration = await readFile(
        path.join(process.cwd(), "migrations/001_blog.sql"),
        "utf8",
      );
      await sql.begin(async (transaction) => {
        const tx = transaction as unknown as typeof sql;
        await tx`select pg_advisory_xact_lock(853019210)`;
        await tx.unsafe(`set local search_path to "${schema}"`);
        await tx.unsafe(migration);
      });
      const { default: photography } = await import(
        "@/data/realPhotography.json"
      );
      const images = photography.photos.map((photo) => ({
        id: `photo-${photo.filename.replace(/\.JPG$/i, "")}`,
        url: photo.large,
        filename: photo.filename,
        alt: photo.reason,
        caption: "",
        width: 1333,
        height: 2000,
        provider: "bundled",
      }));
      await sql`insert into ${blogTable("blog_media")} ${sql(images)} on conflict do nothing`;
    })().catch((error) => {
      initializing = undefined;
      throw error;
    });
  return initializing;
}

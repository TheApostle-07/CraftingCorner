import { blogTable } from "@/lib/blog/db";
import { createHash } from "node:crypto";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { blogSql, ensureBlogDatabase } from "./db";
import { BlogError } from "./validation";

export async function authorizeBlog(request: Request) {
  if (!(await isAdminAuthenticated()))
    throw new BlogError(
      "Your admin session has expired. Sign in again; your local draft is preserved.",
      401,
    );
  if (request.method !== "GET") {
    const origin = request.headers.get("origin");
    if (
      (origin && origin !== new URL(request.url).origin) ||
      request.headers.get("sec-fetch-site") === "cross-site"
    )
      throw new BlogError("This request must come from the admin studio.", 403);
    await ensureBlogDatabase();
    const sql = blogSql();
    const actor = process.env.ADMIN_USERNAME || "admin";
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "local";
    const key = createHash("sha256")
      .update(`blog:${actor}:${ip}`)
      .digest("hex");
    const [row] =
      await sql`insert into ${blogTable("blog_rate_limits")}(key,hits,reset_at) values(${key},1,now()+interval '1 minute')
      on conflict(key) do update set hits=case when ${blogTable("blog_rate_limits")}.reset_at<=now() then 1 else ${blogTable("blog_rate_limits")}.hits+1 end,
      reset_at=case when ${blogTable("blog_rate_limits")}.reset_at<=now() then now()+interval '1 minute' else ${blogTable("blog_rate_limits")}.reset_at end returning hits`;
    if (row.hits > 90)
      throw new BlogError(
        "Too many changes in a short time. Wait a minute and retry; your draft remains in the editor.",
        429,
      );
  }
  return process.env.ADMIN_USERNAME || "admin";
}
export async function readLimitedBody(request: Request, limit = 800000) {
  const reader = request.body?.getReader();
  if (!reader) throw new BlogError("Missing request body.");
  let length = 0;
  const chunks: Uint8Array[] = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    length += value.byteLength;
    if (length > limit) {
      await reader.cancel();
      throw new BlogError(
        "The request is too large. Reduce the article or image size and retry.",
        413,
      );
    }
    chunks.push(value);
  }
  return new Uint8Array(Buffer.concat(chunks));
}
export async function readBlogBody(request: Request) {
  const bytes = await readLimitedBody(request);
  try {
    return JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    throw new BlogError("The submitted content is not valid JSON.");
  }
}

import { blogTable } from "@/lib/blog/db";
import { createHash, randomUUID } from "node:crypto";
import { mkdir, writeFile, unlink } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { blogSql, ensureBlogDatabase } from "./db";
import { BlogError } from "./validation";
import type { BlogMedia } from "./types";
import { safeImage } from "./content";

export function signatureType(buffer: Buffer) {
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff)
    return "image/jpeg";
  if (
    buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
  )
    return "image/png";
  if (
    buffer.subarray(0, 4).toString() === "RIFF" &&
    buffer.subarray(8, 12).toString() === "WEBP"
  )
    return "image/webp";
  if (
    buffer.subarray(4, 8).toString() === "ftyp" &&
    buffer.subarray(8, 40).includes(Buffer.from("avif"))
  )
    return "image/avif";
  return null;
}
function cloudConfig() {
  const cloud = process.env.CLOUDINARY_CLOUD_NAME,
    key = process.env.CLOUDINARY_API_KEY,
    secret = process.env.CLOUDINARY_API_SECRET;
  return cloud && key && secret && /^[a-z0-9_-]+$/i.test(cloud)
    ? { cloud, key, secret }
    : null;
}
async function cloudRequest(
  action: string,
  params: Record<string, string>,
  file?: Buffer,
) {
  const config = cloudConfig();
  if (!config)
    throw new BlogError(
      "Connect image storage before uploading. Existing library images are available.",
      503,
    );
  const fields = {
    ...params,
    timestamp: String(Math.floor(Date.now() / 1000)),
  };
  const signature = createHash("sha1")
    .update(
      Object.keys(fields)
        .sort()
        .map((key) => `${key}=${fields[key]}`)
        .join("&") + config.secret,
    )
    .digest("hex");
  const form = new FormData();
  for (const [key, value] of Object.entries(fields)) form.append(key, value);
  form.append("api_key", config.key);
  form.append("signature", signature);
  if (file)
    form.append(
      "file",
      new Blob([new Uint8Array(file)], { type: "image/webp" }),
      "photograph.webp",
    );
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${config.cloud}/image/${action}`,
    { method: "POST", body: form, signal: AbortSignal.timeout(20000) },
  );
  if (!response.ok)
    throw new BlogError(
      "Image storage did not accept the request. Retry or check the storage connection.",
      502,
    );
  return response.json();
}
export async function uploadBlogImage(
  file: File,
  alt: string,
  caption: string,
) {
  if (!file || file.size === 0 || file.size > 4 * 1024 * 1024)
    throw new BlogError(
      "Choose a JPEG, PNG, WebP or AVIF photograph up to 4 MB.",
      413,
    );
  const bytes = Buffer.from(await file.arrayBuffer());
  const detected = signatureType(bytes);
  if (!detected || (file.type && file.type !== detected))
    throw new BlogError(
      "The file contents do not match a supported image type.",
    );
  let output: Buffer, width: number, height: number;
  try {
    const meta = await sharp(bytes, {
      limitInputPixels: 40000000,
      animated: false,
    }).metadata();
    if (
      !meta.width ||
      !meta.height ||
      meta.width < 160 ||
      meta.height < 160 ||
      meta.width > 16000 ||
      meta.height > 16000 ||
      (meta.pages || 1) > 1
    )
      throw new Error();
    const converted = await sharp(bytes, { limitInputPixels: 40000000 })
      .rotate()
      .resize({
        width: 2000,
        height: 2000,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 85 })
      .toBuffer({ resolveWithObject: true });
    output = converted.data;
    width = converted.info.width;
    height = converted.info.height;
  } catch {
    throw new BlogError(
      "This image cannot be decoded safely. Use a still photograph between 160 and 16,000 pixels.",
    );
  }
  const id = randomUUID();
  let url: string,
    publicId: string | null = null,
    provider: string;
  if (cloudConfig()) {
    const result = await cloudRequest(
      "upload",
      { folder: "crafting-corner/blog", public_id: id, overwrite: "false" },
      output,
    );
    url = result.secure_url;
    publicId = result.public_id;
    provider = "cloudinary";
  } else if (
    process.env.NODE_ENV !== "production" &&
    process.env.BLOG_LOCAL_UPLOADS === "true"
  ) {
    await mkdir(path.join(process.cwd(), "public/images/blog"), {
      recursive: true,
    });
    await writeFile(
      path.join(process.cwd(), "public/images/blog", `${id}.webp`),
      output,
    );
    url = `/images/blog/${id}.webp`;
    provider = "local";
  } else
    throw new BlogError(
      "Image uploads need storage configuration. You can still reuse the real photographs in the library.",
      503,
    );
  if (!safeImage(url))
    throw new BlogError(
      "Storage returned an unsupported image URL. Check the Cloudinary configuration.",
      502,
    );
  await ensureBlogDatabase();
  const sql = blogSql();
  const [row] = await sql<
    BlogMedia[]
  >`insert into ${blogTable("blog_media")}(id,url,filename,alt,caption,width,height,provider,public_id) values(${id},${url},${file.name.slice(0, 200)},${alt.slice(0, 500)},${caption.slice(0, 1000)},${width},${height},${provider},${publicId}) returning id,url,filename,alt,caption,width,height,provider,created_at as "createdAt"`;
  return row;
}
export async function deleteBlogImage(id: string) {
  await ensureBlogDatabase();
  const sql = blogSql();
  await sql.begin(async (transaction) => {
    const tx = transaction as unknown as typeof sql;
    const [media] =
      await tx`select * from ${blogTable("blog_media")} where id=${id} for update`;
    if (!media) throw new BlogError("Image not found.", 404);
    const [reference] =
      await tx`select article_id from ${blogTable("blog_media_references")} where media_id=${id} limit 1`;
    if (reference)
      throw new BlogError(
        "This image is used by an article or revision in progress. Remove its active references before deleting it.",
        409,
      );
    if (media.provider === "bundled")
      throw new BlogError(
        "Original catalogue photographs are protected. Upload a replacement rather than deleting a shared image.",
        409,
      );
    if (media.provider === "cloudinary")
      await cloudRequest("destroy", {
        public_id: media.public_id,
        invalidate: "true",
      });
    if (media.provider === "local" && /^[a-f0-9-]{36}$/.test(id))
      try {
        await unlink(
          path.join(process.cwd(), "public/images/blog", `${id}.webp`),
        );
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
      }
    await tx`delete from ${blogTable("blog_media")} where id=${id}`;
  });
}

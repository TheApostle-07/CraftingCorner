import MediaLibrary from "@/components/admin/blog/MediaLibrary";
import { requireBlogAdmin } from "@/lib/blog/admin.server";
export default async function Page() {
  await requireBlogAdmin();
  return (
    <>
      <p className="eyebrow">The image library</p>
      <h1 className="my-4 font-display text-5xl font-normal">Photographs</h1>
      <p className="mb-8 max-w-2xl text-sm leading-7 text-[#66513e]">
        Thoughtful images, clear descriptions. Reuse a showroom photograph or
        upload a new image for your next story.
      </p>
      <div className="blog-panel">
        <MediaLibrary />
      </div>
    </>
  );
}

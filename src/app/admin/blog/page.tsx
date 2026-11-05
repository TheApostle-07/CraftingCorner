import BlogDashboard from "@/components/admin/blog/BlogDashboard";
import { listAdminArticles } from "@/lib/blog/service";
import { requireBlogAdmin } from "@/lib/blog/admin.server";
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}) {
  await requireBlogAdmin();
  const query = await searchParams;
  return (
    <BlogDashboard
      result={await listAdminArticles({
        ...query,
        page: Number(query.page) || 1,
      })}
      query={query}
    />
  );
}

import { getBlogOptions } from "@/lib/blog/service";
import TaxonomyManager from "@/components/admin/blog/TaxonomyManager";
import { requireBlogAdmin } from "@/lib/blog/admin.server";
export default async function Page() {
  await requireBlogAdmin();
  return <TaxonomyManager initial={await getBlogOptions()} />;
}

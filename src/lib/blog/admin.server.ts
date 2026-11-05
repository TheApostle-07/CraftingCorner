import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/adminAuth";
// Layouts can be reused by App Router. Authenticate each data-bearing page too.
export async function requireBlogAdmin() {
  if (!(await isAdminAuthenticated())) redirect("/admin");
}

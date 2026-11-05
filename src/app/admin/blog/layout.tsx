import type { ReactNode } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Armchair,
  ArrowUpRight,
  BookOpen,
  Image,
  Tags,
  ArrowLeft,
} from "lucide-react";
import { isAdminAuthenticated } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Journal Studio | Crafting Corner",
  robots: { index: false, follow: false },
};
export default async function BlogAdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  if (!(await isAdminAuthenticated())) redirect("/admin");
  return (
    <div className="journal-admin min-h-screen bg-[#f8f3ea] text-[#241b14]">
      <aside className="journal-admin-sidebar">
        <Link href="/admin" className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#2b1a12] text-[#e7c98b]">
            <Armchair size={22} />
          </span>
          <span className="text-sm font-semibold">
            Crafting Corner
            <span className="mt-1 block text-[10px] font-medium uppercase tracking-[.23em] text-[#796650]">
              Journal studio
            </span>
          </span>
        </Link>
        <nav
          aria-label="Journal administration"
          className="mt-7 flex flex-wrap gap-2 lg:flex-col"
        >
          {[
            ["/admin/blog", "Articles", BookOpen],
            ["/admin/blog/media", "Photographs", Image],
            ["/admin/blog/categories", "Categories & authors", Tags],
          ].map(([href, label, Icon]) => {
            const I = Icon as typeof BookOpen;
            return (
              <Link
                key={String(href)}
                href={String(href)}
                className="journal-admin-nav"
              >
                <I size={17} />
                {String(label)}
              </Link>
            );
          })}
        </nav>
        <div className="mt-7 flex flex-wrap gap-4 border-t border-[#e8dccb] pt-5 text-xs text-[#66513e] lg:flex-col">
          <Link
            href="/admin"
            className="inline-flex min-h-11 items-center gap-2"
          >
            <ArrowLeft size={16} />
            Back to Admin Studio
          </Link>
          <a
            href="/blog"
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center gap-2"
          >
            View journal <ArrowUpRight size={16} />
          </a>
        </div>
      </aside>
      <main id="main-content" className="journal-admin-main">
        {children}
      </main>
    </div>
  );
}

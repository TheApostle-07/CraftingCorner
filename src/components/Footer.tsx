import Link from "next/link";
import { Instagram, Facebook, Linkedin, ArrowUpRight } from "lucide-react";
import type { SiteData } from "@/lib/types";
import ConversionAnalytics from "./ConversionAnalytics";
type FooterData = {
  brandName?: string;
  tagline?: string;
  description?: string;
  copyright?: string;
  nav?: { href: string; label: string }[];
};
export default function Footer({
  footer,
  site,
  analyticsEnabled,
}: {
  footer: FooterData;
  site: SiteData;
  analyticsEnabled: boolean;
}) {
  return (
    <footer className="border-t border-[#d9cdbc] bg-[#eee6da] text-[#574332]">
      <div className="site-container grid gap-9 py-12 text-center sm:grid-cols-3 sm:gap-5 sm:py-14 lg:gap-12">
        <div className="min-w-0">
          <Link href="/" className="font-display text-3xl text-[#3e2b1e]">
            {footer.brandName || site.brandName}
          </Link>
          <p className="mx-auto mt-4 max-w-xs text-pretty text-sm leading-7 text-[#6d5844]">
            Considered furniture and expressive details. Find something that
            feels like you.
          </p>
          {analyticsEnabled ? <ConversionAnalytics /> : null}
        </div>
        <nav
          aria-label="Footer"
          className="flex flex-wrap items-center justify-center gap-x-5 gap-y-0.5 text-sm sm:flex-col sm:justify-start"
        >
          <p className="eyebrow mb-2 w-full">Explore</p>
          {(footer.nav || []).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="inline-flex min-h-11 items-center text-center transition hover:underline hover:underline-offset-4"
            >
              {link.label}
            </Link>
          ))}
          {!footer.nav?.some(({ href }) => href === "/contact") && (
            <Link href="/contact" className="inline-flex min-h-11 items-center hover:underline hover:underline-offset-4">
              Plan your visit
            </Link>
          )}
          <Link
            href="/blog"
            className="inline-flex min-h-11 items-center gap-2 hover:underline hover:underline-offset-4"
          >
            Journal <ArrowUpRight size={14} aria-hidden="true" />
          </Link>
        </nav>
        <div className="min-w-0">
          <p className="eyebrow">Visit & connect</p>
          <p className="mt-4 text-sm leading-7">{site.contact.address}</p>
          <a href={`tel:${site.contact.phone}`} className="mt-2 inline-block text-sm hover:underline">
            {site.contact.phone}
          </a>
          <a
            href={`mailto:${site.contact.email}`}
            className="mt-2 block text-sm [overflow-wrap:anywhere] hover:underline"
          >
            {site.contact.email}
          </a>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {[
              [site.social.instagram, "Instagram", Instagram],
              [site.social.facebook, "Facebook", Facebook],
              [site.social.linkedin, "LinkedIn", Linkedin],
            ].map(([href, label, Icon]) =>
              typeof href === "string" &&
              href.startsWith("https://") &&
              typeof Icon !== "string" ? (
                <a
                  key={label as string}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label as string}
                  className="grid h-11 w-11 place-items-center rounded-full border border-[#cdbba5] transition hover:bg-white/50"
                >
                  <Icon size={17} />
                </a>
              ) : null,
            )}
          </div>
        </div>
      </div>
      <div className="border-t border-[#d9cdbc]">
        <div className="site-container flex flex-col items-center justify-between gap-3 px-16 py-5 text-center text-xs leading-5 text-[#6d5844] sm:flex-row sm:px-24 sm:text-start">
          <span>
            © {new Date().getFullYear()} Crafting Corner. All rights reserved.
          </span>
          <p>
            Created and managed by{" "}
            <a
              href="https://www.expertdevstudio.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-1 whitespace-nowrap text-[#493424] underline decoration-[#ac9074] underline-offset-4 hover:decoration-current"
            >
              Expert Dev Studio <ArrowUpRight size={13} aria-hidden="true" />
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

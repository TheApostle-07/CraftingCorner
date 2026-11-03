import Link from 'next/link';
import { Instagram, Facebook, Linkedin, ArrowUpRight } from 'lucide-react';
import type { SiteData } from '@/lib/types';
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
}: {
  footer: FooterData;
  site: SiteData;
}) {
  return (
    <footer className="border-t border-[#d9cdbc] bg-[#eee6da] text-[#574332]">
      <div className="site-container grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.7fr_1fr] lg:gap-16">
        <div>
          <Link href="/" className="font-display text-3xl text-[#3e2b1e]">
            {footer.brandName || site.brandName}
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-7 text-[#796650]">
            Considered furniture and expressive details. Find something that
            feels like you.
          </p>
        </div>
        <nav
          aria-label="Footer"
          className="flex flex-col items-start gap-4 text-sm"
        >
          {(footer.nav || []).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition hover:underline hover:underline-offset-4"
            >
              {link.label}
            </Link>
          ))}
          <Link href="/contact" className="inline-flex items-center gap-2">
            Plan your visit <ArrowUpRight size={15} />
          </Link>
        </nav>
        <div>
          <p className="eyebrow">Visit & connect</p>
          <p className="mt-4 text-sm leading-7">{site.contact.address}</p>
          <a href={`tel:${site.contact.phone}`} className="mt-2 block text-sm">
            {site.contact.phone}
          </a>
          <a
            href={`mailto:${site.contact.email}`}
            className="mt-2 block break-all text-sm"
          >
            {site.contact.email}
          </a>
          <div className="mt-5 flex gap-2">
            {[
              [site.social.instagram, 'Instagram', Instagram],
              [site.social.facebook, 'Facebook', Facebook],
              [site.social.linkedin, 'LinkedIn', Linkedin],
            ].map(([href, label, Icon]) =>
              typeof href === 'string' &&
              href.startsWith('https://') &&
              typeof Icon !== 'string' ? (
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
      <div className="site-container flex flex-wrap justify-between gap-3 border-t border-[#d9cdbc] py-6 text-[11px] text-[#796650]">
        <span>
          © {new Date().getFullYear()} Crafting Corner. All rights reserved.
        </span>
        <span>Mohali, Punjab · Made for living</span>
      </div>
    </footer>
  );
}

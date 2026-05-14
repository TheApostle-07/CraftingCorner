/* -------------------------------------------------------------
   src/components/Footer.tsx
   Premium footer for Crafting Corner
   – Responsive 3-column grid
   – Framer Motion fade-up when it enters viewport
   – Tailwind utilities only
   ------------------------------------------------------------ */

   'use client';

   import { motion } from 'framer-motion';
   import Link from 'next/link';
   import { Instagram, Facebook, Linkedin } from 'lucide-react';
   import type { SiteData } from '@/lib/types';
   
   type FooterData = {
     brandName?: string;
     tagline?: string;
     description?: string;
     newsletterPlaceholder?: string;
     newsletterButtonLabel?: string;
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
     const year = new Date().getFullYear();
     const nav = footer.nav || [];
   
     return (
       <motion.footer
         initial={{ opacity: 0, y: 40 }}
         whileInView={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.8, ease: 'easeOut' }}
         viewport={{ once: true, amount: 0.25 }}
        className="mt-24 border-t border-[#ccb39a] bg-[linear-gradient(180deg,rgba(247,241,232,0.96),rgba(255,255,255,0.98))] text-[#243648] shadow-[inset_0_1px_0_rgba(255,255,255,0.72)] backdrop-blur-md"
      >
         {/* --- top grid --------------------------------------------------- */}
         <div className="mx-auto grid max-w-7xl gap-y-12 gap-x-8 px-4 py-16 sm:grid-cols-2 lg:grid-cols-3">
          {/* 1 / Brand column */}
          <div className="text-center sm:text-left">
            <h2 className="font-display text-2xl text-[#6E4B34]">
              {footer.brandName || site.brandName}
            </h2>
            <p className="mt-4 max-w-xs text-sm leading-6 text-[#42576b]">
              {footer.tagline}
            </p>
            <p className="mt-2 max-w-xs text-sm leading-6 text-[#42576b]">
              {footer.description}
            </p>
          </div>
   
           {/* 2 / Navigation column */}
           <div className="flex flex-col items-center gap-2 sm:items-start sm:gap-3">
             {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="text-sm font-medium text-[#33485c] transition hover:text-[#6E4B34]"
              >
                {n.label}
              </Link>
             ))}
           </div>
   
           {/* 3 / Newsletter + socials column */}
           <div className="flex flex-col items-center sm:items-end">
             <form
               onSubmit={(e) => e.preventDefault()}
               className="flex w-full max-w-md overflow-hidden rounded-brand border border-walnut/30 sm:max-w-xs"
             >
              <input
                type="email"
                required
                placeholder={footer.newsletterPlaceholder || 'Your email'}
                className="flex-1 bg-transparent px-3 py-2 text-sm text-[#243648] outline-none placeholder:text-[#617487]"
              />
              <button
                type="submit"
                className="bg-clay px-4 py-2 text-sm text-ivory transition hover:bg-clay/90"
               >
                 {footer.newsletterButtonLabel || 'Join'}
               </button>
             </form>
   
             {/* socials */}
             <div className="mt-6 flex justify-center gap-4 sm:justify-start">
              <Link
                href={site.social.instagram || '#'}
                aria-label="Instagram"
                className="rounded-full p-2 text-[#33485c] transition hover:bg-[#6E4B34]/10 hover:text-[#6E4B34]"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href={site.social.facebook || '#'}
                aria-label="Facebook"
                className="rounded-full p-2 text-[#33485c] transition hover:bg-[#6E4B34]/10 hover:text-[#6E4B34]"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href={site.social.linkedin || '#'}
                aria-label="LinkedIn"
                className="rounded-full p-2 text-[#33485c] transition hover:bg-[#6E4B34]/10 hover:text-[#6E4B34]"
              >
                <Linkedin className="h-5 w-5" />
              </Link>
             </div>
           </div>
         </div>
   
         {/* bottom bar */}
        <div className="border-t border-[#ccb39a]/70 px-4 py-6 text-center text-sm text-[#536779]">
          © {year} {footer.copyright}
        </div>
      </motion.footer>
    );
  }

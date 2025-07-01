/* ----------------------------------------------------------------------------
   Header.tsx – Adaptive, accessible navigation bar for Crafting Corner
   • Safe‑area support & backdrop‑saturate for iOS
   • Shrinks on scroll, sticky with glass‑morphism
   • Escape‑key & route‑change close the mobile drawer
   • Fully responsive: desktop links, mobile slide‑in menu
   • ARIA‑friendly (aria‑expanded, landmarks)
-----------------------------------------------------------------------------*/
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu as MenuIcon,
  X as CloseIcon,
  ShoppingCart,
  Phone,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// Config – tweak navigation here
// ─────────────────────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '#categories', label: 'Categories' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

// Smooth‑scroll helper for internal #links
function scrollToId(id: string) {
  const el = document.getElementById(id.replace('#', ''));
  if (el) {
    const y = el.getBoundingClientRect().top + window.pageYOffset - 80;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // Close the drawer whenever the route changes
  useEffect(() => setMobileOpen(false), [pathname]);

  // Shrink & elevate on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll when the menu is open & close on "Esc"
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    const onKey = (e: KeyboardEvent) =>
      e.key === 'Escape' && setMobileOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const headerClasses = `fixed inset-x-0 top-0 z-[60] min-h-14 transition-all duration-300
    backdrop-blur-lg backdrop-saturate-150
    ${scrolled ? 'bg-ivory/90 shadow-lg py-2' : 'bg-ivory/60 py-4'}`;

  return (
    <>
      <motion.header
        initial={{ y: -96, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={headerClasses}
      >
        <div className="mx-auto flex max-w-7xl z-50 items-center justify-between px-4 md:px-6 lg:px-8">
          {/* ——— Logo & Brand ——— */}
          <Link
            href="/"
            aria-label="Crafting Corner home"
            className="flex items-center gap-2"
          >
            {/* SVG / PNG logo stored in /public/assets/logo.svg  */}
            <Image
              src="/assets/logo.jpg"
              alt="Crafting Corner logo"
              width={20}
              height={20}
              priority
              className="h-10 w-auto"
            />
            {/* Brand word‑mark – hidden on very small screens to save space */}
            
          </Link>

          {/* ——— Desktop nav ——— */}
          <nav aria-label="Primary" className="hidden gap-6 lg:flex">
            {NAV_LINKS.map((link) => (
              <motion.a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  if (link.href.startsWith('#')) {
                    e.preventDefault();
                    scrollToId(link.href);
                  }
                }}
                whileHover={{ y: -2 }}
                className="text-charcoal/80 transition hover:text-walnut"
              >
                {link.label}
              </motion.a>
            ))}
          </nav>

          {/* ——— Actions ——— */}
          <div className="flex items-center gap-4">
            {/* Cart placeholder */}
            <motion.button
              whileHover={{ rotate: -10 }}
              className="hidden rounded-full p-2 text-walnut hover:bg-walnut/10 lg:inline-flex"
              aria-label="Cart"
            >
              <ShoppingCart className="h-5 w-5" />
            </motion.button>

            {/* WhatsApp quick‑dial */}
            <Link
              href="https://wa.me/919999999999"
              target="_blank"
              className="hidden rounded-full bg-[#7B5A3C] px-4 py-2 text-sm font-medium text-white shadow-lg transition hover:bg-[#694A2F] lg:inline-block"
            >
              <span className="flex items-center gap-2">
                <Phone className="h-4 w-4" /> Enquire
              </span>
            </Link>

            {/* Mobile – Hamburger */}
            <button
              aria-label="Open navigation"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(true)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#7B5A3C] text-white shadow-md transition hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7B5A3C] lg:hidden"
            >
              <MenuIcon className="h-6 w-6" />
              <span className="sr-only">Open menu</span>
            </button>
          </div>
        </div>
      </motion.header>

      {/* ---------------------- Mobile drawer ------------------------------ */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* ---- Dimmed backdrop --------------------------------------- */}
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.45 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            />

            {/* ---- Slide‑in drawer --------------------------------------- */}
            <motion.aside
              key="drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 240, damping: 28 }}
              className="fixed inset-y-0 right-0 z-[60] w-[85vw] max-w-sm overflow-y-auto bg-white px-6 pb-12 pt-[calc(env(safe-area-inset-top)+1rem)] shadow-2xl lg:hidden"
            >
              {/* Close btn */}
              <button
                aria-label="Close menu"
                onClick={() => setMobileOpen(false)}
                className="mb-6 self-end rounded-full p-2 text-walnut hover:bg-walnut/20 focus:outline-none focus:ring-2 focus:ring-walnut/50"
              >
                <CloseIcon className="h-6 w-6" />
              </button>

              {/* Nav links */}
              <ul className="space-y-4">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="block rounded-lg px-3 py-2 text-lg font-medium text-charcoal/90 hover:bg-walnut/10 hover:text-walnut"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <hr className="my-6 border-charcoal/10" />

              {/* WhatsApp CTA */}
              <Link
                href="https://wa.me/919056888917"
                target="_blank"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 font-medium text-white shadow-lg transition hover:bg-[#1DA851]"
              >
                <Phone className="h-4 w-4" /> WhatsApp Enquiry
              </Link>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

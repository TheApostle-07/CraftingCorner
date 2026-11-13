"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight } from "lucide-react";
import BrandLogo from "./BrandLogo";
const navigation = [
  { href: "/products", label: "Collection" },
  { href: "/#categories", label: "Rooms" },
  { href: "/about", label: "Our story" },
  { href: "/blog", label: "Journal" },
  { href: "/contact", label: "Visit & connect" },
];

export default function Header({ showRooms = true }: { showRooms?: boolean }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const drawer = useRef<HTMLDialogElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const homeLink = useRef<HTMLAnchorElement>(null);
  const links = showRooms
    ? navigation
    : navigation.filter(({ href }) => href !== "/#categories");
  useEffect(() => {
    setOpen(false);
  }, [pathname]);
  useEffect(() => {
    if (!open) return;
    const el = drawer.current;
    const desktop = window.matchMedia("(min-width: 1024px)");
    if (desktop.matches) {
      setOpen(false);
      return;
    }
    const previousFocus = document.activeElement as HTMLElement | null;
    const desktopFocus = homeLink.current;
    function closeOnDesktop() {
      if (desktop.matches) setOpen(false);
    }
    el?.showModal();
    closeButton.current?.focus({ preventScroll: true });
    desktop.addEventListener("change", closeOnDesktop);
    return () => {
      desktop.removeEventListener("change", closeOnDesktop);
      el?.close();
      (desktop.matches ? desktopFocus : previousFocus)?.focus({
        preventScroll: true,
      });
    };
  }, [open]);
  return (
    <>
      <a
        href="#main-content"
        className="sr-only z-[100] rounded bg-white p-4 focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <header className="sticky top-0 z-50 border-b border-[#d9c8b5] bg-[#faf7f1]/95 backdrop-blur-xl">
        <div className="site-container site-header-row grid grid-cols-[1fr_auto] items-center gap-3 lg:grid-cols-[1fr_auto_1fr] lg:gap-6">
          <Link
            ref={homeLink}
            href="/"
            aria-label="Crafting Corner home"
            className="inline-flex w-fit items-center rounded-sm"
          >
            <BrandLogo priority />
          </Link>
          <nav
            aria-label="Primary"
            className="hidden items-center gap-6 lg:flex xl:gap-9"
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={pathname === link.href ? "page" : undefined}
                className="site-nav-link"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3 justify-self-end sm:gap-4">
            <Link
              href="/contact"
              className="header-action site-link hidden sm:inline-flex"
            >
              Let’s talk{" "}
              <ArrowUpRight
                size={15}
                className="site-arrow"
                aria-hidden="true"
              />
            </Link>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={open}
              aria-label="Open navigation"
              className="header-action inline-flex lg:hidden"
            >
              Menu <Menu size={18} aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>
      {open ? (
        <dialog
          ref={drawer}
          aria-label="Mobile navigation"
          onCancel={() => setOpen(false)}
          onClose={() => setOpen(false)}
          className="site-menu fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none overscroll-contain bg-[#faf7f1] p-0 text-[#483424]"
        >
          <div className="site-container site-header-row flex items-center justify-between gap-4 border-b border-[#d9c8b5]">
            <Link
              href="/"
              aria-label="Crafting Corner home"
              onClick={() => setOpen(false)}
              className="inline-flex items-center rounded-sm"
            >
              <BrandLogo />
            </Link>
            <button
              ref={closeButton}
              autoFocus
              type="button"
              aria-label="Close navigation"
              onClick={() => setOpen(false)}
              className="header-action inline-flex"
            >
              Close <X size={18} aria-hidden="true" />
            </button>
          </div>
          <nav
            aria-label="Mobile"
            className="site-container mx-auto mt-6 flex max-w-lg flex-col"
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={pathname === link.href ? "page" : undefined}
                onClick={() => setOpen(false)}
                className="site-link flex min-h-14 items-center justify-between gap-4 border-b border-[#ded3c5] font-display text-3xl font-normal aria-[current=page]:text-walnut"
              >
                {link.label}
                <ArrowUpRight
                  size={18}
                  className="site-arrow"
                  aria-hidden="true"
                />
              </Link>
            ))}
          </nav>
          <p className="site-container mx-auto max-w-lg py-7 text-sm text-[#7c6852]">
            Thoughtful furniture. Personal spaces.
          </p>
        </dialog>
      ) : null}
    </>
  );
}

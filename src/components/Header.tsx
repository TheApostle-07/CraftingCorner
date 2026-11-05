"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight } from "lucide-react";
const links = [
  { href: "/products", label: "Collection" },
  { href: "/#categories", label: "Rooms" },
  { href: "/about", label: "Our story" },
  { href: "/blog", label: "Journal" },
  { href: "/contact", label: "Visit & connect" },
];
export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const drawer = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    setOpen(false);
  }, [pathname]);
  useEffect(() => {
    if (!open) return;
    const el = drawer.current,
      before = document.body.style.overflow;
    const previousFocus = document.activeElement as HTMLElement | null;
    el?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      el?.close();
      document.body.style.overflow = before;
      previousFocus?.focus({ preventScroll: true });
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
      <header className="fixed inset-x-0 top-0 z-50 border-b border-[#e1d7c9]/80 bg-[#faf7f1]/95 backdrop-blur-xl">
        <div className="site-container flex h-20 items-center justify-between gap-5">
          <Link
            href="/"
            aria-label="Crafting Corner home"
            className="leading-none text-[#483424]"
          >
            <span className="block font-display text-[1.7rem] font-medium tracking-tight sm:text-3xl">
              Crafting Corner
            </span>
            <span className="mt-1.5 block text-[8px] uppercase tracking-[0.35em] text-[#8b735b]">
              Furniture & living
            </span>
          </Link>
          <nav
            aria-label="Primary"
            className="hidden items-center gap-7 lg:flex"
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={pathname === link.href ? "page" : undefined}
                className="min-h-11 content-center text-[13px] font-normal text-[#66513e] transition hover:text-[#2e2117]"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <Link
            href="/contact"
            className="hidden items-center gap-2 rounded-full border border-[#bca48b] px-5 py-2.5 text-xs text-[#523b2b] transition hover:bg-[#eee7dc] sm:inline-flex"
          >
            Let’s talk <ArrowUpRight size={15} />
          </Link>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-haspopup="dialog"
            aria-label="Open navigation"
            className="grid h-11 w-11 place-items-center text-walnut lg:hidden"
          >
            <Menu size={22} />
          </button>
        </div>
      </header>
      {open ? (
        <dialog
          ref={drawer}
          aria-label="Mobile navigation"
          onCancel={() => setOpen(false)}
          onClose={() => setOpen(false)}
          className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none bg-[#faf7f1] p-6 text-[#483424]"
        >
          <div className="flex items-center justify-between">
            <span className="font-display text-2xl">Crafting Corner</span>
            <button
              autoFocus
              aria-label="Close navigation"
              onClick={() => setOpen(false)}
              className="grid h-12 w-12 place-items-center"
            >
              <X size={24} />
            </button>
          </div>
          <nav aria-label="Mobile" className="mt-14 flex flex-col gap-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="flex min-h-16 items-center justify-between border-b border-[#ded3c5] font-display text-3xl"
              >
                {link.label}
                <ArrowUpRight size={20} />
              </Link>
            ))}
          </nav>
          <p className="mt-10 text-sm text-[#7c6852]">
            Thoughtful furniture. Personal spaces.
          </p>
        </dialog>
      ) : null}
    </>
  );
}

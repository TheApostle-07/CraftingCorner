/* --------------------------------------------------------------------------
   Global Root Layout
   – Injects Tailwind via CDN (beforeInteractive)
   – Wraps every page with <Header> / <Footer>
   – Adds a floating WhatsApp CTA that stays on every route
--------------------------------------------------------------------------- */
import type { ReactNode } from 'react';
import Script from 'next/script';

import Header from '../components/Header';
import Footer from '../components/Footer';
import FloatingWhatsapp from '../components/FloatingWhatsapp';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      {/* <head> is fine to live here in Next 15’s “app” router */}
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        {/* Put custom fonts, favicons, analytics, etc. here */}
      </head>

      <body className="relative antialiased">
        {/* ── Sticky global header ─────────────────────────── */}
        <Header />

        {/* ── Page-specific content ───────────────────────── */}
        <main className="min-h-screen pt-20">{children}</main>

        {/* ── Global footer ───────────────────────────────── */}
        <Footer />

        {/* ── Floating WhatsApp CTA (persists site-wide) ─── */}
        <FloatingWhatsapp
          phone="+919056888917"            /* update to your number */
          message="Hi! I'm interested in your furniture."
        />

        {/* Tailwind via CDN – loaded *before* any component JS executes */}
        <Script
          id="tailwind-cdn"
          src="https://cdn.tailwindcss.com"
          strategy="beforeInteractive"
        />
      </body>
    </html>
  );
}

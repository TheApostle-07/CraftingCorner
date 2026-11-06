import type { ReactNode } from "react";
import type { Metadata } from "next";
import localFont from "next/font/local";

import "./globals.css";
import "./journal.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.craftingcorner.in"),
  title: "Crafting Corner | Furniture & Living in Mohali",
  description:
    "Explore the Crafting Corner showroom collection: expressive furniture, considered details and personal guidance for your space.",
  openGraph: {
    type: "website",
    siteName: "Crafting Corner",
    images: ["/images/real/large/DSC00397.webp"],
  },
};

const displayFont = localFont({
  src: "./fonts/cormorant-garamond.woff2",
  variable: "--font-display",
  weight: "400 700",
  adjustFontFallback: "Times New Roman",
});

const sansFont = localFont({
  src: "./fonts/manrope.woff2",
  variable: "--font-sans",
  weight: "400 800",
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="icon" href="/favicon.png" type="image/png" sizes="64x64" />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Crafting Corner Journal"
          href="/blog/feed.xml"
        />
      </head>

      <body
        className={`${displayFont.variable} ${sansFont.variable} relative min-h-screen bg-ivory text-charcoal antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

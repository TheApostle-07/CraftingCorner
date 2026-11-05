import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";

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

const displayFont = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
});

const sansFont = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800"],
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
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

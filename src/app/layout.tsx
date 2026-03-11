import type { ReactNode } from 'react';
import { Cormorant_Garamond, Manrope } from 'next/font/google';

import './globals.css';

const displayFont = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700'],
});

const sansFont = Manrope({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '500', '600', '700', '800'],
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>

      <body
        className={`${displayFont.variable} ${sansFont.variable} relative min-h-screen bg-ivory text-charcoal antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

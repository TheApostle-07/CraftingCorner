import type { ReactNode } from 'react';
import Script from 'next/script';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
      </head>

      <body className="relative antialiased">
        {children}

        <Script
          id="tailwind-cdn"
          src="https://cdn.tailwindcss.com"
          strategy="beforeInteractive"
        />
      </body>
    </html>
  );
}

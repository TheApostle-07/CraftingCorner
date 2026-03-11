import type { ReactNode } from 'react';

import Footer from '@/components/Footer';
import FloatingWhatsapp from '@/components/FloatingWhatsapp';
import Header from '@/components/Header';
import PaymentPendingExperience from '@/components/PaymentPendingExperience';
import { getSiteStatus } from '@/lib/siteStatus';

export const dynamic = 'force-dynamic';

export default async function SiteLayout({
  children,
}: {
  children: ReactNode;
}) {
  const status = await getSiteStatus();

  if (!status.active) {
    return <PaymentPendingExperience />;
  }

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20">{children}</main>
      <Footer />
      <FloatingWhatsapp
        phone="+919056888917"
        message="Hi! I'm interested in your furniture."
      />
    </>
  );
}

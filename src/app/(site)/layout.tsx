import type { ReactNode } from 'react';

import Footer from '@/components/Footer';
import FloatingWhatsapp from '@/components/FloatingWhatsapp';
import Header from '@/components/Header';
import PaymentPendingExperience from '@/components/PaymentPendingExperience';
import siteData from '@/data/site.json';
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
      {siteData.whatsapp.enabled ? (
        <FloatingWhatsapp
          phone={siteData.whatsapp.number}
          message={siteData.whatsapp.defaultMessage}
        />
      ) : null}
    </>
  );
}

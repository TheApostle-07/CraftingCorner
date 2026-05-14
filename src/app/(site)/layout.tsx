import type { ReactNode } from 'react';

import Footer from '@/components/Footer';
import FloatingWhatsapp from '@/components/FloatingWhatsapp';
import Header from '@/components/Header';
import PaymentPendingExperience from '@/components/PaymentPendingExperience';
import { loadFooterData, loadSiteData } from '@/lib/loaders.server';
import { getSiteStatus } from '@/lib/siteStatus';

export const dynamic = 'force-dynamic';

export default async function SiteLayout({
  children,
}: {
  children: ReactNode;
}) {
  const status = await getSiteStatus();
  const siteData = await loadSiteData();
  const footerData = await loadFooterData();

  if (!status.active) {
    return <PaymentPendingExperience />;
  }

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20">{children}</main>
      <Footer footer={footerData} site={siteData} />
      {siteData.whatsapp.enabled ? (
        <FloatingWhatsapp
          phone={siteData.whatsapp.number}
          message={siteData.whatsapp.defaultMessage}
        />
      ) : null}
    </>
  );
}

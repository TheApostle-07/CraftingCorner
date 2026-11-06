import type { ReactNode } from "react";

import Footer from "@/components/Footer";
import FloatingWhatsapp from "@/components/FloatingWhatsapp";
import Header from "@/components/Header";
import PaymentPendingExperience from "@/components/PaymentPendingExperience";
import SiteReveal from "@/components/SiteReveal";
import { readPublicContent } from "@/lib/adminContent.server";
import { getSiteStatus } from "@/lib/siteStatus";
import { absoluteUrl, jsonLd } from "@/lib/seo";

export const dynamic = "force-dynamic";

export default async function SiteLayout({
  children,
}: {
  children: ReactNode;
}) {
  const status = await getSiteStatus();
  if (!status.active) {
    return <PaymentPendingExperience />;
  }
  const {
    site: siteData,
    footer: footerData,
    homepage,
    categories,
  } = await readPublicContent();
  const showRooms =
    homepage.sections.browseCategories.visible &&
    categories.some((category) => category.visibility !== "draft");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd({
            "@context": "https://schema.org",
            "@type": "Organization",
            "@id": absoluteUrl("/#organization"),
            name: siteData.brandName,
            url: absoluteUrl("/"),
            email: siteData.contact.email,
            telephone: siteData.contact.phone,
            address: siteData.contact.address,
            ...(siteData.logoImage
              ? { logo: absoluteUrl(siteData.logoImage) }
              : {}),
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: siteData.brandName,
            url: absoluteUrl("/"),
            inLanguage: "en-IN",
          }),
        }}
      />
      <Header showRooms={showRooms} />
      <main id="main-content" className="min-h-screen">
        {children}
      </main>
      <SiteReveal />
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

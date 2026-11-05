import type { Metadata } from "next";
export const SITE_URL = "https://www.craftingcorner.in";
export const absoluteUrl = (path: string) => new URL(path, SITE_URL).href;
export function pageMetadata(
  title: string,
  description: string,
  path: string,
  image = "/images/real/large/DSC00397.webp",
  noIndex = false,
): Metadata {
  return {
    title,
    description,
    alternates: { canonical: absoluteUrl(path) },
    robots: noIndex
      ? { index: false, follow: true }
      : { index: true, follow: true },
    openGraph: {
      type: "website",
      title,
      description,
      url: absoluteUrl(path),
      siteName: "Crafting Corner",
      images: [absoluteUrl(image)],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteUrl(image)],
    },
  };
}
export const jsonLd = (value: unknown) =>
  JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
export const breadcrumbs = (items: { name: string; path: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: absoluteUrl(item.path),
  })),
});

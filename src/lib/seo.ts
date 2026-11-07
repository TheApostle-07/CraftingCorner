import type { Metadata } from "next";
export const SITE_URL = "https://www.craftingcorner.in";
export const absoluteUrl = (path: string) => new URL(path, SITE_URL).href;
export const homeTitle = "Crafting Corner | Bespoke Furniture in Mohali";
export const homeDescription =
  "Crafting Corner is a bespoke furniture studio in Mohali, Punjab. Explore our showroom collection and discuss furniture tailored to your space.";

export function articleCanonical(slug: string, override?: string) {
  return override ? absoluteUrl(override) : absoluteUrl(`/blog/${slug}`);
}

export const escapeXml = (value: string) =>
  value.replace(
    /[<>&"']/g,
    (char) =>
      ({
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        '"': "&quot;",
        "'": "&apos;",
      })[char]!,
  );

export function pageMetadata(
  title: string,
  description: string,
  path: string,
  image = "/images/real/large/DSC00397.webp",
  noIndex = false,
): Metadata {
  const canonical = absoluteUrl(path);
  return {
    title,
    description,
    alternates: { canonical },
    robots: noIndex
      ? { index: false, follow: true }
      : {
          index: true,
          follow: true,
          googleBot: { "max-image-preview": "large" },
        },
    openGraph: {
      type: "website",
      title,
      description,
      url: canonical,
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

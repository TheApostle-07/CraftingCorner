import widths from "@/data/photoWidths.json";

export function realPhotoSrcSet(src: string | undefined) {
  const match = src?.match(/^\/images\/real\/large\/([\w-]+\.webp)$/);
  if (!match) return undefined;
  const name = match[1] as keyof typeof widths;
  const dimensions = widths[name];
  if (!dimensions) return undefined;
  const [small, large] = dimensions;
  return `/images/real/small/${name} ${small}w, /images/real/medium/${name} 900w, ${src} ${large}w`;
}

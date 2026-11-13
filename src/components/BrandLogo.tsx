import Image from "next/image";

export default function BrandLogo({
  priority = false,
  className = "",
}: {
  priority?: boolean;
  className?: string;
}) {
  return (
    <Image
      src="/assets/img/crafting-corner-lockup.webp"
      alt="Crafting Corner"
      width={480}
      height={377}
      priority={priority}
      className={`brand-logo ${className}`}
    />
  );
}

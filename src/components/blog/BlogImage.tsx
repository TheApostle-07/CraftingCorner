"use client";
import { useState } from "react";
export default function BlogImage({
  src,
  alt,
  width = 1333,
  height = 2000,
  className = "",
  priority = false,
}: {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState("");
  const srcSet = src?.startsWith("/images/real/large/")
    ? `${src.replace("/large/", "/small/")} 600w, ${src} 1333w`
    : src?.startsWith("https://res.cloudinary.com/")
      ? [600, 1200, 2000]
          .map(
            (size) =>
              `${src.replace("/image/upload/", `/image/upload/c_limit,w_${size},q_auto,f_auto/`)} ${size}w`,
          )
          .join(", ")
      : undefined;
  if (!src || failed === src)
    return (
      <div
        role="img"
        aria-label={alt}
        className={`grid min-h-40 place-items-center bg-[#eee8df] p-6 text-center text-xs text-[#796650] ${className}`}
        style={{ aspectRatio: `${width}/${height}` }}
      >
        Photograph temporarily unavailable
      </div>
    );
  return (
    <img
      src={src}
      srcSet={srcSet}
      sizes="(max-width:640px) calc(100vw - 40px), (max-width:1024px) 80vw, 1000px"
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
      onError={() => setFailed(src)}
    />
  );
}

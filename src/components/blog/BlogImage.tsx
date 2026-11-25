"use client";
import { useState } from "react";
import { realPhotoSrcSet } from "@/lib/photoSources";
export default function BlogImage({
  src,
  alt,
  width = 1333,
  height = 2000,
  className = "",
  sizes = "(max-width:639px) calc(100vw - 40px), 680px",
  priority = false,
}: {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState("");
  const [retry, setRetry] = useState("");
  const srcSet =
    retry !== src
      ? realPhotoSrcSet(src) ??
        (src?.startsWith("https://res.cloudinary.com/") &&
        src.includes("/image/upload/")
          ? [600, 1200, 2000]
              .map(
                (size) =>
                  `${src.replace("/image/upload/", `/image/upload/c_limit,w_${size},q_auto,f_auto/`)} ${size}w`,
              )
              .join(", ")
          : undefined)
      : undefined;
  function recoverImage(image: HTMLImageElement) {
    if (srcSet && image.currentSrc !== image.src) setRetry(src);
    else setFailed(src);
  }
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
      key={srcSet ? "responsive" : "original"}
      ref={(image) => {
        if (image?.complete && image.naturalWidth === 0) recoverImage(image);
      }}
      src={src}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
      onError={({ currentTarget }) => recoverImage(currentTarget)}
    />
  );
}

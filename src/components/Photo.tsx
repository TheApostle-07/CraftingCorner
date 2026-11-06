'use client';
import { useState } from 'react';
import { ImageOff } from 'lucide-react';

type Props = {
  src: string;
  alt: string;
  className?: string;
  fit?: 'contain' | 'cover';
  priority?: boolean;
  position?: string;
  sizes?: string;
};
export default function Photo({
  src,
  alt,
  className = '',
  fit = 'contain',
  priority = false,
  position = '50% 50%',
  sizes = '(max-width: 640px) 100vw, 50vw',
}: Props) {
  const [failedSrc, setFailedSrc] = useState('');
  const [retrySrc, setRetrySrc] = useState('');
  const small = src?.includes('/images/real/large/')
    ? src.replace('/large/', '/small/')
    : '';
  const responsive = small && retrySrc !== src;

  function recoverImage(image: HTMLImageElement) {
    if (responsive && image.currentSrc !== image.src) {
      setRetrySrc(src);
    } else {
      setFailedSrc(src);
    }
  }

  if (!src || failedSrc === src)
    return (
      <div
        className={`grid place-items-center bg-[#eee8df] text-walnut ${className}`}
        role="img"
        aria-label={alt}
      >
        <span className="flex flex-col items-center gap-3 p-6 text-center text-sm">
          <ImageOff size={24} />
          Photograph unavailable
        </span>
      </div>
    );
  return (
    <picture className={`block overflow-hidden bg-[#eee8df] ${className}`}>
      {responsive ? (
        <source
          srcSet={`${small} 600w, ${src} 1333w`}
          sizes={sizes}
          type="image/webp"
        />
      ) : null}
      <img
        key={responsive ? 'responsive' : 'original'}
        ref={(image) => {
          // A server-rendered image can fail before React attaches onError.
          if (image?.complete && image.naturalWidth === 0) recoverImage(image);
        }}
        src={src}
        alt={alt}
        width={1333}
        height={2000}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
        onError={({ currentTarget }) => recoverImage(currentTarget)}
        className={`h-full w-full ${fit === 'cover' ? 'object-cover' : 'object-contain'}`}
        style={{ objectPosition: position }}
      />
    </picture>
  );
}

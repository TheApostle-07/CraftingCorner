'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export type ProductCardProps = {
  title: string;
  price: number;
  /** Single image URL or an array coming from the gallery JSON */
  img: string | string[];
  slug: string;
};

export default function ProductCard({ title, price, img, slug }: ProductCardProps) {
  // Always show the first image – keeps the calling code simple
  const imgSrc = Array.isArray(img) ? img[0] : img;

  return (
    <motion.article
      whileHover={{ y: -4, boxShadow: '0px 8px 24px rgba(0,0,0,0.15)' }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="group relative rounded-brand bg-ivory shadow-sm transition overflow-visible"
    >
      {/* ——— Product image ——— */}
      <Link href={`/products/${slug}`} className="block">
        <Image
          src={imgSrc}
          alt={title}
          width={500}
          height={500}
          sizes="(min-width: 1024px) 250px, (min-width: 640px) 33vw, 50vw"
          priority={false}
          loading="lazy"
          className="aspect-square w-full rounded-t-brand object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </Link>

      {/* ——— Card body ——— */}
      <div className="p-4">
        <h3 className="font-display text-lg text-walnut group-hover:underline">{title}</h3>
        <p className="mt-1 text-brass">₹ {price.toLocaleString('en-IN')}</p>
      </div>

      {/* ——— Quick-view overlay (desktop hover) ——— */}
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="pointer-events-none absolute inset-0 hidden items-center justify-center rounded-brand bg-walnut/70 backdrop-blur-sm sm:flex z-10"
      >
        <span className="pointer-events-auto inline-flex items-center gap-2 rounded-brand bg-ivory px-4 py-2 text-sm font-medium text-walnut transition hover:bg-ivory/90">
          Quick View
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </span>
      </motion.div>
    </motion.article>
  );
}
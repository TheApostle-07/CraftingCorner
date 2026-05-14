'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Eye, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import type { Product } from '@/lib/types';

export type ProductCardProps = Pick<Product, 'title' | 'price' | 'img' | 'slug'> &
  Partial<Pick<Product, 'category' | 'description' | 'tags'>>;

function formatLabel(value: string) {
  return value
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function getFallbackDescription(title: string) {
  return `Preview ${title.toLowerCase()} here, then open the full product page for the complete gallery, finish details, and related pieces.`;
}

export default function ProductCard({
  title,
  price,
  img,
  slug,
  category,
  description,
  tags,
}: ProductCardProps) {
  const gallery = (Array.isArray(img) ? img : [img]).filter(Boolean) as string[];
  const imgSrc = gallery[0] || '/assets/img/products/bestseller_1.png';
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const detailHref = `/products/${slug}`;
  const priceLabel = `₹ ${price.toLocaleString('en-IN')}`;
  const categoryLabel = category ? formatLabel(category) : null;
  const previewDescription = description?.trim() || getFallbackDescription(title);
  const previewTags = tags?.slice(0, 4) || [];
  const activeImage = gallery[activeImageIndex] || imgSrc;

  useEffect(() => {
    if (!isQuickViewOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsQuickViewOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isQuickViewOpen]);

  useEffect(() => {
    if (isQuickViewOpen) {
      setActiveImageIndex(0);
    }
  }, [isQuickViewOpen]);

  return (
    <>
      <motion.article
        whileHover={{ y: -6, boxShadow: '0px 18px 38px rgba(16,24,40,0.12)' }}
        transition={{ duration: 0.28, ease: 'easeOut' }}
        className="group relative overflow-hidden rounded-[1.75rem] border border-[#e7ddd1] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(247,241,232,0.88))] shadow-[0_12px_30px_rgba(110,75,52,0.08)]"
      >
        <div className="relative overflow-hidden">
          <Link href={detailHref} className="block">
            <Image
              src={imgSrc}
              alt={title}
              width={500}
              height={500}
              sizes="(min-width: 1024px) 250px, (min-width: 640px) 33vw, 50vw"
              priority={false}
              loading="lazy"
              className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
          </Link>

          <div className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(180deg,rgba(15,23,33,0.05),rgba(15,23,33,0.62))] opacity-0 transition duration-300 group-hover:opacity-100 sm:block" />

          <div className="absolute inset-x-4 top-4 hidden items-start justify-between gap-3 sm:flex">
            {categoryLabel ? (
              <span className="rounded-full border border-white/30 bg-white/16 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-md">
                {categoryLabel}
              </span>
            ) : (
              <span />
            )}

            <button
              type="button"
              aria-haspopup="dialog"
              aria-label={`Quick view ${title}`}
              onClick={() => setIsQuickViewOpen(true)}
              className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/88 px-3.5 py-2 text-sm font-semibold text-[#203446] shadow-[0_10px_26px_rgba(12,24,35,0.14)] transition hover:bg-white"
            >
              <Eye className="h-4 w-4" />
              Quick View
            </button>
          </div>
        </div>

        <div className="p-5">
          <div className="space-y-2">
            <Link
              href={detailHref}
              className="block font-display text-xl leading-snug text-walnut transition group-hover:text-[#513726]"
            >
              {title}
            </Link>
            <p className="text-base font-semibold text-[#a15a17]">{priceLabel}</p>
            {description ? (
              <p className="text-sm leading-6 text-charcoal/72">{description}</p>
            ) : null}
          </div>

          <div className="mt-5 flex items-center justify-between gap-3 border-t border-[#e5d9cb] pt-4">
            <button
              type="button"
              aria-haspopup="dialog"
              onClick={() => setIsQuickViewOpen(true)}
              className="inline-flex items-center gap-2 rounded-full border border-[#d7c7b6] bg-white/92 px-4 py-2 text-sm font-semibold text-[#22384a] transition hover:border-[#c4ae98] hover:bg-white"
            >
              <Eye className="h-4 w-4" />
              Quick View
            </button>

            <Link
              href={detailHref}
              className="inline-flex items-center gap-2 text-sm font-semibold text-walnut transition hover:text-[#513726]"
            >
              View Details
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </motion.article>

      <AnimatePresence>
        {isQuickViewOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-end justify-center bg-[rgba(12,24,35,0.74)] p-3 backdrop-blur-md sm:p-5 md:items-center"
            onClick={() => setIsQuickViewOpen(false)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby={`quick-view-title-${slug}`}
              initial={{ opacity: 0, y: 28, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.98 }}
              transition={{ duration: 0.24, ease: 'easeOut' }}
              onClick={(event) => event.stopPropagation()}
              className="relative w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/55 bg-[linear-gradient(145deg,rgba(255,255,255,0.99),rgba(242,247,252,0.97)_52%,rgba(250,244,235,0.98))] shadow-[0_30px_90px_rgba(12,24,35,0.28)]"
            >
              <div className="absolute inset-x-0 top-0 h-32 bg-[radial-gradient(circle_at_top,rgba(108,147,188,0.22),transparent_68%)]" />

              <button
                type="button"
                aria-label="Close quick view"
                onClick={() => setIsQuickViewOpen(false)}
                className="absolute right-4 top-4 z-20 inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#d7deea] bg-white/94 text-[#294153] shadow-[0_12px_30px_rgba(12,24,35,0.12)] transition hover:bg-white"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="grid md:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
                <div className="border-b border-[#e1e7ef] md:border-b-0 md:border-r">
                  <div className="p-4 sm:p-6">
                    <div className="overflow-hidden rounded-[1.6rem] bg-[linear-gradient(180deg,#edf3fa,#f8fbfd)] shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
                      <Image
                        src={activeImage}
                        alt={title}
                        width={960}
                        height={760}
                        className="aspect-[4/3] w-full object-cover"
                      />
                    </div>

                    {gallery.length > 1 ? (
                      <div className="mt-4 grid grid-cols-4 gap-3">
                        {gallery.map((image, index) => (
                          <button
                            key={`${slug}-preview-${index}`}
                            type="button"
                            aria-label={`Show preview image ${index + 1} for ${title}`}
                            onClick={() => setActiveImageIndex(index)}
                            className={`overflow-hidden rounded-[1.1rem] border transition ${
                              activeImageIndex === index
                                ? 'border-[#6c93bc] shadow-[0_12px_24px_rgba(108,147,188,0.22)]'
                                : 'border-[#d7deea] hover:border-[#aebfd2]'
                            }`}
                          >
                            <Image
                              src={image}
                              alt={`${title} preview ${index + 1}`}
                              width={220}
                              height={180}
                              className="aspect-[4/3] w-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="relative flex flex-col p-5 sm:p-7">
                  <div className="pr-12">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-full border border-[#c8d7e5] bg-[#f4f8fb] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#456786]">
                        Quick View
                      </span>
                      {categoryLabel ? (
                        <span className="rounded-full border border-[#e2d7c6] bg-white/88 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7b5a3c]">
                          {categoryLabel}
                        </span>
                      ) : null}
                    </div>

                    <h3
                      id={`quick-view-title-${slug}`}
                      className="mt-5 font-display text-3xl leading-tight text-[#1f3447] sm:text-[2.15rem]"
                    >
                      {title}
                    </h3>

                    <p className="mt-3 text-lg font-semibold text-[#a15a17]">
                      {priceLabel}
                    </p>
                    <p className="mt-4 text-sm leading-7 text-[#415567] sm:text-[0.98rem]">
                      {previewDescription}
                    </p>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <div className="rounded-[1rem] border border-[#d6e0ea] bg-white/84 px-4 py-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#5d7489]">
                        Preview
                      </p>
                      <p className="mt-1 text-sm font-medium text-[#1f3447]">
                        {gallery.length > 1 ? `${gallery.length} curated images` : 'Single hero image'}
                      </p>
                    </div>

                    <div className="rounded-[1rem] border border-[#e5dacb] bg-white/84 px-4 py-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7a6248]">
                        Access
                      </p>
                      <p className="mt-1 text-sm font-medium text-[#3d3026]">
                        Full details available on product page
                      </p>
                    </div>
                  </div>

                  {previewTags.length > 0 ? (
                    <div className="mt-6 flex flex-wrap gap-2">
                      {previewTags.map((tag) => (
                        <span
                          key={`${slug}-${tag}`}
                          className="rounded-full border border-[#d6dfeb] bg-[#f8fbfd] px-3 py-1.5 text-xs font-medium text-[#395268]"
                        >
                          {formatLabel(tag)}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  <div className="mt-6 rounded-[1.5rem] border border-[#d9e4ef] bg-[linear-gradient(180deg,rgba(255,255,255,0.88),rgba(243,248,252,0.94))] p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#59738a]">
                      Product Preview
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[#486072]">
                      This quick view is built for fast browsing. Open the full page to review the complete gallery, related pieces, and the final product context.
                    </p>
                  </div>

                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <Link
                      href={detailHref}
                      onClick={() => setIsQuickViewOpen(false)}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-[#294153] px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_36px_rgba(41,65,83,0.22)] transition hover:bg-[#1f3447]"
                    >
                      View Full Details
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>

                    <button
                      type="button"
                      onClick={() => setIsQuickViewOpen(false)}
                      className="inline-flex items-center justify-center rounded-full border border-[#d0dae6] bg-white/92 px-5 py-3 text-sm font-semibold text-[#294153] transition hover:bg-white"
                    >
                      Continue Browsing
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

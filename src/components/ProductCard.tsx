'use client';
import { ArrowUpRight, ChevronLeft, ChevronRight, Eye, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import Photo from './Photo';
import { productGallery, productPrice } from '@/lib/productPresentation';
import type { Product } from '@/lib/types';

export type ProductCardProps = Pick<
  Product,
  'title' | 'price' | 'img' | 'slug'
> &
  Partial<Product>;
export default function ProductCard(product: ProductCardProps) {
  const { title, slug, description, shortDescription, priceStatus, priceUnit } =
    product;
  const gallery = productGallery(product);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const details = `/products/${slug}`;
  useEffect(() => {
    if (!open) return;
    const element = dialog.current;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previous = document.body.style.overflow;
    element?.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      element?.close();
      document.body.style.overflow = previous;
      previousFocus?.focus({ preventScroll: true });
    };
  }, [open]);
  return (
    <>
      <article className="catalogue-card group flex h-full min-w-0 flex-col">
        <div className="relative overflow-hidden rounded-2xl bg-[#eee8df]">
          <Link href={details} aria-label={`View ${title}`} className="block">
            <Photo
              src={gallery[0]}
              alt={product.images?.[0]?.alt || title}
              className="aspect-[2/3] w-full transition-transform duration-500 motion-safe:group-hover:scale-[1.025]"
              sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
            />
          </Link>
          <button
            type="button"
            aria-label={`Quick view ${title}`}
            aria-haspopup="dialog"
            onClick={() => {
              setActive(0);
              setOpen(true);
            }}
            className="absolute bottom-4 right-4 grid h-11 w-11 place-items-center rounded-full border border-white/70 bg-white/95 text-walnut shadow-sm transition hover:bg-ivory"
          >
            <Eye size={18} />
          </button>
        </div>
        <div className="flex flex-1 flex-col pt-5">
          <p className="eyebrow mb-2">
            {product.tags?.[0] || 'The collection'}
          </p>
          <h3 className="line-clamp-2 min-h-[3.4rem] font-display text-[1.65rem] font-normal leading-[1.1] text-[#34271e]">
            <Link href={details}>{title}</Link>
          </h3>
          <p className="mt-3 line-clamp-2 min-h-[2.75rem] text-sm leading-[1.6] text-[#726354]">
            {shortDescription || description}
          </p>
          <div className="mt-4 flex flex-wrap items-baseline justify-between gap-2">
            <p className="text-base font-medium text-[#4c3728]">
              {productPrice(product)}
            </p>
            {priceStatus === 'estimate' ? (
              <span className="text-xs text-[#756555]">
                Final price on enquiry
              </span>
            ) : null}
          </div>
          <Link
            href={details}
            className="mt-5 flex min-h-12 items-center justify-between border-t border-[#ddd2c4] text-sm font-medium text-walnut transition hover:text-charcoal"
          >
            Discover this piece <ArrowUpRight size={18} />
          </Link>
        </div>
      </article>
      {open ? (
        <dialog
          ref={dialog}
          aria-labelledby={`quick-title-${slug}`}
          onCancel={() => setOpen(false)}
          onClose={() => setOpen(false)}
          onClick={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
          className="quick-dialog rounded-2xl border border-[#e0d4c5] bg-[#fffdf8] p-0 text-charcoal shadow-2xl backdrop:bg-black/60 backdrop:backdrop-blur-sm"
        >
          <div className="relative grid sm:grid-cols-2">
            <button
              autoFocus
              type="button"
              aria-label="Close quick view"
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3 z-10 grid h-11 w-11 place-items-center rounded-full bg-white text-walnut shadow"
            >
              <X size={20} />
            </button>
            <div className="relative bg-[#eee8df]">
              <Photo
                src={gallery[active]}
                alt={product.images?.[active]?.alt || title}
                className="h-[min(48dvh,440px)] w-full sm:h-full sm:min-h-[480px]"
              />
              {gallery.length > 1 ? (
                <div className="absolute inset-x-4 bottom-4 flex items-center justify-between">
                  <button
                    aria-label="Previous photograph"
                    onClick={() =>
                      setActive((active - 1 + gallery.length) % gallery.length)
                    }
                    className="grid h-11 w-11 place-items-center rounded-full bg-white/95"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <span className="rounded-full bg-white/95 px-3 py-2 text-xs">
                    {active + 1} / {gallery.length}
                  </span>
                  <button
                    aria-label="Next photograph"
                    onClick={() => setActive((active + 1) % gallery.length)}
                    className="grid h-11 w-11 place-items-center rounded-full bg-white/95"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              ) : null}
            </div>
            <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
              <p className="eyebrow">A closer look</p>
              <h2
                id={`quick-title-${slug}`}
                className="mt-4 font-display text-3xl font-normal leading-tight sm:text-4xl"
              >
                {title}
              </h2>
              <p className="mt-5 text-lg text-walnut">
                {productPrice(product)}
              </p>
              {priceStatus === 'estimate' ? (
                <p className="mt-1 text-xs leading-5 text-[#756555]">
                  Final price on enquiry{priceUnit ? ` · ${priceUnit}` : ''}
                </p>
              ) : null}
              <p className="mt-5 text-sm leading-7 text-[#695b4d]">
                {shortDescription || description}
              </p>
              <Link
                href={details}
                onClick={() => setOpen(false)}
                className="site-button mt-7"
              >
                View details & enquire <ArrowUpRight size={17} />
              </Link>
            </div>
          </div>
        </dialog>
      ) : null}
    </>
  );
}

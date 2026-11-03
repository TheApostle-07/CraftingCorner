'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, MessageCircle } from 'lucide-react';
import Photo from './Photo';
import ProductCard from './ProductCard';
import {
  enquiryHref,
  productGallery,
  productPrice,
} from '@/lib/productPresentation';
import type { Product, SiteData } from '@/lib/types';

export default function ProductView({
  product,
  related,
  site,
}: {
  product: Product;
  related: Product[];
  site: SiteData;
}) {
  const gallery = productGallery(product);
  const [active, setActive] = useState(0);
  const href = enquiryHref(product, site);
  return (
    <div className="site-container pb-16 pt-6 sm:pt-10">
      <Link
        href="/products"
        className="mb-7 inline-flex min-h-11 items-center gap-2 text-sm text-[#796650]"
      >
        <ArrowLeft size={16} /> Back to the collection
      </Link>
      <section className="grid items-start gap-8 md:grid-cols-2 lg:gap-16">
        <div>
          <Photo
            src={gallery[active]}
            alt={product.images?.[active]?.alt || product.title}
            className="aspect-[2/3] w-full rounded-2xl"
            priority
            sizes="(max-width: 767px) 100vw, 50vw"
          />
          {gallery.length > 1 ? (
            <div className="mt-4 grid grid-cols-4 gap-3">
              {gallery.map((src, index) => (
                <button
                  key={src}
                  aria-label={`Show photograph ${index + 1}`}
                  aria-pressed={active === index}
                  onClick={() => setActive(index)}
                  className={`overflow-hidden rounded-lg border-2 p-1 ${active === index ? 'border-walnut' : 'border-transparent'}`}
                >
                  <Photo
                    src={src}
                    alt={
                      product.images?.[index]?.alt ||
                      `${product.title}, view ${index + 1}`
                    }
                    className="aspect-[2/3]"
                    sizes="150px"
                  />
                </button>
              ))}
            </div>
          ) : null}
        </div>
        <div className="py-3 md:sticky md:top-28 md:py-8">
          <p className="eyebrow">
            {product.tags?.[0] || 'Crafting Corner collection'}
          </p>
          <h1 className="mt-4 font-display text-4xl font-normal leading-[1.08] text-[#38291f] sm:text-5xl">
            {product.title}
          </h1>
          <p className="mt-6 text-xl text-walnut">{productPrice(product)}</p>
          {product.priceStatus === 'estimate' ? (
            <div className="mt-2 text-sm leading-6 text-[#796650]">
              <p>Final price on enquiry</p>
              <p className="mt-1 text-xs">{product.priceUnit}</p>
            </div>
          ) : null}
          <p className="mt-7 text-sm leading-8 text-[#6b5b4c] sm:text-base">
            {product.description}
          </p>
          <div className="mt-7 border-y border-[#ded3c5] py-5 text-sm leading-7 text-[#6b5b4c]">
            <p>
              Confirm the finish, dimensions and availability with our team.
            </p>
            {product.priceStatus === 'estimate' ? (
              <p className="mt-2 text-xs">
                Indicative pricing only. Accessories, delivery and applicable
                taxes are confirmed in your quotation.
              </p>
            ) : null}
          </div>
          <a
            href={href}
            target={href.startsWith('https://') ? '_blank' : undefined}
            rel="noopener noreferrer"
            className="site-button mt-7 w-full sm:w-auto"
          >
            <MessageCircle size={18} />
            {product.priceStatus === 'estimate'
              ? 'Enquire for Final Price'
              : 'Enquire about this piece'}
            <ArrowUpRight size={16} />
          </a>
          {product.stockStatus === 'unconfirmed' ? (
            <p className="mt-4 text-xs text-[#796650]">
              Availability to be confirmed on enquiry.
            </p>
          ) : null}
        </div>
      </section>
      {related.length ? (
        <section className="section-space">
          <p className="eyebrow">More to discover</p>
          <h2 className="mb-8 mt-3 font-display text-4xl font-normal">
            A few other pieces you may love
          </h2>
          <div className="product-grid">
            {related.map((item) => (
              <ProductCard key={item.slug} {...item} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

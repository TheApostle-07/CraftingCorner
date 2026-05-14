/*  Animated product viewer
    – Hero + thumbnail gallery
    – Related-items shelf
--------------------------------------------------------------*/
'use client';

import { MotionConfig, motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import ProductCard from './ProductCard';

import type { SiteData } from '@/lib/types';
import type { Product } from '../lib/loaders.server';

type Props = {
  product: Product;
  related: Product[];
  site: SiteData;
};

export default function ProductView({ product, related, site }: Props) {
  // make gallery always an array
  const gallery = (Array.isArray(product.img) ? product.img : [product.img]).filter(
    Boolean,
  ) as string[];
  const mainImage = gallery[0] || '/assets/img/products/bestseller_1.png';
  const productUrl = `https://craftingcorner.in/products/${product.slug}`;
  const enquiryMessage = site.whatsapp.productMessageTemplate
    .replace('{{productName}}', product.title)
    .replace('{{price}}', `₹${product.price.toLocaleString('en-IN')}`)
    .replace('{{productUrl}}', productUrl);
  const whatsappHref = `https://wa.me/${site.whatsapp.number.replace(/\D/g, '')}?text=${encodeURIComponent(enquiryMessage)}`;

  return (
    <MotionConfig transition={{ duration: 0.5, ease: 'easeOut' }}>
      <motion.main
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="pb-32"
      >
        {/* ── Hero / main image ─────────────────────────────── */}
        <section className="relative mx-auto mb-12 grid max-w-6xl gap-6 px-4 lg:grid-cols-2">
          <motion.figure
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="overflow-hidden rounded-2xl bg-walnut/5"
          >
            <Image
              src={mainImage}
              alt={product.title}
              width={900}
              height={700}
              className="h-full w-full object-cover object-center"
              priority
            />
          </motion.figure>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col justify-center space-y-6"
          >
            <h1 className="font-display text-4xl font-semibold text-walnut">
              {product.title}
            </h1>

            <span className="inline-block w-max rounded-full bg-walnut/10 px-4 py-1.5 font-medium tracking-wide text-walnut">
              ₹{product.price.toLocaleString('en-IN')}
            </span>

            {product.description && (
              <p className="leading-relaxed text-charcoal/90">
                {product.description}
              </p>
            )}

            {product.tags?.length && (
              <ul className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded bg-charcoal/5 px-3 py-1 text-sm text-charcoal/80"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            )}

            {site.whatsapp.enabled ? (
              <Link
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-max items-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(37,211,102,0.22)] transition hover:bg-[#1DA851]"
              >
                <MessageCircle className="h-4 w-4" />
                Enquire on WhatsApp
              </Link>
            ) : null}
          </motion.div>
        </section>

        {/* ── Thumbnails ───────────────────────────────────── */}
        {gallery.length > 1 && (
          <section className="mx-auto mb-20 grid max-w-5xl grid-cols-2 gap-4 px-4 md:grid-cols-3">
            {gallery.slice(1).map((img, i) => (
              <motion.div
                key={img}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: (i + 1) * 0.05 }}
                className="overflow-hidden rounded-xl bg-walnut/5"
              >
                <Image
                  src={img}
                  alt={`${product.title} view ${i + 1}`}
                  width={600}
                  height={500}
                  className="h-full w-full object-cover object-center"
                />
              </motion.div>
            ))}
          </section>
        )}

        {/* ── Related products ─────────────────────────────── */}
        {related.length > 0 && (
          <section className="mx-auto max-w-6xl px-4">
            <h2 className="mb-6 font-display text-2xl font-semibold text-walnut">
              You may also like
            </h2>

            <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-8">
              {related.map((p) => (
                <ProductCard key={p.slug} {...p} />
              ))}
            </div>
          </section>
        )}
      </motion.main>
    </MotionConfig>
  );
}

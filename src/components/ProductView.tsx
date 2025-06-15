/*  Animated product viewer
    – Hero + thumbnail gallery
    – Related-items shelf
--------------------------------------------------------------*/
'use client';

import { MotionConfig, motion } from 'framer-motion';
import Image from 'next/image';
import ProductCard from './ProductCard';
import FloatingWhatsapp from './FloatingWhatsapp';

import type { Product } from '../lib/loaders.server';

type Props = {
  product: Product;
  related: Product[];
};

export default function ProductView({ product, related }: Props) {
  // make gallery always an array
  const gallery = Array.isArray(product.img) ? product.img : [product.img];

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
              src={gallery[0]}
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

        {/* ── WhatsApp CTA ─────────────────────────────────── */}
        <FloatingWhatsapp
          phone="+919999999999"
          message={`Hi! I'm interested in the ${product.title}. Could you tell me more?`}
        />
      </motion.main>
    </MotionConfig>
  );
}
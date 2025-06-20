/* -------------------------------------------------------------
   src/app/page.tsx
   Home page → hero ▸ animated category carousel ▸ four curated
   product sections for Indian shoppers
--------------------------------------------------------------*/
'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import { allCategories } from '../lib/categories'; // client-safe helper
import type { Category } from '../lib/types';

// ─────────────────────────────────────────────────────────────
// Config
// ─────────────────────────────────────────────────────────────
const CATS_PER_PAGE = 4; // show 4 categories at a time

export default function Home() {
  /* --------------------------------------------------------------------
        1.  DATA  — static shelves (JSON / hard-coded for now)
  -------------------------------------------------------------------- */
  const bestSellers = [
    {
      title: 'Sheesham King-Size Bed',
      price: 72_500,
      img: '/assets/img/products/bestseller_1.png',
      slug: 'sheesham-king-bed',
    },
    {
      title: 'Jaipur Hand-Carved Console',
      price: 29_900,
      img: '/assets/img/products/bestseller_2.png',
      slug: 'jaipur-console',
    },
    {
      title: 'Rattan Patio Lounger',
      price: 18_450,
      img: '/assets/img/products/bestseller_3.png',
      slug: 'rattan-lounger',
    },
    
  ];

  const featured = [
    {
      title: 'Oak Dining Table',
      price: 45_000,
      img: '/assets/img/products/featured_1.png',
      slug: 'oak-dining-table',
    },
    {
      title: 'Walnut Armchair',
      price: 28_000,
      img: '/assets/img/products/featured_2.png',
      slug: 'walnut-armchair',
    },
    {
        title: 'Live-Edge Acacia Coffee Table',
        price: 24_999,
        img: '/assets/img/products/featured_3.png',
        slug: 'acacia-coffee-table',
      },
  ];

  const topPicks = [
    {
      title: 'Teak Bookshelf Ladder',
      price: 14_750,
      img: '/assets/img/products/top_1.png',
      slug: 'teak-bookshelf-ladder',
    },
    {
      title: 'Udaipur Mirror with Jali Work',
      price: 9_950,
      img: '/assets/img/products/top_2.png',
      slug: 'udaipur-mirror',
    },
    {
      title: 'Cane-Weave Dining Chair',
      price: 7_299,
      img: '/assets/img/products/top_3.png',
      slug: 'cane-dining-chair',
    },
  ];

  const recommended = [
    {
      title: 'Modular Shoe Rack',
      price: 4_699,
      img: '/assets/img/products/rc_1.png',
      slug: 'modular-shoe-rack',
    },
    {
      title: 'Kids’ Study Desk',
      price: 6_399,
      img: '/assets/img/products/rc_2.png',
      slug: 'kids-study-desk',
    },
    {
      title: 'Fabric Storage Ottoman',
      price: 3_250,
      img: '/assets/img/products/rc_3.png',
      slug: 'fabric-storage-ottoman',
    },
  ];

  /* --------------------------------------------------------------------
        2.  CATEGORY CAROUSEL LOGIC
  -------------------------------------------------------------------- */
  const [page, setPage] = useState(0);

  // break categories into pages of 4
  const pages = useMemo(() => {
    const chunks: Category[][] = [];
    for (let i = 0; i < allCategories.length; i += CATS_PER_PAGE) {
      chunks.push(allCategories.slice(i, i + CATS_PER_PAGE));
    }
    return chunks;
  }, []);

  const next = () => setPage((p) => (p + 1) % pages.length);
  const prev = () => setPage((p) => (p - 1 + pages.length) % pages.length);

  /* --------------------------------------------------------------------
        3.  RENDER
  -------------------------------------------------------------------- */
  return (
    <>
      {/* ───────────────────────── Hero ───────────────────────── */}
      <Hero />

      {/* ───────────────────── Categories carousel ────────────── */}
      <section className="relative mx-auto mt-16 max-w-6xl px-8 lg:px-4">
        <h2 className="mb-8 font-display text-2xl font-semibold text-walnut lg:mb-6">
          Browse by Category
        </h2>

        <div className="relative overflow-visible">
          {/* Arrow buttons */}
          {pages.length > 1 && (
            <>
              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Previous"
                onClick={prev}
                className="absolute -left-12 top-1/2 -translate-y-1/2 hidden sm:flex h-10 w-10 items-center justify-center rounded-full bg-walnut/90 text-ivory shadow-lg ring-1 ring-black/10 transition hover:bg-walnut"
              >
                <ChevronLeft className="h-5 w-5" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Next"
                onClick={next}
                className="absolute -right-12 top-1/2 -translate-y-1/2 hidden sm:flex h-10 w-10 items-center justify-center rounded-full bg-walnut/90 text-ivory shadow-lg ring-1 ring-black/10 transition hover:bg-walnut"
              >
                <ChevronRight className="h-5 w-5" />
              </motion.button>
            </>
          )}

          {/* Track */}
          <div className="flex-1 overflow-hidden">
            <AnimatePresence initial={false} mode="wait">
              <motion.ul
                key={page}
                initial={{ x: 64, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -64, opacity: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="grid grid-cols-2 gap-6 sm:grid-cols-4"
              >
                {pages[page].map((cat) => (
                  <li key={cat.slug} className="list-none">
                    <a
                      href={`/${cat.slug}`}
                      className="group relative block overflow-hidden rounded-xl"
                    >
                      <img
                        src={cat.image}
                        alt={cat.title}
                        className="h-40 w-full object-cover transition duration-300 group-hover:scale-105"
                        loading="lazy"
                        width={400}
                        height={160}
                      />
                      <span className="absolute inset-0 bg-black/40 transition-opacity duration-300 group-hover:bg-black/50" />
                      <span className="absolute inset-0 flex items-center justify-center font-display text-lg font-semibold text-white drop-shadow-lg">
                        {cat.title}
                      </span>
                    </a>
                  </li>
                ))}
              </motion.ul>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ───────────────────── Product Shelves ────────────────── */}
      <Shelf title="Best Sellers" items={bestSellers} />
      <Shelf title="Featured Products" items={featured} />
      <Shelf title="Top Picks" items={topPicks} />
      <Shelf title="Recommended for You" items={recommended} />
    </>
  );
}

/* -------------------------------------------------------------
   Tiny helper component so each shelf uses identical markup
--------------------------------------------------------------*/
function Shelf({
  title,
  items,
}: {
  title: string;
  items: { title: string; price: number; img: string; slug: string }[];
}) {
  if (items.length === 0) return null;

  return (
    <section className="mx-auto my-20 max-w-6xl px-4">
      <h2 className="mb-6 font-display text-2xl font-semibold text-walnut">
        {title}
      </h2>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-10">
        {items.map((p) => (
          <ProductCard key={p.slug} {...p} />
        ))}
      </div>
    </section>
  );
}
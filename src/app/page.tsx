/* -------------------------------------------------------------
   src/app/page.tsx
   Home page → hero ▸ animated category carousel ▸ four curated
   product sections for Indian shoppers
--------------------------------------------------------------*/
'use client';

import { useState, useMemo } from 'react';
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { X } from 'lucide-react';
import { AiFillStar } from 'react-icons/ai';

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
      slug: 'modular-shoe-rack'
    },
    {
      title: 'Kids’ Study Desk',
      price: 6_399,
      img: '/assets/img/products/rc_2.png',
      slug: 'kids-study-desk'
    },
    {
      title: 'Fabric Storage Ottoman',
      price: 3_250,
      img: '/assets/img/products/rc_3.png',
      slug: 'fabric-storage-ottoman'
    }
  ];

  const testimonials = [
    {
      name: 'Ananya Sharma',
      role: 'Interior Designer',
      quote: 'Crafting Corner delivered beyond expectations! The quality and craftsmanship of the Sheesham bed is unparalleled.',
      avatar: '/assets/img/testimonials/ananya.jpg'
    },
    {
      name: 'Ravi Patel',
      role: 'Happy Customer',
      quote: 'The Walnut Armchair is a masterpiece. It transformed my living room into a cozy haven. Highly recommend!',
      avatar: '/assets/img/testimonials/ravi.jpg'
    },
    {
      name: 'Priya Singh',
      role: 'Architect',
      quote: 'Their attention to detail is remarkable. Every piece feels hand-crafted and timeless.',
      avatar: '/assets/img/testimonials/priya.jpg'
    }
  ];

    // ──────────────────────────── Visitor lead‑capture modal ────────────────────────────
    const [showModal, setShowModal] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    // simple regex helpers (10‑digit Indian mobile & basic e‑mail)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[6-9]\d{9}$/;
    const isValid = name.trim().length > 1 && emailRegex.test(email) && phoneRegex.test(phone);

    useEffect(() => {
      // show only once per **browser tab** (sessionStorage)
      if (typeof window === 'undefined') return;
      if (sessionStorage.getItem('leadModalShown') === 'true') return;

      const timer = setTimeout(() => setShowModal(true), 5000);
      return () => clearTimeout(timer);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!isValid) return;
      // TODO: send to backend / 3rd‑party (placeholder)
      console.table({ name, email, phone });
      hideModal();
      // reset
      setName('');
      setEmail('');
      setPhone('');
    };

    const hideModal = () => {
      setShowModal(false);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('leadModalShown', 'true');
      }
    };

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
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            className="relative w-[92%] max-w-md rounded-2xl bg-ivory/95 p-8 shadow-2xl ring-4 ring-white"
          >
            {/* close button */}
            <button
              onClick={hideModal}
              aria-label="Close"
              className="absolute right-4 top-4 text-white hover:text-white/80"
            >
              <X className="h-6 w-6" />
            </button>

            <h3 className="mb-2 text-center font-display text-xl font-semibold text-white">
              Stay in the Loop
            </h3>
            <p className="mb-6 text-center text-sm text-white/80">
              Get exclusive offers & design tips delivered to your inbox.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-md border border-charcoal/20 px-4 py-2 outline-none focus:ring-2 focus:ring-walnut"
                required
              />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-charcoal/20 px-4 py-2 outline-none focus:ring-2 focus:ring-walnut"
                required
              />
              <input
                type="tel"
                placeholder="Mobile Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-md border border-charcoal/20 px-4 py-2 outline-none focus:ring-2 focus:ring-walnut"
                required
              />

              <button
                type="submit"
                disabled={!isValid}
                className="w-full rounded-md bg-white py-2 font-medium text-walnut ring-1 ring-walnut transition disabled:cursor-not-allowed disabled:opacity-60"
              >
                Notify Me
              </button>
            </form>
          </motion.div>
        </div>
      )}
      {/* ───────────────────────── Hero ───────────────────────── */}
      <Hero />

      {/* ───────────────────── Categories carousel ────────────── */}
      <section id="categories" className="relative mx-auto mt-16 max-w-6xl px-8 lg:px-4">
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

      {/* ───────────────────── Testimonials ───────────────────── */}
      <section className="mx-auto my-20 max-w-6xl px-4">
        <h2 className="mb-8 font-display text-2xl font-semibold text-walnut text-center">
          What Our Clients Say
        </h2>
        <motion.div
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.2 } }
          }}
        >
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              className="flex flex-col items-center rounded-xl bg-ivory/80 p-6 text-center shadow-lg"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
            >
              <img
                src={t.avatar}
                alt={t.name}
                className="mx-auto mb-4 h-16 w-16 rounded-full object-cover"
              />
              <div className="mb-2 flex space-x-1">
                <AiFillStar className="h-5 w-5 text-yellow-400" />
                <AiFillStar className="h-5 w-5 text-yellow-400" />
                <AiFillStar className="h-5 w-5 text-yellow-400" />
                <AiFillStar className="h-5 w-5 text-yellow-400" />
                <AiFillStar className="h-5 w-5 text-yellow-400" />
              </div>
              <p className="mb-4 text-sm italic text-charcoal/90">"{t.quote}"</p>
              <span className="font-medium text-walnut">{t.name}</span>
              <span className="text-xs text-charcoal/70">{t.role}</span>
            </motion.div>
          ))}
        </motion.div>
      </section>
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

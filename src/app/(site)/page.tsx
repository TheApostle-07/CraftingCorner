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

import Hero from '@/components/Hero';
import ProductCard from '@/components/ProductCard';
import { allCategories } from '@/lib/categories'; // client-safe helper
import type { Category } from '@/lib/types';
import { sendLead } from '@/lib/sendLead';

type TestimonialAvatarVariant = 'aditi' | 'rohan' | 'maya' | 'daniel';


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

  /* ---------- Browse‑by‑Products tiles ---------- */
  const browseProducts = [
    { title: 'Dining Table Set', slug: 'dining-table-set', img: '/assets/img/products/browse_dining.png' },
    { title: 'Sofa Set', slug: 'sofa-set', img: '/assets/img/products/browse_sofa.png' },
    { title: 'Rugs', slug: 'rugs', img: '/assets/img/products/browse_rugs.png' },
    { title: 'Centre Tables', slug: 'centre-tables', img: '/assets/img/products/browse_centre.png' },
    { title: 'Console', slug: 'console', img: '/assets/img/products/browse_console.png' },
    { title: 'Chairs', slug: 'chairs', img: '/assets/img/products/browse_chairs.png' },
    { title: 'Beds', slug: 'beds', img: '/assets/img/products/browse_beds.png' },
    { title: 'Coffee / Side Table', slug: 'coffee-side-table', img: '/assets/img/products/browse_coffee.png' },
  ];

  const testimonials = [
    {
      name: 'Aditi Mehra',
      role: 'Mohali Homeowner',
      project: 'Bedroom Furnishing',
      location: 'Punjab, India',
      feedback:
        'Needed a warm wood bedroom setup that felt premium without crowding the room. The sizing, finish previews, and final installation all felt measured and properly thought through.',
      avatar: 'aditi' as TestimonialAvatarVariant,
    },
    {
      name: 'Rohan Suri',
      role: 'Bengaluru Apartment Owner',
      project: 'Dining Upgrade',
      location: 'Karnataka, India',
      feedback:
        'The main priority was getting a dining table that looked refined but could handle everyday family use. The joinery, finish consistency, and overall proportions felt dependable in person.',
      avatar: 'rohan' as TestimonialAvatarVariant,
    },
    {
      name: 'Maya Chen',
      role: 'Singapore Condo Client',
      project: 'Living Room Styling',
      location: 'Singapore',
      feedback:
        'What stood out was the clarity before production. Material references, finish direction, and the final visual weight of the pieces stayed aligned with the look we had discussed.',
      avatar: 'maya' as TestimonialAvatarVariant,
    },
    {
      name: 'Daniel Okafor',
      role: 'Dubai Villa Renovation',
      project: 'Custom Lounge Pieces',
      location: 'United Arab Emirates',
      feedback:
        'The requirement was simple: clean silhouettes, solid build quality, and furniture that would still feel comfortable for daily use. The final pieces landed with the right balance of detail and restraint.',
      avatar: 'daniel' as TestimonialAvatarVariant,
    },
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

     const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!isValid) return;

  // Send details to the Apps Script endpoint
  const ok = await sendLead(name.trim(), email.trim(), phone.trim());

  if (ok) {
    hideModal();        // close modal once saved
    setName('');        // clear inputs
    setEmail('');
    setPhone('');
  } else {
    alert('Sorry, something went wrong. Please try again.');
  }
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

      {/* ───────────────────── Browse‑by‑Products grid ─────────────── */}
       <section id="browse-products" className="mx-auto mt-20 max-w-6xl px-8 lg:px-4">
        <h2 className="mb-8 font-display text-2xl font-semibold text-walnut lg:mb-6">
          Browse by Products
        </h2>

        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {browseProducts.map((p) => (
            <a
              key={p.slug}
              href={`/products?type=${p.slug}`}
              className="group relative block overflow-hidden rounded-xl"
            >
              <img
                src={p.img}
                alt={p.title}
                className="h-40 w-full object-cover transition duration-300 group-hover:scale-105"
                loading="lazy"
                width={400}
                height={160}
              />
              <span className="absolute inset-0 bg-black/40 transition-opacity duration-300 group-hover:bg-black/50" />
              <span className="absolute inset-0 flex items-center justify-center px-2 text-center font-display text-lg font-semibold text-white">
                {p.title}
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* ───────────────────── Product Shelves ────────────────── */}
      <Shelf title="Best Sellers" items={bestSellers} />
      <Shelf title="Featured Products" items={featured} />
      <Shelf title="Top Picks" items={topPicks} />
      <Shelf title="Recommended for You" items={recommended} />

      {/* ───────────────────── Testimonials ───────────────────── */}
      <section className="mx-auto my-20 max-w-6xl px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-2xl font-semibold text-walnut">
            Client Perspectives
          </h2>
          <p className="mt-3 text-sm leading-7 text-charcoal/70 sm:text-base">
            A more grounded snapshot of the kind of feedback design-led buyers
            usually care about most: fit, finish, communication, and how the
            furniture finally sits in the room.
          </p>
        </div>
        <motion.div
          className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.2 } }
          }}
        >
          {testimonials.map((t) => (
            <motion.div
              key={t.name}
              className="flex h-full flex-col rounded-[1.75rem] border border-[#e4d8ca] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(247,241,232,0.82))] p-6 text-left shadow-[0_16px_40px_rgba(110,75,52,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_50px_rgba(110,75,52,0.12)]"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
            >
              <div className="flex items-start gap-4">
                <TestimonialAvatar variant={t.avatar} name={t.name} />
                <div className="min-w-0">
                  <p className="font-display text-xl font-semibold text-walnut">
                    {t.name}
                  </p>
                  <p className="mt-1 text-sm font-medium text-charcoal/75">
                    {t.role}
                  </p>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-full bg-[#efe2d4] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-walnut/80">
                  {t.project}
                </span>
                <span className="rounded-full border border-[#e0d0c0] bg-white/80 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-charcoal/60">
                  {t.location}
                </span>
              </div>
              <p className="mt-5 flex-1 text-sm leading-7 text-charcoal/80 sm:text-[0.97rem]">
                {t.feedback}
              </p>
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

function TestimonialAvatar({
  variant,
  name,
}: {
  variant: TestimonialAvatarVariant;
  name: string;
}) {
  const palette = {
    aditi: {
      bgFrom: '#e9eefc',
      bgTo: '#f5dcc7',
      skin: '#b97a57',
      hair: '#231815',
      shirt: '#c96c59',
      outline: '#d4b29b',
    },
    rohan: {
      bgFrom: '#e2edf3',
      bgTo: '#d6c1a8',
      skin: '#a96d49',
      hair: '#1d1614',
      shirt: '#44647a',
      outline: '#ccb398',
    },
    maya: {
      bgFrom: '#e6f0f6',
      bgTo: '#d9e0c2',
      skin: '#ebc1a2',
      hair: '#241c1c',
      shirt: '#6f819f',
      outline: '#c8d3dc',
    },
    daniel: {
      bgFrom: '#e7ecd8',
      bgTo: '#c9d8eb',
      skin: '#6d452f',
      hair: '#16110f',
      shirt: '#6d7f46',
      outline: '#bdc9a6',
    },
  }[variant];

  return (
    <div
      className="h-20 w-20 shrink-0 overflow-hidden rounded-[1.4rem] border bg-white/80 shadow-[0_12px_30px_rgba(110,75,52,0.12)]"
      style={{ borderColor: palette.outline }}
      aria-hidden="true"
      title={name}
    >
      <svg viewBox="0 0 96 96" className="h-full w-full">
        <defs>
          <linearGradient id={`${variant}-bg`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={palette.bgFrom} />
            <stop offset="100%" stopColor={palette.bgTo} />
          </linearGradient>
        </defs>

        <rect width="96" height="96" rx="24" fill={`url(#${variant}-bg)`} />
        <circle cx="74" cy="18" r="12" fill="rgba(255,255,255,0.34)" />
        <path
          d="M16 95c4-18 17-27 32-27s28 9 32 27"
          fill={palette.shirt}
        />
        <rect x="43" y="54" width="10" height="12" rx="4" fill={palette.skin} />
        <circle cx="48" cy="41" r="18" fill={palette.skin} />

        {variant === 'aditi' && (
          <>
            <path
              d="M29 38c0-13 8-22 19-22 11 0 19 9 19 22v6c0 2-2 4-4 4s-4-2-4-4v-4c0-6-5-11-11-11s-11 5-11 11v5c0 2-2 4-4 4s-4-2-4-4v-7Z"
              fill={palette.hair}
            />
            <path
              d="M31 43c1 16 5 25 17 25s16-9 17-25c1 7 1 16-1 23-3 11-10 17-16 17s-13-6-16-17c-2-7-2-16-1-23Z"
              fill={palette.hair}
              opacity="0.92"
            />
            <circle cx="48" cy="44" r="1.6" fill="#8a1f24" />
          </>
        )}

        {variant === 'rohan' && (
          <>
            <path
              d="M29 39c0-14 9-23 19-23s19 9 19 23v2c-4-4-9-6-19-6s-15 2-19 6v-2Z"
              fill={palette.hair}
            />
            <path
              d="M39 50c2 3 5 5 9 5s7-2 9-5c0 8-4 13-9 13s-9-5-9-13Z"
              fill={palette.hair}
              opacity="0.84"
            />
          </>
        )}

        {variant === 'maya' && (
          <>
            <path
              d="M27 40c0-15 9-24 21-24 10 0 18 8 18 19 0 5-2 9-4 12-3 4-4 6-4 11 0 3-2 5-5 5H43c-3 0-5-2-5-5 0-5-1-8-4-12-3-4-7-7-7-6Z"
              fill={palette.hair}
            />
            <path
              d="M31 36c2-9 8-14 17-14 8 0 14 4 17 12-3-2-7-4-17-4s-14 2-17 6Z"
              fill="#3a2c2b"
            />
          </>
        )}

        {variant === 'daniel' && (
          <>
            <path
              d="M28 38c0-13 9-21 20-21s20 8 20 21c-3-5-8-8-20-8s-17 3-20 8Z"
              fill={palette.hair}
            />
            <circle cx="38" cy="34" r="7" fill={palette.hair} />
            <circle cx="58" cy="34" r="7" fill={palette.hair} />
            <circle cx="48" cy="29" r="8" fill={palette.hair} />
          </>
        )}

        <circle cx="41" cy="42" r="1.8" fill="#1a1715" />
        <circle cx="55" cy="42" r="1.8" fill="#1a1715" />
        <path
          d="M42 50c2 2 4 3 6 3s4-1 6-3"
          fill="none"
          stroke="#7c4a38"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

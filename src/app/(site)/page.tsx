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

import homepageData from '@/data/homepage.json';
import productsData from '@/data/products.json';
import productTypesData from '@/data/productTypes.json';
import testimonialsData from '@/data/testimonials.json';
import Hero from '@/components/Hero';
import ProductCard from '@/components/ProductCard';
import { allCategories } from '@/lib/categories'; // client-safe helper
import type { Category, HomepageData, Product, ProductType, Testimonial } from '@/lib/types';
import { sendLead } from '@/lib/sendLead';

type TestimonialAvatarVariant = 'aditi' | 'rohan' | 'maya' | 'daniel';
type ShelfProduct = Pick<Product, 'slug' | 'title' | 'price' | 'img'>;

const homepage = homepageData as HomepageData;
const allCatalogProducts = (productsData as Product[])
  .filter((product) => product.visibility !== 'draft')
  .map((product) => ({
    ...product,
    title: product.title || product.name || '',
    img:
      product.img ||
      (product.images && product.images.length > 1
        ? product.images.map((image) => image.url)
        : product.images?.[0]?.url || ''),
    category: product.categorySlug || product.category,
  }));
const productBySlug = new Map(
  allCatalogProducts.map((product) => [product.slug, product]),
);
const productTypes = (productTypesData as ProductType[])
  .filter((type) => type.visibility !== 'draft')
  .sort((a, b) => a.sortOrder - b.sortOrder);
const testimonials = (testimonialsData as Testimonial[])
  .filter((testimonial) => testimonial.visibility !== 'draft')
  .sort((a, b) => a.sortOrder - b.sortOrder);

function pickShelfProducts(slugs: string[]): ShelfProduct[] {
  return slugs
    .map((slug) => productBySlug.get(slug))
    .filter((product): product is Product => Boolean(product))
    .map(({ slug, title, price, img }) => ({ slug, title, price, img }));
}

function orderBySlugs<T extends { slug: string }>(items: T[], slugs: string[]) {
  const bySlug = new Map(items.map((item) => [item.slug, item]));
  const ordered = slugs
    .map((slug) => bySlug.get(slug))
    .filter((item): item is T => Boolean(item));

  return [
    ...ordered,
    ...items.filter((item) => !slugs.includes(item.slug)),
  ];
}

function getAvatarVariant(index: number): TestimonialAvatarVariant {
  return (['aditi', 'rohan', 'maya', 'daniel'] as TestimonialAvatarVariant[])[
    index % 4
  ];
}


// ─────────────────────────────────────────────────────────────
// Config
// ─────────────────────────────────────────────────────────────
const CATS_PER_PAGE = 4; // show 4 categories at a time

export default function Home() {
  /* --------------------------------------------------------------------
        1.  DATA  — static shelves (JSON / hard-coded for now)
  -------------------------------------------------------------------- */
  const bestSellers = pickShelfProducts(
    homepage.sections.bestSellers.productSlugs,
  );
  const featured = pickShelfProducts(homepage.sections.featured.productSlugs);
  const topPicks = pickShelfProducts(homepage.sections.topPicks.productSlugs);
  const recommended = pickShelfProducts(
    homepage.sections.recommended.productSlugs,
  );

  const browseProducts = orderBySlugs(
    productTypes,
    homepage.sections.browseProducts.productTypeOrder,
  ).map((type) => ({
    title: type.name,
    slug: type.slug,
    img: type.image,
  }));

    // ──────────────────────────── Visitor lead‑capture modal ────────────────────────────
    const [showModal, setShowModal] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [submitState, setSubmitState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [submitFeedback, setSubmitFeedback] = useState('');

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
  if (!isValid || submitState === 'submitting') return;

  setSubmitState('submitting');
  setSubmitFeedback('');

  // Send details to the Apps Script endpoint
  const ok = await sendLead(name.trim(), email.trim(), phone.trim());

  if (ok) {
    setSubmitState('success');
    setSubmitFeedback('Thanks. Your details have been received and our team will contact you shortly.');
    setName('');
    setEmail('');
    setPhone('');
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('leadModalShown', 'true');
      window.setTimeout(() => hideModal(), 2200);
    }
  } else {
    setSubmitState('error');
    setSubmitFeedback('Something went wrong while sending your details. Please try again in a moment.');
  }
};

    const hideModal = () => {
      setShowModal(false);
      setSubmitState('idle');
      setSubmitFeedback('');
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('leadModalShown', 'true');
      }
    };

  /* --------------------------------------------------------------------
        2.  CATEGORY CAROUSEL LOGIC
  -------------------------------------------------------------------- */
  const [page, setPage] = useState(0);
  const homepageCategories = useMemo(
    () =>
      orderBySlugs(
        allCategories,
        homepage.sections.browseCategories.categoryOrder,
      ),
    [],
  );

  // break categories into pages of 4
  const pages = useMemo(() => {
    const chunks: Category[][] = [];
    for (let i = 0; i < homepageCategories.length; i += CATS_PER_PAGE) {
      chunks.push(homepageCategories.slice(i, i + CATS_PER_PAGE));
    }
    return chunks;
  }, [homepageCategories]);

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
            className="relative w-[92%] max-w-md rounded-[1.75rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(247,241,232,0.96))] p-6 shadow-2xl ring-1 ring-black/5 sm:p-8"
          >
            {/* close button */}
            <button
              onClick={hideModal}
              aria-label="Close"
              className="absolute right-4 top-4 rounded-full p-2 text-walnut/80 transition hover:bg-walnut/10 hover:text-walnut"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="mx-auto mb-4 inline-flex rounded-full border border-walnut/10 bg-walnut/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-walnut/75">
              Stay in the loop
            </div>
            <h3 className="mb-2 text-center font-display text-2xl font-semibold text-walnut">
              Get updates from Crafting Corner
            </h3>
            <p className="mb-6 text-center text-sm leading-6 text-charcoal/75 sm:text-[0.95rem]">
              Share your details for exclusive offers, launches, and handcrafted furniture updates.
            </p>

            {submitState === 'success' ? (
              <div
                role="status"
                aria-live="polite"
                className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-5 text-center"
              >
                <p className="text-lg font-semibold text-emerald-800">
                  Details received
                </p>
                <p className="mt-2 text-sm leading-6 text-emerald-700">
                  {submitFeedback}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-charcoal/15 bg-white px-4 py-3 text-charcoal outline-none transition focus:border-walnut/50 focus:ring-2 focus:ring-walnut/20"
                  required
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-charcoal/15 bg-white px-4 py-3 text-charcoal outline-none transition focus:border-walnut/50 focus:ring-2 focus:ring-walnut/20"
                  required
                />
                <input
                  type="tel"
                  placeholder="Mobile Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-charcoal/15 bg-white px-4 py-3 text-charcoal outline-none transition focus:border-walnut/50 focus:ring-2 focus:ring-walnut/20"
                  required
                />

                {submitFeedback ? (
                  <div
                    role={submitState === 'error' ? 'alert' : 'status'}
                    aria-live="polite"
                    className={`rounded-xl px-4 py-3 text-sm leading-6 ${
                      submitState === 'error'
                        ? 'border border-rose-200 bg-rose-50 text-rose-700'
                        : 'border border-emerald-200 bg-emerald-50 text-emerald-700'
                    }`}
                  >
                    {submitFeedback}
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={!isValid || submitState === 'submitting'}
                  className="w-full rounded-xl bg-walnut py-3 font-medium text-ivory transition hover:bg-[#5c3e2c] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitState === 'submitting' ? 'Sending...' : 'Notify Me'}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}
      {/* ───────────────────────── Hero ───────────────────────── */}
      <Hero data={homepage.hero} />

      {/* ───────────────────── Categories carousel ────────────── */}
      {homepage.sections.browseCategories.visible && pages.length > 0 ? (
      <section id="categories" className="relative mx-auto mt-16 max-w-6xl px-8 lg:px-4">
        <h2 className="mb-8 font-display text-2xl font-semibold text-walnut lg:mb-6">
          {homepage.sections.browseCategories.heading}
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
      ) : null}

      {/* ───────────────────── Browse‑by‑Products grid ─────────────── */}
      {homepage.sections.browseProducts.visible && browseProducts.length > 0 ? (
       <section id="browse-products" className="mx-auto mt-20 max-w-6xl px-8 lg:px-4">
        <h2 className="mb-8 font-display text-2xl font-semibold text-walnut lg:mb-6">
          {homepage.sections.browseProducts.heading}
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
      ) : null}

      {/* ───────────────────── Product Shelves ────────────────── */}
      {homepage.sections.bestSellers.visible ? (
        <Shelf title={homepage.sections.bestSellers.heading} items={bestSellers} />
      ) : null}
      {homepage.sections.featured.visible ? (
        <Shelf title={homepage.sections.featured.heading} items={featured} />
      ) : null}
      {homepage.sections.topPicks.visible ? (
        <Shelf title={homepage.sections.topPicks.heading} items={topPicks} />
      ) : null}
      {homepage.sections.recommended.visible ? (
        <Shelf
          title={homepage.sections.recommended.heading}
          items={recommended}
        />
      ) : null}

      {/* ───────────────────── Testimonials ───────────────────── */}
      {homepage.sections.testimonials.visible && testimonials.length > 0 ? (
      <section className="mx-auto my-20 max-w-6xl px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-2xl font-semibold text-walnut">
            {homepage.sections.testimonials.heading}
          </h2>
          <p className="mt-3 text-sm leading-7 text-charcoal/70 sm:text-base">
            {homepage.sections.testimonials.subheading}
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
          {testimonials.map((t, index) => (
            <motion.div
              key={t.name}
              className="flex h-full flex-col rounded-[1.75rem] border border-[#e4d8ca] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(247,241,232,0.82))] p-6 text-left shadow-[0_16px_40px_rgba(110,75,52,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_50px_rgba(110,75,52,0.12)]"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
            >
              <div className="flex items-start gap-4">
                <TestimonialAvatar variant={getAvatarVariant(index)} name={t.name} />
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
                  {t.projectType}
                </span>
                <span className="rounded-full border border-[#e0d0c0] bg-white/80 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-charcoal/60">
                  {t.location}
                </span>
              </div>
              <p className="mt-5 flex-1 text-sm leading-7 text-charcoal/80 sm:text-[0.97rem]">
                  {t.quote}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>
      ) : null}
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
  items: { title: string; price: number; img?: string | string[]; slug: string }[];
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

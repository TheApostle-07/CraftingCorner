/* --------------------------------------------------------------------------
   /src/app/about/page.tsx
   Fully‑responsive, animated “About Us” page for Crafting Corner
--------------------------------------------------------------------------- */
'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

/**
 * About page (client component so we can animate with Framer Motion)
 */
export default function About() {
  /* ──────────────────────────────────────────────────────────
       Render
  ────────────────────────────────────────────────────────── */
  return (
    <>
      {/* ——— Hero ——— */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative isolate flex min-h-[50vh] items-center justify-center overflow-hidden rounded-b-3xl bg-walnut/5"
      >
        {/* background image */}
        <Image
          src="/assets/img/about/aboutus_2.png"
          alt="Crafting Corner workshop"
          fill
          priority
          className="object-cover object-center"
        />
        {/* tint */}
        <div className="absolute inset-0 bg-black/60" />
        {/* copy */}
        <div className="relative z-10 mx-auto max-w-3xl px-6 py-24 text-center">
          <h1 className="font-display text-5xl font-semibold text-white drop-shadow-lg">
            Our Story
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-lg text-white/90">
            Hand‑crafted furniture born in small Indian workshops, made to last
            generations.
          </p>
        </div>
      </motion.section>

      {/* ——— Narrative ——— */}
      <section className="mx-auto my-20 max-w-4xl space-y-10 px-6 leading-relaxed text-charcoal/90">
        {[
          'At Crafting Corner we believe the warmth of real wood, the honesty of cane‑weave and the touch of hand‑polish can never be replicated by mass production. Since 2015 we’ve been partnering with artisan carpenters across Rajasthan, Kerala and Uttar Pradesh to create furniture that blends time‑honoured techniques with contemporary silhouettes.',
          'Every plank is sustainably sourced, kiln‑seasoned and joined with traditional mortise‑and‑tenon joints. Each finish is mixed in small batches using low‑VOC oils so that your home stays as healthy as it is beautiful.',
        ].map((paragraph, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: (i + 1) * 0.1 }}
            viewport={{ once: true }}
          >
            {paragraph}
          </motion.p>
        ))}
      </section>

      {/* ——— Values ——— */}
      <section className="mx-auto mb-24 max-w-6xl px-6">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center font-display text-3xl font-semibold text-walnut"
        >
          Our Values
        </motion.h2>

        <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: 'Sustainability',
              desc: 'We use FSC‑certified timber and water‑based finishes.',
            },
            {
              title: 'Fair Wages',
              desc: 'Our artisans earn 20‑30 % above industry standards.',
            },
            {
              title: 'Lifetime Service',
              desc: 'Repairs & re‑polishing free for the first 5 years.',
            },
          ].map((v, i) => (
            <motion.li
              key={v.title}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="rounded-2xl bg-ivory p-6 shadow-md transition hover:shadow-lg">
                <h3 className="font-medium text-walnut">{v.title}</h3>
                <p className="mt-2 text-sm text-charcoal/80">{v.desc}</p>
              </div>
            </motion.li>
          ))}
        </ul>
      </section>

      {/* ——— CTA ——— */}
      <section className="relative overflow-hidden bg-walnut py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="font-display text-3xl font-semibold text-ivory">
            Visit Our Experience Studio
          </h2>
          <p className="mx-auto mt-4 max-w-md text-ivory/90">
            Drop by for a cup of chai in Bengaluru and feel every texture for
            yourself.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-block rounded-full bg-ivory px-6 py-3 font-medium text-walnut transition hover:bg-ivory/90"
          >
            Book an Appointment
          </Link>
        </div>

        {/* subtle background watermark */}
        <Image
          src="/assets/img/hero/showroom.webp"
          alt=""
          fill
          className="pointer-events-none absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 object-cover opacity-10"
        />
      </section>
    </>
  );
}

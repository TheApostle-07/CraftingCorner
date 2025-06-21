/* -------------------------------------------------------------
   Ultra-polished hero section for Crafting Corner
   – fully responsive  (min-height 100 svh on mobile, 100 vh on ≥ sm)
   – parallax bg (disabled if user prefers-reduced-motion)
   – framer-motion entrances with graceful fallback
--------------------------------------------------------------*/

'use client';

import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
  /* 1 ▸ Parallax offset (15 % at 600 px scroll) – opt-out if user prefers no motion */
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const yBg = useTransform(scrollY, [0, 600], ['0%', '15%']);

  /* 2 ▸ Helper: only return motion props when animations are allowed */
  const m = (from: any, to: any, delay = 0) =>
    reduceMotion
      ? {}
      : {
          initial: from,
          animate: to,
          transition: { delay, duration: 0.9, ease: 'easeOut' },
        };

  /* 3 ▸ Layout */
  return (
    <section
      id="hero"
      className="relative isolate flex min-h-[100svh] flex-col justify-center overflow-hidden bg-black text-white sm:min-h-screen"
    >
      {/* ── Background ─────────────────────────────────────────────── */}
      <motion.div
        aria-hidden
        style={reduceMotion ? undefined : { y: yBg }}
        className="absolute inset-0 -z-10"
      >
        <Image
          src="/assets/img/CC_Hero.png"
          alt="Hand-crafted furniture showroom background"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80" />
      </motion.div>

      {/* ── Content ────────────────────────────────────────────────── */}
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-24 text-center lg:gap-8 lg:px-8">
        <motion.h1
          {...m({ opacity: 0, y: 50 }, { opacity: 1, y: 0 })}
          className="font-display text-4xl leading-tight sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl"
        >
          Timeless
          <br className="sm:hidden" />
          <span className="whitespace-nowrap"> Hand-Crafted </span>
          <br className="hidden sm:inline" />
          <span className="text-brass">Furniture</span>
        </motion.h1>

        <motion.p
          {...m({ opacity: 0, y: 40 }, { opacity: 1, y: 0 }, 0.2)}
          className="mx-auto max-w-xl text-base sm:text-lg md:text-xl"
        >
          Made to transcend trends – built to last generations.
        </motion.p>

        <motion.div
          {...m({ opacity: 0, y: 30 }, { opacity: 1, y: 0 }, 0.4)}
          className="mx-auto flex max-w-fit flex-col items-center gap-4 sm:flex-row sm:gap-6"
        >
          <Link
            href="/collections"
            className="inline-flex items-center gap-2 rounded-brand bg-clay px-8 py-3 text-sm font-semibold uppercase tracking-wider text-ivory shadow-lg ring-1 ring-white/10 transition hover:scale-[1.03] hover:bg-clay/90 active:scale-95"
          >
            Browse Collection
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 -mr-1"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7M12 19l7-7" />
            </svg>
          </Link>

          <Link
            href="/about"
            className="inline-flex items-center gap-2 rounded-brand bg-white/15 px-8 py-3 text-sm font-semibold uppercase tracking-wider text-ivory backdrop-blur-sm transition hover:bg-white/20 active:scale-95"
          >
            Our Story
          </Link>
        </motion.div>
      </div>

      {/* ── Scroll cue (hidden on very small / touch-heavy screens) ── */}
      <motion.div
        {...m({ opacity: 0 }, { opacity: 0.8 }, 0.8)}
        className="pointer-events-none absolute bottom-8 left-1/2 hidden -translate-x-1/2 sm:block"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="mx-auto h-6 w-6 animate-bounce"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path d="M12 5v14M19 12l-7 7-7-7" />
        </svg>
        <span className="mt-1 block text-xs uppercase tracking-widest text-white/80">
          Scroll
        </span>
      </motion.div>
    </section>
  );
}

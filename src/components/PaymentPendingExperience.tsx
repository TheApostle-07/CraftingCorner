'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowUpRight,
  BadgeIndianRupee,
  BriefcaseBusiness,
  FileClock,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

const highlights = [
  {
    icon: FileClock,
    title: 'Access paused',
    description:
      'The website has been temporarily paused until the current payment cycle is cleared.',
  },
  {
    icon: BadgeIndianRupee,
    title: 'Invoice pending',
    description:
      'Once the outstanding payment is settled, the full experience can be restored immediately.',
  },
  {
    icon: ShieldCheck,
    title: 'Deployment protected',
    description:
      'The project and deployment remain secure while the account is under payment review.',
  },
];

export default function PaymentPendingExperience() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#0b1220] px-6 py-12 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(211,163,115,0.28),_transparent_36%),radial-gradient(circle_at_bottom_left,_rgba(46,105,153,0.24),_transparent_30%),linear-gradient(135deg,_#0b1220_0%,_#121a2d_45%,_#090d18_100%)]" />
      <motion.div
        aria-hidden="true"
        className="absolute -left-20 top-20 h-64 w-64 rounded-full bg-[#d3a373]/20 blur-3xl"
        animate={{ y: [-18, 24, -18], x: [0, 22, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute bottom-10 right-0 h-80 w-80 rounded-full bg-[#4f8fbf]/20 blur-3xl"
        animate={{ y: [16, -20, 16], x: [0, -26, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative mx-auto flex min-h-[calc(100vh-6rem)] max-w-7xl flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]"
        >
          <div className="rounded-[2rem] border border-white/10 bg-white/8 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#d3a373]/30 bg-[#d3a373]/10 px-4 py-2 text-sm uppercase tracking-[0.28em] text-[#f2cfad]">
              <Sparkles className="h-4 w-4" />
              Payment Pending
            </div>

            <h1 className="mt-8 max-w-3xl text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
              This website is temporarily unavailable until the pending payment
              is resolved.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-200 sm:text-lg">
              Kindly contact ExpertDevStudio to reactivate the website. As soon
              as the outstanding payment is cleared, the full Crafting Corner
              experience can be restored without delay.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="https://www.expertdevstudio.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#d3a373] px-6 py-3 text-sm font-semibold text-[#101827] transition duration-300 hover:translate-y-[-2px] hover:bg-[#e3b989]"
              >
                Kindly Contact ExpertDevStudio
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <div className="inline-flex items-center justify-center gap-2 rounded-full border border-white/12 bg-black/20 px-6 py-3 text-sm text-slate-200">
                <BriefcaseBusiness className="h-4 w-4 text-[#d3a373]" />
                Professional billing hold in effect
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.12 }}
            className="space-y-5"
          >
            {highlights.map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: 0.2 + index * 0.12 }}
                  className="rounded-[1.75rem] border border-white/10 bg-white/7 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.25)] backdrop-blur-xl"
                >
                  <div className="flex items-start gap-4">
                    <div className="rounded-2xl bg-[#d3a373]/15 p-3 text-[#f2cfad]">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-white">
                        {item.title}
                      </h2>
                      <p className="mt-3 text-sm leading-7 text-slate-300">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

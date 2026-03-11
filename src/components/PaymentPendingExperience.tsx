'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowUpRight,
  BadgeIndianRupee,
  BriefcaseBusiness,
  FileClock,
  ShieldCheck,
  TriangleAlert,
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
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(211,163,115,0.22),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(46,105,153,0.18),_transparent_28%),linear-gradient(145deg,_#08111f_0%,_#10192d_46%,_#070d17_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:120px_120px] opacity-20" />
      <motion.div
        aria-hidden="true"
        className="absolute -left-20 top-20 h-64 w-64 rounded-full bg-[#d3a373]/18 blur-3xl"
        animate={{ y: [-18, 24, -18], x: [0, 22, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute bottom-10 right-0 h-80 w-80 rounded-full bg-[#4f8fbf]/20 blur-3xl"
        animate={{ y: [16, -20, 16], x: [0, -26, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative mx-auto flex min-h-[calc(100vh-6rem)] max-w-6xl flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="w-full text-center"
        >
          <div className="mx-auto max-w-3xl rounded-[2.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.12),rgba(255,255,255,0.06))] px-8 py-10 shadow-[0_32px_120px_rgba(0,0,0,0.42)] backdrop-blur-2xl sm:px-12 sm:py-14">
            <motion.div
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.65, ease: 'easeOut', delay: 0.08 }}
              className="mx-auto flex h-32 w-32 items-center justify-center rounded-full border border-[#d3a373]/35 bg-[radial-gradient(circle,_rgba(211,163,115,0.28),_rgba(211,163,115,0.08)_55%,_transparent_100%)] shadow-[0_0_80px_rgba(211,163,115,0.2)] sm:h-40 sm:w-40"
            >
              <div className="flex h-24 w-24 items-center justify-center rounded-full border border-[#f2cfad]/35 bg-[#0d1729]/90 text-[#f2cfad] sm:h-28 sm:w-28">
                <TriangleAlert className="h-12 w-12 sm:h-14 sm:w-14" />
              </div>
            </motion.div>

            <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-[#d3a373]/30 bg-[#d3a373]/10 px-4 py-2 text-[11px] uppercase tracking-[0.34em] text-[#f2cfad] sm:text-sm">
              <BriefcaseBusiness className="h-4 w-4" />
              Payment Pending
            </div>

            <h1 className="font-display mx-auto mt-8 max-w-3xl text-4xl font-semibold leading-[1.02] text-white sm:text-5xl lg:text-[3.65rem]">
              This website is temporarily unavailable until the pending payment
              is resolved.
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-200 sm:text-lg">
              Kindly contact ExpertDevStudio to reactivate the website. As soon
              as the outstanding payment is cleared, the full Crafting Corner
              experience can be restored without delay.
            </p>

            <div className="mx-auto mt-8 h-px w-24 bg-gradient-to-r from-transparent via-[#d3a373] to-transparent" />

            <div className="mt-10 flex flex-col items-center justify-center gap-4">
              <Link
                href="https://www.expertdevstudio.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#d3a373] px-7 py-3.5 text-sm font-semibold text-[#101827] shadow-[0_18px_40px_rgba(211,163,115,0.22)] transition duration-300 hover:translate-y-[-2px] hover:bg-[#e3b989] sm:text-base"
              >
                Kindly Contact ExpertDevStudio
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <div className="inline-flex items-center justify-center gap-2 rounded-full border border-white/12 bg-black/20 px-5 py-2.5 text-sm text-slate-200">
                <BriefcaseBusiness className="h-4 w-4 text-[#d3a373]" />
                Professional billing hold in effect
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.14 }}
            className="mx-auto mt-8 grid w-full max-w-5xl gap-4 md:grid-cols-3"
          >
            {highlights.map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: 0.22 + index * 0.1 }}
                  className="rounded-[1.5rem] border border-white/10 bg-white/[0.07] p-6 text-center shadow-[0_18px_50px_rgba(0,0,0,0.22)] backdrop-blur-xl"
                >
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#d3a373]/15 text-[#f2cfad]">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h2 className="mt-5 text-xl font-semibold text-white">
                    {item.title}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Montserrat, Poppins } from 'next/font/google';
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
    title: 'Service on hold',
    description:
      'Public access is paused while the current invoice remains unsettled.',
  },
  {
    icon: BadgeIndianRupee,
    title: 'Invoice awaiting clearance',
    description:
      'Once payment is confirmed, the full website experience can be restored immediately.',
  },
  {
    icon: ShieldCheck,
    title: 'Protected deployment',
    description:
      'The deployment and project assets remain secure during the temporary billing hold.',
  },
];

const headingFont = Montserrat({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
});

const bodyFont = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export default function PaymentPendingExperience() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      className={`${bodyFont.className} relative min-h-screen overflow-hidden bg-[#f8f3e7] px-4 py-8 text-[#1f3651] sm:px-6 sm:py-12`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(243,204,110,0.28),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(116,162,203,0.24),_transparent_30%),linear-gradient(180deg,_#fffdf8_0%,_#f5f0e3_46%,_#eef5fb_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(32,67,104,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(32,67,104,0.05)_1px,transparent_1px)] bg-[size:120px_120px] opacity-40" />
      <motion.div
        aria-hidden="true"
        className="absolute -left-16 top-16 h-64 w-64 rounded-full bg-[#f0ca6f]/35 blur-3xl"
        animate={shouldReduceMotion ? undefined : { y: [-18, 22, -18], x: [0, 20, 0] }}
        transition={
          shouldReduceMotion
            ? undefined
            : { duration: 12, repeat: Infinity, ease: 'easeInOut' }
        }
      />
      <motion.div
        aria-hidden="true"
        className="absolute bottom-8 right-0 h-80 w-80 rounded-full bg-[#8eb6da]/30 blur-3xl"
        animate={shouldReduceMotion ? undefined : { y: [16, -20, 16], x: [0, -24, 0] }}
        transition={
          shouldReduceMotion
            ? undefined
            : { duration: 14, repeat: Infinity, ease: 'easeInOut' }
        }
      />

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col items-center justify-center sm:min-h-[calc(100vh-6rem)]">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="w-full text-center"
        >
          <div className="mx-auto max-w-4xl rounded-[2rem] border border-white/75 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(251,246,235,0.92))] px-5 py-8 shadow-[0_24px_80px_rgba(84,122,161,0.18)] backdrop-blur-xl sm:rounded-[2.5rem] sm:px-10 sm:py-12 lg:px-12 lg:py-14">
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.65, ease: 'easeOut', delay: 0.08 }}
              className="mx-auto flex h-40 w-40 items-center justify-center rounded-full border border-[#ecc76b]/55 bg-[radial-gradient(circle,_rgba(250,222,141,0.92),_rgba(255,255,255,0.96)_58%,_rgba(132,173,210,0.2)_100%)] shadow-[0_22px_70px_rgba(116,162,203,0.25)] sm:h-52 sm:w-52"
            >
              <div className="flex h-28 w-28 items-center justify-center rounded-full border border-[#8fb6d8]/25 bg-white/95 text-[#d7a544] shadow-[0_14px_36px_rgba(116,162,203,0.22)] sm:h-36 sm:w-36">
                <TriangleAlert className="h-16 w-16 sm:h-20 sm:w-20" />
              </div>
            </motion.div>

            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#ecd07d] bg-[#fff7db] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.34em] text-[#ab7c17] sm:mt-8 sm:text-sm">
              <BriefcaseBusiness className="h-4 w-4" />
              Temporary Billing Hold
            </div>

            <h1
              className={`${headingFont.className} mx-auto mt-6 max-w-3xl text-3xl font-semibold leading-[1.02] text-[#17304d] sm:mt-8 sm:text-5xl lg:text-[3.65rem]`}
            >
              Service access is currently on hold pending invoice settlement.
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#4d647a] sm:mt-6 sm:text-lg sm:leading-8">
              This website is temporarily unavailable until the outstanding
              payment is cleared. Kindly contact ExpertDevStudio to restore
              access. Reactivation can begin immediately after payment
              confirmation.
            </p>

            <div className="mx-auto mt-8 h-px w-24 bg-gradient-to-r from-transparent via-[#d8a94a] to-transparent" />

            <div className="mx-auto mt-8 grid max-w-3xl gap-3 rounded-[1.5rem] border border-[#dce8f3] bg-[#f7fbff] p-3 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] sm:mt-10 sm:grid-cols-3 sm:gap-0 sm:rounded-[1.75rem] sm:p-2">
              <div className="rounded-[1.1rem] px-4 py-4 sm:rounded-[1.2rem] sm:px-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#7a99b5]">
                  Status
                </p>
                <p className="mt-2 text-sm font-semibold text-[#17304d] sm:text-base">
                  Website access paused
                </p>
              </div>
              <div className="rounded-[1.1rem] border border-[#e3edf6] bg-white px-4 py-4 sm:rounded-[1.2rem] sm:border-y-0 sm:px-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#7a99b5]">
                  Reason
                </p>
                <p className="mt-2 text-sm font-semibold text-[#17304d] sm:text-base">
                  Outstanding invoice pending
                </p>
              </div>
              <div className="rounded-[1.1rem] px-4 py-4 sm:rounded-[1.2rem] sm:px-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#7a99b5]">
                  Reactivation
                </p>
                <p className="mt-2 text-sm font-semibold text-[#17304d] sm:text-base">
                  Immediate after clearance
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:mt-10">
              <Link
                href="https://www.expertdevstudio.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full max-w-[22rem] items-center justify-center gap-2 rounded-full bg-[#2d6799] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(95,143,190,0.22)] transition duration-300 hover:translate-y-[-2px] hover:bg-[#255986] sm:w-auto sm:max-w-none sm:text-base"
              >
                Kindly Contact ExpertDevStudio
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <div className="inline-flex items-center justify-center gap-2 rounded-full border border-[#ecd07d] bg-[#fff8e0] px-5 py-2.5 text-center text-sm text-[#816420]">
                <BriefcaseBusiness className="h-4 w-4 text-[#c79631]" />
                Professional billing hold in effect
              </div>
            </div>
          </div>

          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.14 }}
            className="mx-auto mt-6 grid w-full max-w-5xl gap-4 sm:mt-8 md:grid-cols-3"
          >
            {highlights.map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.title}
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: 0.22 + index * 0.1 }}
                  className="h-full rounded-[1.5rem] border border-white/75 bg-white/80 p-5 text-center shadow-[0_18px_50px_rgba(84,122,161,0.12)] backdrop-blur-xl sm:p-6"
                >
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#edf5fc] text-[#2f699c]">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h2
                    className={`${headingFont.className} mt-5 text-xl font-semibold text-[#17304d]`}
                  >
                    {item.title}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-[#557089] sm:leading-7">
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

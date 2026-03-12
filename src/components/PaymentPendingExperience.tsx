'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Montserrat, Poppins } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, BriefcaseBusiness, TriangleAlert } from 'lucide-react';

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
      className={`${bodyFont.className} relative min-h-screen overflow-hidden bg-[#f6fbff] px-4 py-8 text-[#1f3651] sm:px-6 sm:py-12`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,194,26,0.28),_transparent_26%),radial-gradient(circle_at_bottom_right,_rgba(138,184,222,0.24),_transparent_28%),linear-gradient(180deg,_#fcfeff_0%,_#eef6fd_52%,_#f7fbff_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(40,88,132,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(40,88,132,0.04)_1px,transparent_1px)] bg-[size:120px_120px] opacity-40" />
      <motion.div
        aria-hidden="true"
        className="absolute -left-16 top-16 h-64 w-64 rounded-full bg-[#ffc21a]/28 blur-3xl"
        animate={shouldReduceMotion ? undefined : { y: [-18, 22, -18], x: [0, 20, 0] }}
        transition={
          shouldReduceMotion
            ? undefined
            : { duration: 12, repeat: Infinity, ease: 'easeInOut' }
        }
      />
      <motion.div
        aria-hidden="true"
        className="absolute bottom-8 right-0 h-80 w-80 rounded-full bg-[#8eb6da]/28 blur-3xl"
        animate={shouldReduceMotion ? undefined : { y: [16, -20, 16], x: [0, -24, 0] }}
        transition={
          shouldReduceMotion
            ? undefined
            : { duration: 14, repeat: Infinity, ease: 'easeInOut' }
        }
      />

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl items-center justify-center sm:min-h-[calc(100vh-6rem)]">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="w-full"
        >
          <div className="mx-auto max-w-3xl rounded-[2rem] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(247,252,255,0.92))] px-5 py-8 text-center shadow-[0_24px_80px_rgba(84,122,161,0.16)] backdrop-blur-xl sm:rounded-[2.5rem] sm:px-10 sm:py-12 lg:px-12 lg:py-14">
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.65, ease: 'easeOut', delay: 0.08 }}
              className="relative mx-auto flex h-40 w-40 items-center justify-center rounded-full border border-[#ffd24d]/65 bg-[radial-gradient(circle,_rgba(255,213,79,0.9),_rgba(255,255,255,0.98)_56%,_rgba(132,173,210,0.2)_100%)] shadow-[0_22px_70px_rgba(255,194,26,0.22)] sm:h-52 sm:w-52"
            >
              <motion.div
                aria-hidden="true"
                className="absolute inset-3 rounded-full border border-[#ffe17f]/75"
                animate={
                  shouldReduceMotion
                    ? undefined
                    : { scale: [0.96, 1.05, 0.96], opacity: [0.38, 0.74, 0.38] }
                }
                transition={
                  shouldReduceMotion
                    ? undefined
                    : { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }
                }
              />
              <motion.div
                aria-hidden="true"
                className="absolute inset-0 rounded-full border border-[#ffc21a]/35"
                animate={
                  shouldReduceMotion
                    ? undefined
                    : { scale: [0.92, 1.08, 0.92], opacity: [0.2, 0.5, 0.2] }
                }
                transition={
                  shouldReduceMotion
                    ? undefined
                    : { duration: 2.8, repeat: Infinity, ease: 'easeInOut' }
                }
              />
              <motion.div
                className="flex h-28 w-28 items-center justify-center rounded-full border border-[#ffe17f] bg-white/95 text-[#e2a300] shadow-[0_14px_36px_rgba(255,194,26,0.18)] sm:h-36 sm:w-36"
                animate={
                  shouldReduceMotion ? undefined : { scale: [1, 1.035, 1] }
                }
                transition={
                  shouldReduceMotion
                    ? undefined
                    : { duration: 1.8, repeat: Infinity, ease: 'easeInOut' }
                }
              >
                <TriangleAlert className="h-16 w-16 sm:h-20 sm:w-20" />
              </motion.div>
            </motion.div>

            <h1
              className={`${headingFont.className} mx-auto mt-6 max-w-3xl text-3xl font-semibold leading-[1.02] text-[#17304d] sm:mt-8 sm:text-5xl lg:text-[3.65rem]`}
            >
              Payment Pending
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#4d647a] sm:mt-6 sm:text-lg sm:leading-8">
              This website is temporarily unavailable until the outstanding
              payment is cleared. Kindly contact Expert Dev Studio to reactivate
              the website. Access can be restored as soon as the payment is
              confirmed.
            </p>

            <div className="mx-auto mt-8 h-px w-24 bg-gradient-to-r from-transparent via-[#ffc21a] to-transparent" />

            <div className="mt-8 sm:mt-10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[#7a99b5] sm:text-xs">
                Kindly Contact
              </p>
            </div>

            <div className="mt-4 flex flex-col items-center justify-center gap-4">
              <Link
                href="https://www.expertdevstudio.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Contact Expert Dev Studio"
                className="group flex w-full max-w-xl flex-col items-center gap-5 rounded-[1.6rem] border border-[#dce9f4] bg-white/90 px-5 py-6 text-center shadow-[0_20px_55px_rgba(84,122,161,0.12)] transition duration-300 hover:-translate-y-1 hover:border-[#bdd4e9] hover:shadow-[0_26px_65px_rgba(84,122,161,0.16)] sm:px-6"
              >
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#e5eef6] bg-[#f4f9fd] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
                    <Image
                      src="/expert-dev-studio-favicon.ico"
                      alt="Expert Dev Studio logo"
                      width={42}
                      height={42}
                      className="h-10 w-10 rounded-xl object-contain"
                      unoptimized
                    />
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <p
                      className={`${headingFont.className} text-xl font-semibold text-[#17304d]`}
                    >
                      Expert Dev Studio
                    </p>
                    <p className="mt-1 max-w-[18rem] text-sm text-[#5b7691] sm:max-w-none">
                      Billing support and website reactivation
                    </p>
                  </div>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-[#2d6799] px-5 py-2.5 text-sm font-semibold text-white transition group-hover:bg-[#255986]">
                  Contact Now
                  <ArrowUpRight className="h-4 w-4" />
                </div>
              </Link>

              <div className="inline-flex items-center justify-center gap-2 rounded-full border border-[#ffd24d] bg-[#fff7da] px-5 py-2.5 text-center text-sm text-[#7b5f00]">
                <BriefcaseBusiness className="h-4 w-4 text-[#d39a00]" />
                Professional billing hold in effect
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

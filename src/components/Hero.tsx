/* -------------------------------------------------------------
   Ultra-polished hero section for Crafting Corner
   – Responsive
   – Framer-motion entrance + parallax flair
   – Tailwind utility styling
   ------------------------------------------------------------ */

   'use client';

   import { motion, useScroll, useTransform } from 'framer-motion';
   import Image from 'next/image';
   import Link from 'next/link';

   import { Great_Vibes } from 'next/font/google';

   // Elegant script for headline
   const greatVibes = Great_Vibes({
     subsets: ['latin'],
     weight: '400',
     display: 'swap',
   });
   
   export default function Hero() {
     /* Parallax bg offset */
     const { scrollY } = useScroll();
     const yBg = useTransform(scrollY, [0, 600], ['0%', '15%']);
   
     return (
       <section className="relative isolate min-h-[100svh] lg:h-[100svh] overflow-hidden py-24 sm:py-32">
         {/* Background */}
         <motion.div style={{ y: yBg }} className="absolute inset-0 -z-10">
           <Image
             src="/assets/img/CC_Hero_1.png"
             alt=""
             fill
             priority
             sizes="100vw"
             className="object-cover object-center"
           />
           <div className="absolute inset-0 bg-black/60" />
         </motion.div>
   
         {/* Content */}
         <div className="mx-auto flex h-full max-w-7xl flex-col items-center justify-center gap-4 sm:gap-6 px-4 sm:px-6 text-center text-white">
          {/* Logo */}
         <motion.div
           initial={{ opacity: 0, scale: 0.7 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ delay: 0.05, duration: 0.9 }}
           className="relative mb-4 h-48 w-48 sm:h-64 sm:w-64"
         >
            <Image
              src="/assets/img/Furniture.png"
              alt="Crafting Corner logo"
              width={512}
              height={512}
              priority
              className="object-contain object-center w-full h-full"
            />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className={`${greatVibes.className} mb-1 sm:mb-3 lg:mb-4 italic text-4xl leading-snug sm:text-6xl md:text-7xl lg:text-8xl drop-shadow-md`}
          >
            {/* Responsive headline – each word stacks on xs and flows inline ≥sm */}
            <span className="block sm:inline">Timeless&nbsp;</span>
            <span className="block sm:inline whitespace-nowrap">Hand‑Crafted&nbsp;</span>
            <span className="block sm:inline text-brass">Furniture</span>
           </motion.h1>
   
           <motion.p
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.3, duration: 0.8 }}
             className="mb-16 sm:mb-20 max-w-xl text-base sm:text-lg md:text-xl"
           >
             Made to transcend trends, built to last generations.
           </motion.p>
         </div>
   
         {/* Scroll cue */}
         
         <motion.button
           type="button"
           onClick={() =>
             document
               .getElementById('categories')
               ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
           }
           initial={{ opacity: 0 }}
           animate={{ opacity: 0.8 }}
           transition={{ delay: 1.2, duration: 1 }}
           className="hidden sm:block absolute bottom-10 left-1/2 -translate-x-1/2 cursor-pointer text-white/80 hover:text-white focus:outline-none"
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
           <span className="mt-1 block text-xs uppercase tracking-widest">
             Scroll
           </span>
         </motion.button>
       </section>
     );
   }

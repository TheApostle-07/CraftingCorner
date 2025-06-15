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
   
   export default function Hero() {
     /* Parallax bg offset */
     const { scrollY } = useScroll();
     const yBg = useTransform(scrollY, [0, 600], ['0%', '15%']);
   
     return (
       <section className="relative isolate min-h-[100svh] lg:h-[100svh] overflow-hidden py-24 sm:py-32">
         {/* Background */}
         <motion.div style={{ y: yBg }} className="absolute inset-0 -z-10">
           <Image
             src="/assets/img/CC_Hero.png"
             alt=""
             fill
             priority
             sizes="100vw"
             className="object-cover object-center"
           />
           <div className="absolute inset-0 bg-black/60" />
         </motion.div>
   
         {/* Content */}
         <div className="mx-auto flex h-full max-w-7xl flex-col items-center justify-center px-4 sm:px-6 text-center text-white">
           <motion.h1
             initial={{ opacity: 0, y: 40 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 1 }}
             className="mb-4 sm:mb-6 lg:mb-8 font-display text-3xl leading-tight sm:text-5xl md:text-6xl lg:text-7xl"
           >
             Timeless&nbsp;<span className="whitespace-nowrap">Hand-Crafted</span>
             <br className="hidden sm:inline" />
             <span className="text-brass">Furniture</span>
           </motion.h1>
   
           <motion.p
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.3, duration: 0.8 }}
             className="mt-2 sm:mt-4 mb-6 sm:mb-8 max-w-xl text-base sm:text-lg md:text-xl"
           >
             Made to transcend trends, built to last generations.
           </motion.p>
   
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.6, duration: 0.6 }}
           >
             <Link
               href="/collections"
               className="inline-flex items-center gap-2 rounded-brand bg-clay px-8 py-3 font-medium tracking-wide text-ivory shadow-lg transition hover:scale-[1.03] hover:bg-clay/90 active:scale-95"
             >
               Browse Collection
               <svg
                 xmlns="http://www.w3.org/2000/svg"
                 className="h-5 w-5"
                 fill="none"
                 stroke="currentColor"
                 strokeWidth={2}
                 strokeLinecap="round"
                 strokeLinejoin="round"
               >
                 <path d="M5 12h14M12 5l7 7M12 19l7-7" />
               </svg>
             </Link>
           </motion.div>
         </div>
   
         {/* Scroll cue */}
         <motion.span
           initial={{ opacity: 0 }}
           animate={{ opacity: 0.8 }}
           transition={{ delay: 1.2, duration: 1 }}
           className="hidden sm:block absolute bottom-12 left-1/2 -translate-x-1/2 text-white/80"
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
         </motion.span>
       </section>
     );
   }
/* -------------------------------------------------------------
   src/components/Footer.tsx
   Premium footer for Crafting Corner
   – Responsive 3-column grid
   – Framer Motion fade-up when it enters viewport
   – Tailwind utilities only
   ------------------------------------------------------------ */

   'use client';

   import { motion } from 'framer-motion';
   import Link from 'next/link';
   import { Instagram, Facebook, Linkedin } from 'lucide-react';
   
   const nav = [
     { href: '/', label: 'Home' },
     { href: '/collections', label: 'Collections' },
     { href: '/about', label: 'About Us' },
     { href: '/contact', label: 'Contact' },
   ];
   
   export default function Footer() {
     const year = new Date().getFullYear();
   
     return (
       <motion.footer
         initial={{ opacity: 0, y: 40 }}
         whileInView={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.8, ease: 'easeOut' }}
         viewport={{ once: true, amount: 0.25 }}
         className="mt-24 border-t border-walnut/30 bg-ivory/80 backdrop-blur-md"
       >
         {/* --- top grid --------------------------------------------------- */}
         <div className="mx-auto grid max-w-7xl gap-y-12 gap-x-8 px-4 py-16 sm:grid-cols-2 lg:grid-cols-3">
           {/* 1 / Brand column */}
           <div className="text-center sm:text-left">
             <h2 className="font-display text-2xl text-walnut">Crafting&nbsp;Corner</h2>
             <p className="mt-4 max-w-xs text-sm text-charcoal/80">
               Hand-crafted furniture made to last generations.
             </p>
             <p className="mt-2 max-w-xs text-sm text-charcoal/80">
               Crafting Corner curates artisanal furniture pieces, blending traditional craftsmanship with modern design to bring you timeless and enduring home decor.
             </p>
           </div>
   
           {/* 2 / Navigation column */}
           <div className="flex flex-col items-center gap-2 sm:items-start sm:gap-3">
             {nav.map((n) => (
               <Link
                 key={n.href}
                 href={n.href}
                 className="text-sm text-charcoal/80 transition hover:text-walnut"
               >
                 {n.label}
               </Link>
             ))}
           </div>
   
           {/* 3 / Newsletter + socials column */}
           <div className="flex flex-col items-center sm:items-end">
             <form
               onSubmit={(e) => e.preventDefault()}
               className="flex w-full max-w-md overflow-hidden rounded-brand border border-walnut/30 sm:max-w-xs"
             >
               <input
                 type="email"
                 required
                 placeholder="Your email"
                 className="flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-charcoal/60"
               />
               <button
                 type="submit"
                 className="bg-clay px-4 py-2 text-sm text-ivory transition hover:bg-clay/90"
               >
                 Join
               </button>
             </form>
   
             {/* socials */}
             <div className="mt-6 flex justify-center gap-4 sm:justify-start">
               <Link
                 href="https://instagram.com"
                 aria-label="Instagram"
                 className="rounded-full p-2 transition hover:bg-walnut/10"
               >
                 <Instagram className="h-5 w-5" />
               </Link>
               <Link
                 href="https://facebook.com"
                 aria-label="Facebook"
                 className="rounded-full p-2 transition hover:bg-walnut/10"
               >
                 <Facebook className="h-5 w-5" />
               </Link>
               <Link
                 href="https://linkedin.com"
                 aria-label="LinkedIn"
                 className="rounded-full p-2 transition hover:bg-walnut/10"
               >
                 <Linkedin className="h-5 w-5" />
               </Link>
             </div>
           </div>
         </div>
   
         {/* bottom bar */}
         <div className="border-t border-walnut/20 py-6 px-4 text-center text-sm text-charcoal/70">
           © {year} Crafting Corner · All rights reserved.
         </div>
       </motion.footer>
     );
   }

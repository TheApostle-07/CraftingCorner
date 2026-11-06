import { ArrowDown, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import type { HomepageData } from '@/lib/types';
import Photo from './Photo';
export default function Hero({ data }: { data?: HomepageData['hero'] }) {
  return (
    <section className="site-container grid items-center gap-8 pb-12 pt-9 md:grid-cols-2 md:gap-10 md:pb-20 md:pt-12 lg:gap-16">
      <div className="text-center md:py-8 md:text-start">
        <p className="eyebrow">Crafting Corner · Mohali</p>
        <h1 className="mx-auto mt-4 max-w-xl whitespace-pre-line text-balance font-display text-[clamp(2.5rem,6.2vw,3.25rem)] font-normal leading-[1.04] tracking-[-0.025em] text-[#38291f] md:mx-0 md:mt-6 lg:text-[clamp(3.25rem,4.75vw,4.25rem)]">
          {data?.title || 'Furniture with character.'}
        </h1>
        <p className="mx-auto mt-5 max-w-md text-pretty text-[15px] leading-7 text-[#746354] sm:text-base sm:leading-8 md:mx-0">
          {data?.subtitle}
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 md:justify-start">
          <Link href="/products" className="site-button">
            Explore the collection <ArrowUpRight size={18} />
          </Link>
          <Link
            href="/about"
            className="inline-flex min-h-12 items-center border-b border-[#baa58d] text-sm text-walnut"
          >
            Our story
          </Link>
        </div>
        <a
          href="#categories"
          className="mt-5 inline-flex min-h-11 items-center gap-2 text-xs tracking-wide text-[#756555] hover:text-walnut md:mt-10"
        >
          <ArrowDown size={16} /> A home, one considered piece at a time
        </a>
      </div>
      <figure className="relative mx-auto w-full max-w-[500px] md:mx-0 md:justify-self-end">
        <Photo
          src={data?.backgroundImage || '/images/real/large/DSC00397.webp'}
          alt="Cream upholstered seating and ornate gold-tone furniture in the Crafting Corner showroom"
          className="aspect-[4/5] w-full rounded-b-2xl rounded-t-[clamp(4rem,12vw,8rem)]"
          fit="cover"
          position="50% 35%"
          priority
          sizes="(max-width: 767px) 100vw, 50vw"
        />
        <figcaption className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-center text-[11px] tracking-wide text-[#756555] sm:justify-between">
          <span>The heritage collection</span>
          <span>Photographed in our showroom</span>
        </figcaption>
      </figure>
    </section>
  );
}

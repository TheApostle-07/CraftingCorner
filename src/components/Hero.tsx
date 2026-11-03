import { ArrowDown, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import type { HomepageData } from '@/lib/types';
import Photo from './Photo';
export default function Hero({ data }: { data?: HomepageData['hero'] }) {
  return (
    <section className="site-container grid items-center gap-8 pb-12 pt-6 md:grid-cols-2 md:gap-14 md:pb-20 md:pt-10">
      <div className="py-5 md:py-10">
        <p className="eyebrow">Crafting Corner · Mohali</p>
        <h1 className="mt-6 max-w-xl whitespace-pre-line font-display text-[clamp(2.8rem,5.5vw,5.5rem)] font-normal leading-[1.02] tracking-[-0.025em] text-[#38291f]">
          {data?.title || 'Furniture with character.'}
        </h1>
        <p className="mt-6 max-w-md text-[15px] leading-7 text-[#746354] sm:text-base sm:leading-8">
          {data?.subtitle}
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
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
          className="mt-10 inline-flex items-center gap-3 text-xs tracking-wide text-[#756555] md:mt-16"
        >
          <ArrowDown size={16} /> A home, one considered piece at a time
        </a>
      </div>
      <figure className="relative mx-auto w-full max-w-[480px]">
        <Photo
          src={data?.backgroundImage || '/images/real/large/DSC00397.webp'}
          alt="Cream upholstered seating and ornate gold-tone furniture in the Crafting Corner showroom"
          className="aspect-[2/3] w-full rounded-t-[8rem] rounded-b-2xl"
          priority
          sizes="(max-width: 767px) 100vw, 50vw"
        />
        <figcaption className="mt-4 flex items-center justify-between gap-4 text-[11px] tracking-wide text-[#756555]">
          <span>The heritage collection</span>
          <span>Photographed in our showroom</span>
        </figcaption>
      </figure>
    </section>
  );
}

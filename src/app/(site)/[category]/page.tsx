import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import Photo from '@/components/Photo';
import ProductCard from '@/components/ProductCard';
import { getCategory, loadProducts } from '@/lib/loaders.server';
import { readPublicContent } from '@/lib/adminContent.server';
import { pageMetadata } from '@/lib/seo';
export const dynamic = 'force-dynamic';
type Props = { params: Promise<{ category: string }> };
const roomDescriptions: Record<string, string> = {
  'living-room': 'Explore accent chairs, side tables, consoles and living room inspiration photographed in the Crafting Corner showroom in Mohali.',
  bedroom: 'Explore bedside storage, a carved vanity and bedroom inspiration from the Crafting Corner showroom in Mohali.',
  office: 'Explore the Crafting Corner study and office collection in Mohali, including a classic writing desk photographed in our showroom.',
  custom: 'Discuss bespoke furniture with Crafting Corner in Mohali. Bring your room measurements, ideas and finish preferences to start a conversation.',
};
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const cat = await getCategory(category);
  return cat
    ? pageMetadata(
        `${cat.title}${category === 'custom' ? '' : ' Furniture'} in Mohali | Crafting Corner`,
        roomDescriptions[category] || cat.seo?.description?.trim() || cat.subtitle || cat.title,
        `/${cat.slug}`,
        cat.image,
        cat.slug !== 'custom' && (await loadProducts(cat.slug)).length === 0,
      )
    : {};
}
export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const cat = await getCategory(category);
  if (!cat) {
    const content = await readPublicContent();
    if (content.categories.some((c) => c.slug === category))
      redirect('/products');
    notFound();
  }
  const products = await loadProducts(cat.slug);
  return (
    <div className="site-container pb-20 pt-10">
      <section className="mb-14 grid items-center gap-8 rounded-2xl bg-[#eee7dc]/70 p-6 sm:p-10 md:grid-cols-[1fr_280px]">
        <div className="site-enter min-w-0 text-center md:text-start">
          <p className="eyebrow">Rooms & inspiration</p>
          <h1 className="mt-4 break-words text-balance font-display text-[clamp(2.5rem,6vw,3.75rem)] font-normal leading-[1.08]">
            {cat.title}
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-pretty text-sm leading-7 text-[#746354] md:mx-0">
            {roomDescriptions[cat.slug] || cat.subtitle}
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-flex min-h-11 items-center border-b border-[#bda78f] text-sm text-walnut"
          >
            Speak with our team
          </Link>
        </div>
        <Photo
          src={cat.image}
          alt={cat.alt || cat.title}
          className="site-enter-photo mx-auto aspect-[2/3] w-full max-w-[280px] rounded-b-xl rounded-t-[5rem]"
          priority
          sizes="280px"
        />
      </section>
      {products.length ? (
        <div className="product-grid">
          {products.map((p) => (
            <ProductCard key={p.id || p.slug} {...p} />
          ))}
        </div>
      ) : (
        <section className="mx-auto max-w-2xl py-8 text-center">
          <h2 className="font-display text-3xl">
            Made personal, from the first conversation.
          </h2>
          <p className="mt-4 text-sm leading-7 text-[#746354]">
            Share the room, proportions and style you have in mind. Our team
            will help you explore the possibilities and prepare a quotation.
          </p>
          <Link href="/contact" className="site-button mt-6">
            Discuss your space
          </Link>
        </section>
      )}
    </div>
  );
}

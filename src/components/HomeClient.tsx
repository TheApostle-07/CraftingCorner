import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import Hero from './Hero';
import LeadCapture from './LeadCapture';
import Photo from './Photo';
import ProductCard from './ProductCard';
import type {
  Category,
  HomepageData,
  Product,
  ProductType,
  Testimonial,
} from '@/lib/types';
type Props = {
  homepage: HomepageData;
  products: Product[];
  productTypes: ProductType[];
  testimonials: Testimonial[];
  categories: Category[];
};
function order<T extends { slug: string }>(items: T[], slugs: string[]) {
  return [...items].sort((a, b) => {
    const ai = slugs.indexOf(a.slug),
      bi = slugs.indexOf(b.slug);
    return (ai < 0 ? Infinity : ai) - (bi < 0 ? Infinity : bi);
  });
}
export default function HomeClient({
  homepage,
  products,
  productTypes,
  testimonials,
  categories,
}: Props) {
  const productBySlug = new Map(
    products.map((product) => [product.slug, product]),
  );
  const shelves = [
    homepage.sections.bestSellers,
    homepage.sections.featured,
    homepage.sections.topPicks,
    homepage.sections.recommended,
  ];
  return (
    <>
      <Hero data={homepage.hero} />
      <div className="border-y border-[#ded3c5] bg-[#eee7dc]/40">
        <div className="site-container grid grid-cols-1 gap-3 py-5 text-center text-xs tracking-wide text-[#6c5a49] sm:grid-cols-3">
          <span>Furniture for spaces that feel like you</span>
          <span>Explore real showroom photographs</span>
          <span>Personal guidance, from first enquiry</span>
        </div>
      </div>
      {homepage.sections.browseCategories.visible && categories.length ? (
        <section
          id="categories"
          className="site-container section-space"
        >
          <SectionHeading
            label="Rooms & inspiration"
            title={homepage.sections.browseCategories.heading}
            text="Different rooms. The same attention to character."
          />
          <div className="grid grid-cols-2 gap-x-4 gap-y-7 lg:grid-cols-4 lg:gap-6">
            {order(
              categories,
              homepage.sections.browseCategories.categoryOrder,
            ).map((category) => (
              <Link
                key={category.slug}
                href={`/${category.slug}`}
                className="group min-w-0"
              >
                <Photo
                  src={category.image}
                  alt={category.alt || category.title}
                  className="aspect-[2/3] w-full rounded-xl transition-transform duration-300 motion-safe:group-hover:-translate-y-1"
                  sizes="(max-width: 1023px) 50vw, 25vw"
                />
                <span className="mt-4 flex items-center justify-between gap-2 font-display text-xl text-[#423022] sm:text-2xl">
                  {category.title}
                  <ArrowUpRight size={16} className="shrink-0" />
                </span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
      {shelves.slice(0, 2).map((section) => (
        <Shelf
          key={section.heading}
          section={section}
          products={productBySlug}
        />
      ))}
      <section className="bg-[#eee7dc]/55 py-16 sm:py-24">
        <div className="site-container grid items-center gap-10 md:grid-cols-2 md:gap-20">
          <div className="grid grid-cols-2 items-center gap-4">
            <Photo
              src="/images/real/large/DSC00415.webp"
              alt="Close view of ornate carved furniture detailing"
              className="aspect-[2/3] rounded-t-[5rem] rounded-b-xl"
            />
            <Photo
              src="/images/real/large/DSC00431.webp"
              alt="Decorative gold-tone furniture leg and upholstery detail"
              className="aspect-[2/3] rounded-b-xl rounded-t-[5rem]"
            />
          </div>
          <div className="text-center md:text-start">
            <p className="eyebrow">Look a little closer</p>
            <h2 className="mt-4 text-balance font-display text-4xl font-normal leading-tight sm:text-5xl">
              The details make the difference.
            </h2>
            <p className="mx-auto mt-5 max-w-md text-pretty text-sm leading-7 text-[#746354] md:mx-0">
              A curve that catches the light. A carved edge. A finish that
              brings a room together. Our collection invites you to take a
              closer look and find the details you connect with.
            </p>
            <Link href="/about" className="site-button mt-7">
              Discover Crafting Corner <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>
      </section>
      {homepage.sections.browseProducts.visible && productTypes.length ? (
        <section className="site-container section-space">
          <SectionHeading
            label="Shop by shape & purpose"
            title={homepage.sections.browseProducts.heading}
          />
          <div className="flex flex-wrap justify-center gap-5">
            {order(
              productTypes,
              homepage.sections.browseProducts.productTypeOrder,
            ).map((type) => (
              <Link
                key={type.slug}
                href={`/products?type=${type.slug}`}
                className="group min-w-0 basis-[calc((100%-1.25rem)/2)] text-center sm:basis-[calc((100%-2.5rem)/3)] lg:basis-[calc((100%-5rem)/5)]"
              >
                <Photo
                  src={type.image}
                  alt={type.name}
                  className="aspect-[2/3] rounded-xl"
                  sizes="(max-width: 639px) 50vw, (max-width: 1023px) 33vw, 20vw"
                />
                <span className="mt-3 block text-sm leading-6 text-walnut group-hover:underline">
                  {type.name}
                </span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
      {shelves.slice(2).map((section) => (
        <Shelf
          key={section.heading}
          section={section}
          products={productBySlug}
        />
      ))}
      <section className="site-container section-space">
        <SectionHeading
          label="Inside Crafting Corner"
          title="A collection, in its own setting."
          text="Explore more corners of our showroom, from quiet neutral seating to expressive accents."
        />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            ['DSC00051', 'Sage-toned upholstered seating'],
            ['DSC00061', 'Neutral lounge seating arrangement'],
            ['DSC09434', 'Accent chair in a softly lit showroom corner'],
            ['DSC00056', 'Furniture and seating in the Mohali showroom'],
          ].map(([photo, alt]) => (
            <Photo
              key={photo}
              src={`/images/real/large/${photo}.webp`}
              alt={alt}
              className="aspect-[2/3] rounded-xl"
              sizes="(max-width: 1023px) 50vw, 25vw"
            />
          ))}
        </div>
      </section>
      {homepage.sections.testimonials.visible && testimonials.length ? (
        <section className="site-container section-space">
          <SectionHeading
            label="Client perspectives"
            title={homepage.sections.testimonials.heading}
          />
          <div className="grid gap-6 md:grid-cols-2">
            {testimonials.map((item) => (
              <blockquote
                key={item.id}
                className="rounded-xl border border-[#ded3c5] p-7"
              >
                <p className="font-display text-2xl leading-relaxed">
                  {item.quote}
                </p>
                <footer className="mt-5 text-sm text-[#746354]">
                  {item.name} · {item.location}
                </footer>
              </blockquote>
            ))}
          </div>
        </section>
      ) : null}
      <section className="site-container section-space">
        <div className="grid justify-items-center gap-6 rounded-2xl border border-[#ded3c5] bg-[#efe6da] px-5 py-9 text-center sm:px-10 sm:py-12">
          <div>
            <p className="eyebrow">Make room for something personal</p>
            <h2 className="mt-3 text-balance font-display text-3xl font-normal leading-tight sm:text-4xl">
              Let’s find the right piece for your space.
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-pretty text-sm leading-7 text-[#746354]">
              Visit our showroom or speak with our team about finishes, sizing
              and availability.
            </p>
          </div>
          <LeadCapture />
        </div>
      </section>
    </>
  );
}
function SectionHeading({
  label,
  title,
  text,
}: {
  label: string;
  title: string;
  text?: string;
}) {
  return (
    <div className="mb-8 text-center sm:mb-10 md:text-start">
      <div>
        <p className="eyebrow">{label}</p>
        <h2 className="mt-3 text-balance font-display text-[clamp(2rem,3.5vw,3rem)] font-normal leading-tight text-[#38291f]">
          {title}
        </h2>
        {text ? (
          <p className="mx-auto mt-3 max-w-xl text-pretty text-sm leading-7 text-[#746354] md:mx-0">
            {text}
          </p>
        ) : null}
      </div>
    </div>
  );
}
function Shelf({
  section,
  products,
}: {
  section: HomepageData['sections']['featured'];
  products: Map<string, Product>;
}) {
  const selected = [...new Set(section.productSlugs)]
    .map((slug) => products.get(slug))
    .filter((product): product is Product => Boolean(product));
  if (!section.visible || !selected.length) return null;
  return (
    <section className="site-container section-space">
      <div className="mb-8 flex flex-col items-center gap-3 text-center md:flex-row md:items-end md:justify-between md:text-start">
        <div>
          <p className="eyebrow">From the collection</p>
          <h2 className="mt-3 text-balance font-display text-[clamp(2rem,3.5vw,3rem)] font-normal leading-tight">
            {section.heading}
          </h2>
        </div>
        <Link
          href="/products"
          className="flex min-h-11 items-center gap-2 border-b border-[#bda78f] text-sm text-walnut"
        >
          View collection <ArrowUpRight size={16} />
        </Link>
      </div>
      <div className="product-grid">
        {selected.map((product) => (
          <ProductCard key={product.slug} {...product} />
        ))}
      </div>
    </section>
  );
}

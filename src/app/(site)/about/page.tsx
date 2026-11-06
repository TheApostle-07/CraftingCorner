import Link from 'next/link';
import Photo from '@/components/Photo';
export const metadata = {
  title: 'Our Story | Crafting Corner',
  description:
    'Explore the Crafting Corner showroom in Mohali and discover furniture through its forms, finishes and details.',
};
export default function About() {
  return (
    <div className="site-container pb-16 pt-10">
      <section className="grid items-center gap-9 md:grid-cols-2 lg:gap-16">
        <div className="site-enter min-w-0 text-center md:text-start">
          <p className="eyebrow">Our story</p>
          <h1 className="mt-4 text-balance font-display text-[clamp(2.5rem,5.7vw,4rem)] font-normal leading-[1.08]">
            Furniture with character. Spaces with a story.
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-pretty text-sm leading-7 text-[#746354] md:mx-0">
            Crafting Corner brings together furniture and decorative pieces for
            spaces that feel personal. From sculptural accents to classic
            silhouettes, our Mohali showroom is a place to explore, look closely
            and find your own point of view.
          </p>
          <p className="mx-auto mt-4 max-w-lg text-pretty text-sm leading-7 text-[#746354] md:mx-0">
            See the pieces in their setting, consider the details, and speak
            with our team about what works for your room.
          </p>
          <Link href="/contact" className="site-button mt-7">
            Plan a showroom visit
          </Link>
        </div>
        <Photo
          src="/images/real/large/DSC00391.webp"
          alt="The Crafting Corner showroom with classic cream and gold-tone seating"
          className="site-enter-photo mx-auto aspect-[4/5] w-full max-w-[480px] rounded-b-2xl rounded-t-[clamp(4rem,11vw,7rem)] md:aspect-[2/3]"
          fit="cover"
          priority
        />
      </section>
      <section
        data-reveal
        className="section-space grid items-center gap-9 md:grid-cols-2 lg:gap-16"
      >
        <Photo
          src="/images/real/large/DSC00056.webp"
          alt="Seating and tables arranged in the Crafting Corner showroom"
          className="mx-auto aspect-[4/5] w-full max-w-[480px] rounded-2xl md:aspect-[2/3]"
          fit="cover"
        />
        <div className="min-w-0 text-center md:text-start">
          <p className="eyebrow">A personal approach</p>
          <h2 className="mt-4 text-balance font-display text-4xl font-normal leading-tight">
            Start with your space. Take time with the details.
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-pretty text-sm leading-7 text-[#746354] md:mx-0">
            Bring a few room photographs, measurements or an idea you have been
            thinking about. Our team can help you explore the collection and
            discuss the finish, proportions and availability of the pieces you
            are considering.
          </p>
          <Link href="/products" className="site-button mt-7">
            Explore the collection
          </Link>
        </div>
      </section>
      <section className="section-space">
        <div data-reveal className="mb-9 text-center">
          <p className="eyebrow">A closer look</p>
          <h2 className="mt-4 text-balance font-display text-4xl font-normal leading-tight">
            Texture. Form. Finishing touches.
          </h2>
        </div>
        <div className="grid grid-cols-3 gap-3 sm:gap-6">
          {[
            ['DSC00415', 'Carved detailing'],
            ['DSC00431', 'Decorative finishing'],
            ['DSC09420', 'Sculptural texture'],
          ].map(([name, label]) => (
            <figure key={name}>
              <Photo
                src={`/images/real/large/${name}.webp`}
                alt={label}
                className="aspect-[2/3] rounded-xl"
              />
              <figcaption className="mt-3 text-center text-xs text-[#746354]">
                {label}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
    </div>
  );
}

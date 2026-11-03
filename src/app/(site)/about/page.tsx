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
      <section className="grid items-center gap-10 md:grid-cols-2 md:gap-20">
        <div>
          <p className="eyebrow">Our story</p>
          <h1 className="mt-5 font-display text-5xl font-normal leading-[1.05] sm:text-6xl">
            Furniture with character.
            <br />
            Spaces with a story.
          </h1>
          <p className="mt-6 text-sm leading-8 text-[#746354]">
            Crafting Corner brings together furniture and decorative pieces for
            spaces that feel personal. From sculptural accents to classic
            silhouettes, our Mohali showroom is a place to explore, look closely
            and find your own point of view.
          </p>
          <p className="mt-4 text-sm leading-8 text-[#746354]">
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
          className="aspect-[2/3] rounded-t-[7rem] rounded-b-2xl"
          priority
        />
      </section>
      <section className="section-space grid items-center gap-10 md:grid-cols-2 md:gap-20">
        <Photo
          src="/images/real/large/DSC00056.webp"
          alt="Seating and tables arranged in the Crafting Corner showroom"
          className="aspect-[2/3] rounded-2xl"
        />
        <div>
          <p className="eyebrow">A personal approach</p>
          <h2 className="mt-5 font-display text-4xl font-normal">
            Start with your space.
            <br />
            Take time with the details.
          </h2>
          <p className="mt-5 text-sm leading-8 text-[#746354]">
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
        <p className="eyebrow text-center">A closer look</p>
        <h2 className="mb-9 mt-4 text-center font-display text-4xl font-normal">
          Texture. Form. Finishing touches.
        </h2>
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

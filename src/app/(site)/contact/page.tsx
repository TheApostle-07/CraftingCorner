import Link from 'next/link';
import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import Photo from '@/components/Photo';
import ContactForm from '@/components/ContactForm';
import { loadSiteData } from '@/lib/loaders.server';
import { pageMetadata } from '@/lib/seo';
export const metadata = pageMetadata(
  'Contact Our Mohali Showroom | Crafting Corner',
  'Arrange a visit to the Crafting Corner showroom in Mohali or contact us about furniture, finishes, availability and a quotation.',
  '/contact',
  '/images/real/large/DSC00391.webp',
);
export default async function ContactPage() {
  const site = await loadSiteData();
  const whatsappNumber = site.whatsapp.number.replace(/\D/g, '');
  return (
    <div className="site-container pb-14 pt-9 sm:pb-20 sm:pt-14">
      <section className="grid items-center gap-9 md:grid-cols-2 lg:gap-16">
        <div className="site-enter min-w-0 text-center md:text-start">
          <p className="eyebrow">Visit & connect</p>
          <h1 className="mt-4 text-balance font-display text-[clamp(2.6rem,5.7vw,4.5rem)] font-normal leading-[1.05]">
            Your space. Let’s talk about it.
          </h1>
          <p className="mx-auto mt-5 max-w-md text-pretty text-sm leading-7 text-[#746354] md:mx-0">
            Have a piece in mind or a room to bring together? Speak with us
            about the details, explore your options and arrange a showroom
            visit.
          </p>
          <div className="mt-6 grid gap-2 text-sm leading-7 text-[#66513e]">
            <p className="flex items-start justify-center gap-2 md:justify-start">
              <MapPin size={19} className="mt-1 shrink-0" />
              {site.contact.address}
            </p>
            <a
              href={`tel:${site.contact.phone}`}
              className="flex min-h-11 items-center justify-center gap-2 hover:underline md:justify-start"
            >
              <Phone size={19} />
              {site.contact.phone}
            </a>
            <a
              href={`mailto:${site.contact.email}`}
              className="flex min-h-11 items-center justify-center gap-2 [overflow-wrap:anywhere] hover:underline md:justify-start"
            >
              <Mail size={19} className="shrink-0" />
              <span className="min-w-0">{site.contact.email}</span>
            </a>
          </div>
          {site.whatsapp.enabled && /^[1-9]\d{9,14}$/.test(whatsappNumber) ? (
            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(site.whatsapp.defaultMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="site-button mt-6"
            >
              <MessageCircle size={17} />
              Enquire on WhatsApp
            </a>
          ) : null}
          <Link
            href="/products"
            className="mx-auto mt-3 flex w-fit min-h-11 items-center text-sm text-walnut underline decoration-[#bda78f] underline-offset-4 md:mx-0"
          >
            Explore the collection first
          </Link>
        </div>
        <Photo
          src="/images/real/large/DSC00391.webp"
          alt="Classic seating in the Crafting Corner Mohali showroom"
          className="site-enter-photo mx-auto aspect-[4/5] w-full max-w-[480px] rounded-b-2xl rounded-t-[clamp(4rem,11vw,7rem)] md:aspect-[2/3]"
          fit="cover"
          priority
        />
      </section>
      <section className="mt-14 grid items-center gap-8 rounded-2xl border border-[#ded3c5] bg-white/50 p-5 sm:mt-20 sm:p-10 md:grid-cols-2 lg:gap-14">
        <div data-reveal className="min-w-0 text-center md:text-start">
          <p className="eyebrow">Start a conversation</p>
          <h2 className="mt-3 text-balance font-display text-4xl font-normal leading-tight">
            Tell us what you have in mind.
          </h2>
          <p className="mt-3 text-pretty text-sm leading-7 text-[#746354]">
            Share the piece you like, your room measurements or a few details
            about your project.
          </p>
        </div>
        <ContactForm />
      </section>
    </div>
  );
}

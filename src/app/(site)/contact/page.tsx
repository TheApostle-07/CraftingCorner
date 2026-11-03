import Link from 'next/link';
import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import Photo from '@/components/Photo';
import ContactForm from '@/components/ContactForm';
import { loadSiteData } from '@/lib/loaders.server';
export const metadata = {
  title: 'Visit & Connect | Crafting Corner',
  description:
    'Speak with Crafting Corner about your space, final pricing, finishes and availability. Visit our Mohali showroom.',
};
export default async function ContactPage() {
  const site = await loadSiteData();
  const whatsappNumber = site.whatsapp.number.replace(/\D/g, '');
  return (
    <div className="site-container pb-20 pt-10 sm:pt-14">
      <section className="grid items-center gap-10 md:grid-cols-2 lg:gap-20">
        <div>
          <p className="eyebrow">Visit & connect</p>
          <h1 className="mt-5 font-display text-5xl font-normal leading-[1.05] sm:text-6xl">
            Your space.
            <br />
            Let’s talk about it.
          </h1>
          <p className="mt-6 max-w-md text-sm leading-8 text-[#746354]">
            Have a piece in mind or a room to bring together? Speak with us
            about the details, explore your options and arrange a showroom
            visit.
          </p>
          <div className="mt-8 space-y-5 text-sm leading-7 text-[#66513e]">
            <p className="flex items-start gap-3">
              <MapPin size={19} className="mt-1 shrink-0" />
              {site.contact.address}
            </p>
            <a
              href={`tel:${site.contact.phone}`}
              className="flex items-center gap-3"
            >
              <Phone size={19} />
              {site.contact.phone}
            </a>
            <a
              href={`mailto:${site.contact.email}`}
              className="flex items-center gap-3 break-all"
            >
              <Mail size={19} />
              {site.contact.email}
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
            className="mt-5 flex w-fit min-h-11 items-center border-b border-[#bda78f] text-sm text-walnut"
          >
            Explore the collection first
          </Link>
        </div>
        <Photo
          src="/images/real/large/DSC00391.webp"
          alt="Classic seating in the Crafting Corner Mohali showroom"
          className="aspect-[2/3] rounded-t-[7rem] rounded-b-2xl"
          priority
        />
      </section>
      <section className="section-space grid gap-10 rounded-2xl border border-[#ded3c5] bg-white/50 p-6 sm:p-10 md:grid-cols-[0.7fr_1fr]">
        <div>
          <p className="eyebrow">Start a conversation</p>
          <h2 className="mt-4 font-display text-4xl font-normal">
            Tell us what you
            <br />
            have in mind.
          </h2>
          <p className="mt-5 text-sm leading-7 text-[#746354]">
            Share the piece you like, your room measurements or a few details
            about your project.
          </p>
        </div>
        <ContactForm />
      </section>
    </div>
  );
}

/* --------------------------------------------------------------------------
   src/app/contact/page.tsx – v2
   "Contact Us" – Crafting Corner (polished edition)
   ▸ App-Router client component
   ▸ Framer-motion variants + stagger
   ▸ Accessible, mobile-first form with inline validation
   ▸ Decorative SVG waves + subtle glass-effect cards
--------------------------------------------------------------------------- */
'use client';

import { useState, useId, FormEvent } from 'react';
import { motion, Variants } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Home, Phone, Mail, MapPin, Send as SendIcon } from 'lucide-react';

/* ─────────────────────────────── Animations ──────────────────────────────── */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  show:   (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut', delay: i * 0.05 },
  }),
};

/* ─────────────────────────────── Form logic ─────────────────────────────── */
const initialState = { name: '', email: '', phone: '', message: '' } as const;

type State = typeof initialState & { sent: boolean };

function useContactForm() {
  const [state, set] = useState<State>({ ...initialState, sent: false });

  const update = (k: keyof State, v: string) => set((s) => ({ ...s, [k]: v }));
  const reset  = () => set({ ...initialState, sent: false });

  const submit = () => {
    // 👉 Hook up to real backend / Netlify handler here
    set((s) => ({ ...s, sent: true }));
  };

  return { state, update, submit, reset };
}

/* ────────────────────────────── Main page ──────────────────────────────── */
export default function ContactPage() {
  const { state, update, submit, reset } = useContactForm();
  const id = useId();

  return (
    <motion.main
      initial="hidden"
      animate="show"
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.15 } } }}
      className="space-y-24 pb-24"
    >
      {/* ── Hero banner ───────────────────────────────────────────── */}
      <motion.section variants={fadeUp} className="relative isolate overflow-hidden bg-[#7b593b]/10">
        <Image
          src="/assets/img/contact/contactus.png"
          alt="Woodworker sanding furniture"
          fill priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        <div className="relative mx-auto max-w-3xl px-6 py-28 text-center text-ivory">
          <h1 className="font-display text-4xl font-semibold sm:text-5xl text-white drop-shadow-lg">We’d love to hear from you</h1>
          <p className="mx-auto mt-4 max-w-md text-lg text-white/90 drop-shadow">
            Questions, custom orders or just a hello – drop us a line and our consultants reply within 24 h.
          </p>
        </div>
      </motion.section>

      {/* ── Info cards + map ─────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6">
        <div className="grid gap-8 lg:grid-cols-3">
          <InfoCard
  title="Showroom & Studio"
  icon={<MapPin className="h-6 w-6" />}
  i={0}
>
  <address className="not-italic leading-relaxed">
    Crafting Corner<br />
    Plot&nbsp;No.&nbsp;522, Sector&nbsp;82&nbsp;JLPL<br />
    Mohali, Punjab&nbsp;160082
  </address>
</InfoCard>

          <InfoCard title="Call / WhatsApp" icon={<Phone className="h-6 w-6" />} i={1}>
            <Link href="tel:+919056888917" className="block hover:underline">+91 90568 88917</Link>
            <Link
              href="https://wa.me/919056888917?text=Hi%20Crafting%20Corner!"
              target="_blank" rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-2 rounded-full bg-green-500 px-4 py-1.5 text-ivory shadow hover:bg-green-600"
            >
              <WhatsAppIcon className="h-4 w-4"/> Enquire
            </Link>
          </InfoCard>

          <InfoCard title="Email Us" icon={<Mail className="h-6 w-6" />} i={2}>
            <Link href="mailto:craftingcorner.cc17@gmail.com" className="rounded bg-walnut/90 px-4 py-1.5 text-ivory shadow hover:bg-walnut">
              craftingcorner.cc17@gmail.com
            </Link>
          </InfoCard>
        </div>

        {/* Map */}
        <motion.div
          variants={fadeUp}
          custom={3}
          className="mt-14 overflow-hidden rounded-2xl shadow-lg"
        >
          {/* Responsive 16:9 container */}
          <div className="relative w-full pt-[56.25%]">
  <iframe
    title="Crafting Corner – Mohali showroom"
    src="https://www.google.com/maps?q=Plot+no.+522,+Sector+82+JLPL+Mohali,+Punjab+160082&output=embed"
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
    allowFullScreen
    className="absolute inset-0 h-full w-full border-0"
  />
</div>
        </motion.div>
      </section>

      {/* ── Contact form ─────────────────────────────────────────── */}
      <section className="mx-auto max-w-4xl px-6">
        <motion.h2 variants={fadeUp} className="mb-10 font-display text-3xl font-semibold text-[#7b593b]">
          Send us a message
        </motion.h2>

        {state.sent ? (
          <motion.div variants={fadeUp} className="rounded-lg bg-green-100 p-6 text-center text-green-800 shadow">
            <p className="text-lg font-medium">Thank you!</p>
            <p className="mt-1 text-sm">Your message is in our workshop – we’ll reply shortly. 😊</p>
            <button onClick={reset} className="mt-4 rounded bg-[#7b593b] px-5 py-2 text-ivory shadow hover:bg-[#684a32]">
              Send another message
            </button>
          </motion.div>
        ) : (
          <motion.form
            variants={fadeUp}
            onSubmit={(e: FormEvent) => { e.preventDefault(); submit(); }}
            className="grid gap-6 sm:grid-cols-2"
          >
            <Input label="Name"   value={state.name}   onChange={(v) => update('name', v)} required id={`${id}-name`} full />
            <Input label="Email"  value={state.email}  onChange={(v) => update('email', v)} type="email" required id={`${id}-email`} />
            <Input label="Phone (optional)" value={state.phone} onChange={(v) => update('phone', v)} type="tel" id={`${id}-phone`} />
            <Textarea label="Message" value={state.message} onChange={(v) => update('message', v)} required id={`${id}-msg`} full rows={4} />
            <button
              type="submit"
              className="sm:col-span-2 flex w-full items-center justify-center gap-2 rounded-full bg-[#7b593b] px-6 py-3 font-medium text-white shadow transition hover:bg-[#684a32]"
            >
              <SendIcon className="h-4 w-4" />
              Send&nbsp;Message
            </button>
          </motion.form>
        )}
      </section>
    </motion.main>
  );
}

/* ───────────────────────────── helper components ────────────────────────── */
function InfoCard({
  title,
  icon,
  i,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  i: number;
  children: React.ReactNode;
}) {
  return (
    <motion.article
      variants={fadeUp}
      custom={i}
      className="relative flex h-full flex-col justify-between overflow-hidden rounded-2xl bg-ivory/80 p-8 shadow-lg backdrop-blur-lg ring-1 ring-walnut/10 transition-shadow hover:shadow-xl"
    >
      <div className="absolute right-4 top-4 text-walnut/30">{icon}</div>
      <h3 className="font-display text-xl font-medium text-walnut">{title}</h3>
      <div className="mt-3 space-y-1 text-charcoal/90">{children}</div>
    </motion.article>
  );
}

function Input({ label, id, value, onChange, type = 'text', required = false, full = false }: {
  label: string; id: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean; full?: boolean;
}) {
  return (
    <div className={full ? 'sm:col-span-2' : ''}>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-walnut/90">{label}{required && ' *'}</label>
      <input
        id={id}
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded border border-charcoal/20 p-3 shadow-inner focus:outline-none focus:ring-2 focus:ring-walnut/50"
      />
    </div>
  );
}

function Textarea({ label, id, value, onChange, rows = 4, required = false, full = false }: {
  label: string; id: string; value: string; onChange: (v: string) => void; rows?: number; required?: boolean; full?: boolean;
}) {
  return (
    <div className={full ? 'sm:col-span-2' : ''}>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-walnut/90">{label}{required && ' *'}</label>
      <textarea
        id={id}
        rows={rows}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded border border-charcoal/20 p-3 shadow-inner focus:outline-none focus:ring-2 focus:ring-walnut/50"
      />
    </div>
  );
}

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.148-.672.15-.197.297-.768.967-.94 1.164-.173.198-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.15-.173.198-.298.298-.497.099-.198.05-.372-.025-.521-.074-.148-.672-1.612-.921-2.206-.242-.579-.487-.5-.672-.51-.173-.01-.372-.01-.571-.01-.198 0-.521.075-.795.372-.273.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.077 4.487.709.306 1.262.488 1.694.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.414.248-.694.248-1.288.173-1.414-.074-.124-.272-.198-.57-.347z"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12c0 1.989.584 3.839 1.593 5.395L2 22l4.744-1.562A9.952 9.952 0 0012 22c5.52 0 10-4.48 10-10S17.52 2 12 2zM4 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8a7.95 7.95 0 01-4.065-1.133l-.289-.174-.312.103L4 20l1.225-3.259-.211-.329A7.948 7.948 0 014 12z"/>
  </svg>
);

'use client';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { CheckCircle2, LoaderCircle, ArrowUpRight } from 'lucide-react';
import { sendLead } from '@/lib/sendLead';
export default function ContactForm() {
  const confirmation = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>(
    'idle',
  );
  useEffect(() => {
    if (status !== 'sent') return;
    confirmation.current?.focus({ preventScroll: true });
    confirmation.current?.scrollIntoView({
      block: 'center',
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'instant'
        : 'smooth',
    });
  }, [status]);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === 'sending') return;
    const data = new FormData(event.currentTarget);
    setStatus('sending');
    const success = await sendLead(
      String(data.get('name')).trim(),
      String(data.get('email')).trim(),
      String(data.get('phone') || '').trim(),
      String(data.get('message')).trim(),
      String(data.get('website') || ''),
    );
    setStatus(success ? 'sent' : 'error');
  }
  if (status === 'sent')
    return (
      <div
        ref={confirmation}
        tabIndex={-1}
        role="status"
        className="self-center rounded-xl border border-emerald-200 bg-emerald-50 p-7 text-emerald-900"
      >
        <CheckCircle2 size={26} />
        <h3 className="mt-4 font-display text-3xl">
          Your message has been received.
        </h3>
        <p className="mt-3 text-sm leading-7">
          Thank you for reaching out. Our team will get back to you using the
          details you shared.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-5 min-h-11 text-sm underline underline-offset-4"
        >
          Send another message
        </button>
      </div>
    );
  const input =
    'mt-2 min-h-12 w-full rounded-lg border border-[#d5c7b5] bg-white px-4 py-3 text-base text-charcoal outline-none focus:border-walnut';
  return (
    <form onSubmit={submit} className="grid gap-5 sm:grid-cols-2">
      <label className="text-sm text-[#66513e] sm:col-span-2">
        Name
        <input
          name="name"
          autoComplete="name"
          required
          minLength={2}
          maxLength={100}
          className={input}
        />
      </label>
      <label className="text-sm text-[#66513e]">
        Email
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          maxLength={254}
          className={input}
        />
      </label>
      <label className="text-sm text-[#66513e]">
        Phone (optional)
        <input
          name="phone"
          type="tel"
          autoComplete="tel"
          maxLength={20}
          pattern="[+0-9() \-]{7,20}"
          className={input}
        />
      </label>
      <label className="text-sm text-[#66513e] sm:col-span-2">
        Your message
        <textarea
          name="message"
          required
          minLength={10}
          maxLength={4000}
          rows={5}
          className={input}
        />
      </label>
      <div className="hidden" aria-hidden="true">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      {status === 'error' ? (
        <p
          role="alert"
          className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm leading-6 text-rose-900 sm:col-span-2"
        >
          We couldn’t confirm delivery. Your message is still here. Please try
          again, or contact us by phone or WhatsApp above.
        </p>
      ) : null}
      <button
        type="submit"
        disabled={status === 'sending'}
        className="site-button sm:col-span-2"
      >
        {status === 'sending' ? (
          <>
            <LoaderCircle size={18} className="animate-spin" />
            Sending your message…
          </>
        ) : (
          <>
            Send message <ArrowUpRight size={18} />
          </>
        )}
      </button>
    </form>
  );
}

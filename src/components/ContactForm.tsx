'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowUpRight, CheckCircle2, LoaderCircle } from 'lucide-react';
import { sendLead, type LeadKind } from '@/lib/sendLead';
import { trackContactConversion } from './ConversionAnalytics';

export default function ContactForm({
  kind = 'contact',
  onDone,
}: {
  kind?: LeadKind;
  onDone?: () => void;
}) {
  const callback = kind === 'callback';
  const confirmation = useRef<HTMLDivElement>(null);
  const sending = useRef(false);
  const attempt = useRef<{ details: string; id?: string }>(null);
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    if (status !== 'sent') return;
    const notice = confirmation.current;
    if (!notice || notice.closest('dialog:not([open])')) return;
    notice.focus({ preventScroll: true });
    notice.scrollIntoView({ block: 'nearest' });
  }, [status]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending.current) return;
    sending.current = true;
    const data = new FormData(event.currentTarget);
    const details = {
      kind,
      name: String(data.get('name') ?? '').trim(),
      email: String(data.get('email') ?? '').trim(),
      phone: String(data.get('phone') ?? '').trim(),
      message: String(data.get('message') ?? '').trim(),
      website: String(data.get('website') ?? ''),
    };
    const key = JSON.stringify(details);
    if (attempt.current?.details !== key) {
      attempt.current = { details: key, id: globalThis.crypto?.randomUUID?.() };
    }
    setFeedback('');
    setStatus('sending');
    const result = await sendLead({
      ...details,
      submissionId: attempt.current.id,
    });
    sending.current = false;
    if (result.ok === true) {
      attempt.current = null;
      setStatus('sent');
      trackContactConversion(kind);
    } else {
      setFeedback(result.message);
      setStatus('idle');
    }
  }

  if (status === 'sent') {
    return (
      <div
        ref={confirmation}
        tabIndex={-1}
        role="status"
        className="self-center rounded-2xl border border-[#c5d0bd] bg-[#f1f5ed] p-6 text-center text-[#354c35]"
      >
        <CheckCircle2 size={24} className="mx-auto" aria-hidden="true" />
        <p className="mt-3 font-display text-3xl leading-tight">
          {callback ? 'Callback requested.' : 'Message received.'}
        </p>
        <p className="mx-auto mt-2 max-w-xs text-sm leading-6">
          Our team will get back to you using the details you shared.
        </p>
        <button
          type="button"
          onClick={onDone ?? (() => setStatus('idle'))}
          className="mt-2 min-h-11 text-sm underline underline-offset-4"
        >
          {onDone ? 'Done' : 'Send another message'}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} aria-busy={status === 'sending'} className="text-start">
      <fieldset
        disabled={status === 'sending'}
        className={`grid min-w-0 gap-4 ${callback ? '' : 'sm:grid-cols-2'}`}
      >
        <label className="text-sm text-[#5e4937] sm:col-span-full">
          Full name
          <input
            name="name"
            autoComplete="name"
            required
            minLength={2}
            maxLength={100}
            className="enquiry-input"
          />
        </label>
        <label className="text-sm text-[#5e4937]">
          Email address
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
            className="enquiry-input"
          />
        </label>
        <label className="text-sm text-[#5e4937]">
          {callback ? 'Phone number' : 'Phone number (optional)'}
          <input
            name="phone"
            type="tel"
            autoComplete="tel"
            required={callback}
            maxLength={25}
            className="enquiry-input"
          />
        </label>
        {!callback && (
          <label className="text-sm text-[#5e4937] sm:col-span-full">
            Your message
            <textarea
              name="message"
              required
              minLength={10}
              maxLength={4000}
              rows={5}
              className="enquiry-input resize-y"
            />
          </label>
        )}
        <div hidden aria-hidden="true">
          <label>
            Website
            <input name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>
        {feedback && (
          <p
            role="alert"
            className="rounded-lg border border-[#e6c4ba] bg-[#fcf2ef] p-3 text-sm leading-6 text-[#783e33] sm:col-span-full"
          >
            {feedback}
          </p>
        )}
        <button type="submit" className="site-button w-full sm:col-span-full">
          {status === 'sending' ? (
            <>
              <LoaderCircle
                size={17}
                className="animate-spin"
                aria-hidden="true"
              />{' '}
              Sending…
            </>
          ) : (
            <>
              {callback ? 'Request a callback' : 'Send message'}{' '}
              <ArrowUpRight size={17} aria-hidden="true" />
            </>
          )}
        </button>
      </fieldset>
      {callback && (
        <p className="mt-4 text-center text-xs leading-5 text-[#6d5844]">
          We’ll use your details to respond to this request.{' '}
          <Link
            href="/contact"
            className="inline-block py-2 underline underline-offset-4"
          >
            Other ways to reach us
          </Link>
        </p>
      )}
    </form>
  );
}

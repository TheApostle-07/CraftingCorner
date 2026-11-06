'use client';

import { useEffect, useId, useRef } from 'react';
import Image from 'next/image';
import { ArrowUpRight, X } from 'lucide-react';
import ContactForm from './ContactForm';

const sessionKey = 'leadModalShown';
let openedInTab = false;

function hasOpened() {
  try {
    return openedInTab || sessionStorage.getItem(sessionKey) === 'true';
  } catch {
    return openedInTab;
  }
}

function openDialog(dialog: HTMLDialogElement | null) {
  if (!dialog?.isConnected || document.querySelector('dialog[open]')) return;
  dialog.showModal();
  openedInTab = true;
  try {
    sessionStorage.setItem(sessionKey, 'true');
  } catch {
    // The in-memory flag still prevents repeat prompts while navigating this tab.
  }
}

export default function LeadCapture() {
  const dialog = useRef<HTMLDialogElement>(null);
  const id = useId();

  useEffect(() => {
    if (hasOpened()) return;
    let checks = 0;
    let timer = window.setTimeout(offerCallback, 5000);

    function offerCallback() {
      if (hasOpened() || window.scrollY > window.innerHeight) return;
      const focused = document.activeElement;
      const interacting =
        focused &&
        focused !== document.body &&
        focused.matches(':focus-visible, input, textarea, select');
      if (
        document.hidden ||
        interacting ||
        document.querySelector('dialog[open]')
      ) {
        if (++checks < 4) timer = window.setTimeout(offerCallback, 3000);
        return;
      }
      openDialog(dialog.current);
    }

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        aria-controls={id}
        onClick={() => openDialog(dialog.current)}
        className="site-button"
      >
        Request a callback <ArrowUpRight size={17} aria-hidden="true" />
      </button>
      <dialog
        id={id}
        ref={dialog}
        aria-labelledby={`${id}-title`}
        aria-describedby={`${id}-description`}
        className="lead-dialog"
      >
        <div className="relative px-5 pb-5 pt-6 sm:px-8 sm:pb-7 sm:pt-7">
          <button
            type="button"
            autoFocus
            aria-label="Close callback form"
            onClick={() => dialog.current?.close()}
            className="absolute right-3 top-3 grid h-11 w-11 place-items-center rounded-full text-walnut transition-colors hover:bg-[#eee7dc]"
          >
            <X size={20} aria-hidden="true" />
          </button>
          <div className="mb-5 text-center sm:mb-6">
            <Image
              src="/favicon.png"
              alt=""
              width={40}
              height={40}
              className="mx-auto"
            />
            <p className="eyebrow mt-3">Crafting Corner · Mohali</p>
            <h2
              id={`${id}-title`}
              className="mt-2 text-balance font-display text-[2.25rem] font-normal leading-[1.05] text-[#38291f] sm:text-[2.6rem]"
            >
              Let’s talk about your space.
            </h2>
            <p
              id={`${id}-description`}
              className="mx-auto mt-2 max-w-xs text-pretty text-sm leading-6 text-[#6d5844]"
            >
              Leave your details and our showroom team will get in touch.
            </p>
          </div>
          <ContactForm kind="callback" onDone={() => dialog.current?.close()} />
        </div>
      </dialog>
    </>
  );
}

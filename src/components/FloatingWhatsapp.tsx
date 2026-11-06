'use client';
import { FaWhatsapp } from 'react-icons/fa';

type Props = {
  /** E.164 phone number WITHOUT “+” (e.g. 919876543210) */
  phone: string;
  /** Optional pre-filled text that appears in WhatsApp */
  message?: string;
};

export default function FloatingWhatsapp({ phone, message = '' }: Props) {
  const number = phone.replace(/\D/g, '');
  if (!/^[1-9]\d{9,14}$/.test(number)) return null;
  const url = `https://wa.me/${number}${message ? `?text=${encodeURIComponent(message)}` : ''}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-[max(0.75rem,env(safe-area-inset-bottom))] right-[max(0.75rem,env(safe-area-inset-right))] z-40 grid h-12 w-12 place-items-center rounded-full bg-[#216846] text-white shadow-md transition-colors hover:bg-[#185039] sm:bottom-6 sm:right-6 sm:h-[3.25rem] sm:w-[3.25rem]"
    >
      <FaWhatsapp className="h-6 w-6" aria-hidden="true" />
    </a>
  );
}

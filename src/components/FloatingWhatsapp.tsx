'use client';
import { FaWhatsapp } from 'react-icons/fa';

type Props = {
  /** E.164 phone number WITHOUT “+” (e.g. 919876543210) */
  phone: string;
  /** Optional pre-filled text that appears in WhatsApp */
  message?: string;
};

export default function FloatingWhatsapp({ phone, message = '' }: Props) {
  const url = `https://wa.me/${phone}${message ? `?text=${encodeURIComponent(message)}` : ''}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed z-50 flex items-center justify-center rounded-full bg-green-500 shadow-lg
    transition-transform hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-400
    bottom-3 right-3 h-12 w-12
    sm:bottom-6 sm:right-6 sm:h-14 sm:w-14
    lg:bottom-8 lg:right-8 lg:h-16 lg:w-16
  "
    >
      <FaWhatsapp className="h-7 w-7 text-white" />
      <span className="sr-only">WhatsApp</span>
    </a>
  );
}
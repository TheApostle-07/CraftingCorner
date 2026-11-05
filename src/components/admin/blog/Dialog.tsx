"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
let openDialogs = 0;
let originalOverflow = "";
export default function Dialog({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const close = useRef(onClose);
  close.current = onClose;
  useEffect(() => {
    const el = ref.current,
      focus = document.activeElement as HTMLElement,
      before = document.body.style.overflow;
    if (openDialogs === 0) originalOverflow = before;
    openDialogs++;
    el?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      el?.close();
      openDialogs = Math.max(0, openDialogs - 1);
      if (openDialogs === 0) document.body.style.overflow = originalOverflow;
      if (focus?.isConnected) focus.focus({ preventScroll: true });
    };
  }, []);
  return (
    <dialog
      ref={ref}
      onCancel={() => close.current()}
      onClick={(e) => {
        if (e.target === e.currentTarget) close.current();
      }}
      aria-label={title}
      className="blog-dialog rounded-2xl border border-[#ded3c5] bg-[#fffdf8] p-0 text-charcoal shadow-xl backdrop:bg-black/50 backdrop:backdrop-blur-sm"
    >
      <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-[#ded3c5] bg-[#fffdf8] px-5 py-3">
        <h2 className="font-display text-2xl font-medium">{title}</h2>
        <button
          autoFocus
          type="button"
          onClick={() => close.current()}
          aria-label={`Close ${title}`}
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full hover:bg-[#eee7dc]"
        >
          <X size={19} />
        </button>
      </div>
      <div className="p-5 sm:p-7">{children}</div>
    </dialog>
  );
}

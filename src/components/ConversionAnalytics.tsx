"use client";

import { useEffect, useState } from "react";
import type { LeadKind } from "@/lib/sendLead";

const consentKey = "cc-analytics-consent";
const clientKey = "cc-analytics-client";
let allowed = false;
let clientId: string | undefined;

function setConsent(consent: boolean) {
  allowed = consent;
  if (!consent) {
    clientId = undefined;
    try {
      sessionStorage.removeItem(clientKey);
    } catch {
      // The preference remains effective in memory when storage is blocked.
    }
  }
}

function track(
  event:
    | { event: "whatsapp_click" }
    | { event: "generate_lead"; formKind: LeadKind },
) {
  if (!allowed) return;
  try {
    clientId ||= sessionStorage.getItem(clientKey) || undefined;
  } catch {
    // An in-memory identifier is sufficient for this page.
  }
  clientId ||= globalThis.crypto?.randomUUID?.();
  if (!clientId) return;
  try {
    sessionStorage.setItem(clientKey, clientId);
  } catch {
    // Storage can be disabled by the browser.
  }
  void fetch("/api/analytics/conversion", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ ...event, clientId }),
    keepalive: true,
    referrerPolicy: "no-referrer",
  }).catch(() => {});
}

export function trackContactConversion(formKind: LeadKind) {
  track({ event: "generate_lead", formKind });
}

export default function ConversionAnalytics() {
  const [consent, setChoice] = useState(false);

  useEffect(() => {
    const update = (value: string | null) => {
      setConsent(value === "granted");
      setChoice(allowed);
    };
    try {
      update(localStorage.getItem(consentKey));
    } catch {
      // Optional measurement stays off by default.
    }
    function sync(event: StorageEvent) {
      if (event.key === consentKey || event.key === null)
        update(event.newValue);
    }
    function click(event: MouseEvent) {
      if (!allowed || !event.isTrusted || event.defaultPrevented) return;
      if (event.type === "auxclick" && event.button !== 1) return;
      const link =
        event.target instanceof Element
          ? event.target.closest("a[href]")
          : null;
      if (!(link instanceof HTMLAnchorElement)) return;
      const url = new URL(link.href);
      if (url.protocol === "https:" && url.hostname === "wa.me")
        track({ event: "whatsapp_click" });
    }
    window.addEventListener("storage", sync);
    document.addEventListener("click", click);
    document.addEventListener("auxclick", click);
    return () => {
      allowed = false;
      window.removeEventListener("storage", sync);
      document.removeEventListener("click", click);
      document.removeEventListener("auxclick", click);
    };
  }, []);

  return (
    <details className="mx-auto max-w-xs">
      <summary className="min-h-11 cursor-pointer content-center underline underline-offset-4">
        Analytics preferences
      </summary>
      <p className="mb-2">
        Optional analytics counts WhatsApp clicks and confirmed enquiries.
        Google Analytics receives a random tab identifier and the action type.
        Your contact details and message stay out of analytics.
      </p>
      <button
        type="button"
        aria-pressed={consent}
        aria-label="Allow optional analytics"
        className="min-h-11 rounded-lg border border-[#cdbba5] px-3"
        onClick={() => {
          setConsent(!consent);
          setChoice(allowed);
          try {
            localStorage.setItem(consentKey, allowed ? "granted" : "denied");
          } catch {
            // The visitor can still change the preference for this page.
          }
        }}
      >
        {consent ? "Analytics on · turn off" : "Analytics off · turn on"}
      </button>
    </details>
  );
}

"use client";

import { useEffect } from "react";

const targetSelector = "[data-reveal]:not([data-revealed])";

function visitTargets(node: Node, visit: (element: Element) => void) {
  if (!(node instanceof Element)) return;
  if (node.matches(targetSelector)) visit(node);
  node.querySelectorAll(targetSelector).forEach(visit);
}

export default function SiteReveal() {
  useEffect(() => {
    const main = document.getElementById("main-content");
    if (!main || typeof IntersectionObserver === "undefined") return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let offscreen = new WeakSet<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const { target, isIntersecting } of entries) {
          if (!main.contains(target)) continue;
          if (!isIntersecting) {
            offscreen.add(target);
            continue;
          }
          // Content already visible when observation starts stays still.
          if (offscreen.has(target) && !target.matches(":focus-within")) {
            target.setAttribute("data-revealed", "");
          }
          observer.unobserve(target);
        }
      },
      { rootMargin: "0px 0px -24px" },
    );

    const changes = new MutationObserver((records) => {
      for (const record of records) {
        record.removedNodes.forEach((node) => {
          visitTargets(node, (target) => {
            if (!main.contains(target)) observer.unobserve(target);
          });
        });
        record.addedNodes.forEach((node) => {
          visitTargets(node, (target) => {
            if (main.contains(target)) observer.observe(target);
          });
        });
      }
    });

    function syncPreference() {
      observer.disconnect();
      changes.disconnect();
      offscreen = new WeakSet<Element>();
      if (reducedMotion.matches) return;
      visitTargets(main, (target) => observer.observe(target));
      changes.observe(main, { childList: true, subtree: true });
    }

    syncPreference();
    reducedMotion.addEventListener("change", syncPreference);
    return () => {
      reducedMotion.removeEventListener("change", syncPreference);
      observer.disconnect();
      changes.disconnect();
    };
  }, []);

  return null;
}

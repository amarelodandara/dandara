"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { giftShopItems } from "@/content/gift-shop";
import { GiftShopRow } from "./gift-shop-row";
import { GiftShopPlaque } from "./gift-shop-plaque";
import {
  closeOverlay,
  openOverlay,
  useActiveOverlay,
} from "@/lib/exclusive-overlay";

const ID = "gift-shop";

/** One key, no modifier. No browser owns it, and it stands for the thing. */
const SHORTCUT = "g";

/** Typing an ordinary "g" into a field must never open the shop. */
const TYPING = "input, textarea, select, [contenteditable]";

export function GiftShop() {
  const [pastLanding, setPastLanding] = useState(false);

  // No local open state: the shared store already answers it, and asking it
  // directly means eviction needs no handling here at all.
  const active = useActiveOverlay();
  const open = active === ID;

  const panelRef = useRef<HTMLElement>(null);
  const plaqueRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => closeOverlay(ID), []);
  const openShop = useCallback(() => openOverlay(ID), []);

  // The page plane reads this and slides. Doing it through an attribute keeps
  // the plane a plain server-rendered element that knows nothing about state.
  useEffect(() => {
    if (open) document.body.setAttribute("data-shop-open", "");
    else document.body.removeAttribute("data-shop-open");
    return () => document.body.removeAttribute("data-shop-open");
  }, [open]);

  // The plaque waits until the visitor has walked past the landing.
  useEffect(() => {
    const landing = document.querySelector("[data-landing]");
    if (!landing) return;
    const observer = new IntersectionObserver(
      ([entry]) => setPastLanding(!entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(landing);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeOverlay(ID);
        return;
      }
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if ((event.target as HTMLElement | null)?.closest(TYPING)) return;
      if (event.key.toLowerCase() !== SHORTCUT) return;

      event.preventDefault();
      if (open) closeOverlay(ID);
      else openOverlay(ID);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  // Focus goes in with the drawer and comes back out with it.
  const heldFocus = useRef(false);
  useEffect(() => {
    if (open) {
      panelRef.current?.focus();
      heldFocus.current = true;
    } else if (heldFocus.current) {
      plaqueRef.current?.focus();
      heldFocus.current = false;
    }
  }, [open]);

  return (
    <>
      {/* Always mounted, always underneath the page plane, which is opaque —
          so it needs no hiding logic, only `inert` to stay out of tab order. */}
      <aside
        ref={panelRef}
        aria-label="Gift shop"
        tabIndex={-1}
        inert={!open || undefined}
        data-shop-panel
        className="fixed inset-y-0 left-0 z-0 flex w-[var(--shop-w)] flex-col overflow-y-auto px-5 py-8 outline-none"
      >
        <header className="px-3">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="text-[1.05rem] font-semibold tracking-[-0.01em]">
              Gift shop
            </h2>
            <button
              type="button"
              onClick={close}
              className="-m-3 p-3 text-[0.7rem] font-medium tracking-[0.01em] text-ink-soft underline decoration-[0.06em] underline-offset-[0.25em] transition-opacity hover:opacity-50"
            >
              Close
            </button>
          </div>
          <p className="mt-2 text-[0.8rem] leading-[1.45] text-ink-soft">
            Everything that is useful but not worth a wall. Take what you need.
          </p>
        </header>

        <ul className="mt-6 space-y-0.5">
          {giftShopItems.map((item) => (
            <li key={item.id}>
              <GiftShopRow item={item} />
            </li>
          ))}
        </ul>
      </aside>

      {/* Hidden whenever anything owns the screen — not just the shop. The page
          plane is a stacking context, so a focused work sheet cannot paint above
          a sibling of the plane, and this plaque is one. */}
      <GiftShopPlaque
        ref={plaqueRef}
        visible={pastLanding && active === null}
        onOpen={openShop}
      />
    </>
  );
}

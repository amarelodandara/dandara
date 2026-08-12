"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { giftShopSections } from "@/content/gift-shop";
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
      {/* Always mounted. Position, the slide, and the hiding all live in CSS
          keyed off `data-shop-open`, because the card floats above the plane
          now and nothing covers it at rest. `inert` keeps it out of tab order
          on top of that — visibility alone would, but this survives the
          transition window where it is still painted. */}
      <aside
        ref={panelRef}
        aria-label="Gift shop"
        tabIndex={-1}
        inert={!open || undefined}
        data-shop-panel
        className="flex flex-col px-5 py-8 outline-none"
      >
        <header className="px-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-[clamp(1.15rem,1.7vw,1.4rem)] font-semibold leading-tight tracking-[-0.01em]">
              Gift shop
            </h2>

            {/* The same key that opened the shop closes it, so the shortcut is
                taught where it is used. Clicking anywhere in the group works —
                the key is a label, not a target to be hit. */}
            <button
              type="button"
              onClick={close}
              aria-label="Close gift shop"
              className="group -m-2 flex shrink-0 items-center gap-1.5 p-2"
            >
              <span
                aria-hidden="true"
                className="text-[0.7rem] font-medium leading-none tracking-[0.01em] text-foreground-hard opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100"
              >
                Close
              </span>
              <kbd
                aria-hidden="true"
                className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border border-foreground-hard/35 font-sans text-[0.6rem] font-medium leading-none tracking-[0.04em] text-foreground-hard/75"
              >
                G
              </kbd>
            </button>
          </div>

          <p className="mt-1 text-[0.8rem] leading-[1.45] text-foreground-hard">
            Take what you need
          </p>
        </header>

        {giftShopSections.map((section) => (
          <section key={section.id} className="mt-8">
            {section.title && (
              <h3 className="px-3 text-[0.7rem] font-medium tracking-[0.01em] text-foreground-hard">
                {section.title}
              </h3>
            )}
            <ul className={section.title ? "mt-2 space-y-0.5" : "space-y-0.5"}>
              {section.items.map((item) => (
                <li key={item.id}>
                  <GiftShopRow item={item} />
                </li>
              ))}
            </ul>
          </section>
        ))}
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

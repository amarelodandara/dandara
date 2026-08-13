"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { giftShopSections } from "@/content/gift-shop";
import { GiftShopRow } from "./gift-shop-row";
import { GiftShopPlaque } from "./gift-shop-plaque";
import {
  closeOverlay,
  openOverlay,
  useActiveOverlay,
} from "@/lib/exclusive-overlay";
import { useKeydown } from "@/lib/keydown";

const ID = "gift-shop";

const Tailored =
  process.env.NODE_ENV === "development"
    ? dynamic(() => import("./gift-shop-tailored"))
    : null;

const SHORTCUT = "g";

const TYPING = "input, textarea, select, [contenteditable]";

export function GiftShop() {
  const [pastLanding, setPastLanding] = useState(false);

  const active = useActiveOverlay();
  const open = active === ID;

  const panelRef = useRef<HTMLElement>(null);
  const plaqueRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => closeOverlay(ID), []);
  const openShop = useCallback(() => openOverlay(ID), []);

  useEffect(() => {
    if (open) document.body.dataset.shopOpen = "";
    else delete document.body.dataset.shopOpen;
    return () => {
      delete document.body.dataset.shopOpen;
    };
  }, [open]);

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

  useKeydown((event) => {
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
  });

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
            <h2 className="text-[clamp(1.15rem,1.7vw,1.4rem)] leading-tight font-semibold tracking-[-0.01em]">
              Gift shop
            </h2>

            <button
              type="button"
              onClick={close}
              aria-label="Close gift shop"
              data-pressable
              className="group -m-2 flex shrink-0 items-center gap-1.5 rounded-lg p-2 transition-[background-color,scale] duration-150 ease-out-strong hover:bg-white/45 focus-visible:bg-white/45 active:scale-[0.97] active:duration-(--press)"
            >
              <span
                aria-hidden="true"
                className="text-[0.7rem] leading-none font-medium tracking-[0.01em] text-foreground-hard opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100"
              >
                Close
              </span>
              <kbd
                aria-hidden="true"
                className="inline-flex size-4 shrink-0 items-center justify-center rounded-sm border border-foreground-hard/35 font-sans text-[0.6rem] leading-none font-medium tracking-[0.04em] text-foreground-hard/75"
              >
                G
              </kbd>
            </button>
          </div>

          <p className="mt-1 text-[0.8rem] leading-[1.45] text-foreground-hard">
            Take what you need
          </p>
        </header>

        {Tailored ? <Tailored /> : null}

        {giftShopSections.map((section) => (
          <section key={section.id} className="mt-8">
            {section.title ? (
              <h3 className="px-3 text-[0.7rem] font-medium tracking-[0.01em] text-foreground-hard">
                {section.title}
              </h3>
            ) : null}
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

      <GiftShopPlaque
        ref={plaqueRef}
        visible={pastLanding && active === null}
        onOpen={openShop}
      />
    </>
  );
}

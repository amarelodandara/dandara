"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef } from "react";
import { giftShopSections } from "@/content/gift-shop";
import { GiftShopRow } from "./gift-shop-row";
import { GiftShopPlaque } from "./gift-shop-plaque";
import { Kbd } from "./kbd";
import {
  closeOverlay,
  openOverlay,
  useActiveOverlay,
} from "@/lib/exclusive-overlay";
import { useKeydown } from "@/lib/keydown";
import { usePastLanding } from "@/lib/past-landing";

const ID = "gift-shop";

const isBrowserChord = (event: KeyboardEvent) =>
  event.metaKey || event.ctrlKey || event.altKey;

const isTypingTarget = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  return /^(input|textarea|select)$/i.test(target.tagName);
};

const Tailored =
  process.env.NODE_ENV === "development"
    ? dynamic(() => import("./gift-shop-tailored"))
    : null;

export function GiftShop() {
  const active = useActiveOverlay();
  const open = active === ID;
  const pastLanding = usePastLanding();
  const plaqueVisible = active === null && pastLanding;

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

  useKeydown((event) => {
    if (event.key === "Escape") {
      closeOverlay(ID);
      return;
    }

    if (event.key !== "g" && event.key !== "G") return;
    if (isBrowserChord(event)) return;
    if (isTypingTarget(event.target)) return;

    if (open) {
      event.preventDefault();
      closeOverlay(ID);
      return;
    }

    const somethingElseHoldsTheScreen = active !== null;
    if (somethingElseHoldsTheScreen) return;

    event.preventDefault();
    openOverlay(ID);
  });

  const heldFocus = useRef(false);
  useEffect(() => {
    if (open) {
      panelRef.current?.focus();
      heldFocus.current = true;
    } else if (heldFocus.current) {
      if (plaqueVisible) plaqueRef.current?.focus();
      heldFocus.current = false;
    }
  }, [open, plaqueVisible]);

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
              aria-keyshortcuts="g Escape"
              data-pressable
              className="-m-2 flex shrink-0 items-center rounded-lg px-2.5 py-2 transition-[background-color,scale] duration-(--motion-quick) ease-out-strong hover:bg-white/45 focus-visible:bg-white/45 active:scale-[0.97] active:duration-(--press)"
            >
              <span className="text-[0.7rem] leading-none font-medium tracking-[0.01em] text-foreground-hard">
                Close
              </span>
              <span className="sr-only"> gift shop</span>
              <Kbd>G</Kbd>
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
        visible={plaqueVisible}
        onOpen={openShop}
      />
    </>
  );
}

"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef } from "react";
import { giftShopSections } from "@/content/gift-shop";
import { GiftShopNotes } from "./gift-shop-notes";
import { GiftShopRow } from "./gift-shop-row";
import { GiftShopPlaque } from "./gift-shop-plaque";
import { Kbd } from "./kbd";
import { forgetRequestedNote, useRequestedNote } from "@/lib/article-notes";
import {
  closeOverlay,
  openOverlay,
  SHOP_OVERLAY,
  useActiveOverlay,
} from "@/lib/exclusive-overlay";
import { useKeydown } from "@/lib/keydown";
import { usePastLanding } from "@/lib/past-landing";

const ID = SHOP_OVERLAY;

const isBrowserChord = (event: KeyboardEvent) =>
  event.metaKey || event.ctrlKey || event.altKey;

const isTypingTarget = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  return /^(input|textarea|select)$/i.test(target.tagName);
};

const FRAMES_WAITED_FOR_THE_PANEL = 30;

const onceThePanelIsVisible = (panel: HTMLElement | null, act: () => void) => {
  let abandoned = false;
  let framesLeft = FRAMES_WAITED_FOR_THE_PANEL;
  let frame = 0;

  const look = () => {
    if (abandoned || !panel) return;
    if (getComputedStyle(panel).visibility === "visible") {
      act();
      return;
    }
    framesLeft -= 1;
    if (framesLeft > 0) frame = requestAnimationFrame(look);
  };

  frame = requestAnimationFrame(look);
  return () => {
    abandoned = true;
    cancelAnimationFrame(frame);
  };
};

const focusIsStillInside = (panel: HTMLElement | null) => {
  const focused = document.activeElement;
  return (
    focused === null ||
    focused === document.body ||
    panel?.contains(focused) === true
  );
};

const focusTheRequestedRow = (panel: HTMLElement | null, n: number | null) => {
  const row =
    n === null
      ? null
      : panel?.querySelector<HTMLElement>(
          `[data-note-row="${CSS.escape(String(n))}"]`,
        );

  if (!row) {
    panel?.focus();
    return;
  }

  const held = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  row.scrollIntoView({ block: "nearest", behavior: held ? "auto" : "smooth" });
  row.focus({ preventScroll: true });
};

const focusThePageItself = () =>
  document
    .querySelector<HTMLElement>("[data-page]")
    ?.focus({ preventScroll: true });

const Tailored =
  process.env.NODE_ENV === "development"
    ? dynamic(() => import("./gift-shop-tailored"))
    : null;

export function GiftShop() {
  const active = useActiveOverlay();
  const open = active === ID;
  const requested = useRequestedNote();
  const readingANote = requested !== null;
  const pastLanding = usePastLanding();
  const plaqueVisible = active === null && pastLanding;

  const panelRef = useRef<HTMLElement>(null);
  const plaqueRef = useRef<HTMLButtonElement>(null);

  const focusBefore = useRef<HTMLElement | null>(null);
  const rememberFocus = useCallback(() => {
    const focused = document.activeElement;
    focusBefore.current =
      focused instanceof HTMLElement && focused !== document.body
        ? focused
        : null;
  }, []);

  const close = useCallback(() => closeOverlay(ID), []);
  const openShop = useCallback(() => {
    rememberFocus();
    openOverlay(ID);
  }, [rememberFocus]);

  useEffect(() => {
    const page = document.querySelector("[data-page]");
    const release = () => {
      delete document.body.dataset.shopOpen;
      page?.removeAttribute("inert");
    };

    if (!open) {
      release();
      return release;
    }

    document.body.dataset.shopOpen = "";
    if (readingANote) page?.removeAttribute("inert");
    else page?.setAttribute("inert", "");

    return release;
  }, [open, readingANote]);

  useEffect(() => {
    if (!open) forgetRequestedNote();
  }, [open]);

  useEffect(() => {
    if (readingANote) rememberFocus();
  }, [readingANote, requested, rememberFocus]);

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
    rememberFocus();
    openOverlay(ID);
  });

  const heldFocus = useRef(false);
  const cameFromTheText = useRef(false);
  useEffect(() => {
    if (open) {
      return onceThePanelIsVisible(panelRef.current, () => {
        focusTheRequestedRow(panelRef.current, requested);
        heldFocus.current =
          panelRef.current?.contains(document.activeElement) === true;
        cameFromTheText.current = requested !== null;
      });
    }

    if (!heldFocus.current) return;
    heldFocus.current = false;

    if (!focusIsStillInside(panelRef.current)) return;

    const wasReading = cameFromTheText.current;
    cameFromTheText.current = false;

    const marker =
      focusBefore.current?.isConnected === true ? focusBefore.current : null;
    const plaque = plaqueVisible ? plaqueRef.current : null;
    const next = wasReading ? (marker ?? plaque) : (plaque ?? marker);

    if (next) next.focus();
    else focusThePageItself();
  }, [open, plaqueVisible, requested]);

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
        <header className="flex items-start justify-between gap-3 px-3">
          <div className="flex flex-col gap-1">
            <h2 className="text-[clamp(1.15rem,1.7vw,1.4rem)] leading-tight font-semibold tracking-[-0.01em]">
              Gift shop
            </h2>
            <p className="text-[0.7rem] leading-tight text-foreground-hard">
              Take what you need
            </p>
          </div>

          <button
            type="button"
            onClick={close}
            aria-keyshortcuts="g Escape"
            data-pressable
            className="-mt-0.5 -mr-2 -mb-2 flex shrink-0 items-center rounded-lg bg-cutout px-2.5 py-2 transition-[background-color,scale] duration-(--motion-quick) ease-out-strong hover:bg-cutout-deep focus-visible:bg-cutout-deep active:scale-[0.97] active:duration-(--press)"
          >
            <span className="text-[0.7rem] leading-none font-medium tracking-[0.01em] text-foreground-soft">
              Close
            </span>
            <span className="sr-only"> gift shop</span>
            <Kbd>G</Kbd>
          </button>
        </header>

        <GiftShopNotes />

        {Tailored ? <Tailored /> : null}

        {giftShopSections.map((section) => (
          <section key={section.id} className={section.title ? "mt-8" : "mt-14"}>
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

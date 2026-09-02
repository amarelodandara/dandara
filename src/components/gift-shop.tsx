"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef } from "react";
import { GiftShopNotes } from "./gift-shop-notes";
import { GiftShopSign, shelfSeat, shopContents } from "./gift-shop-sign";
import { GiftShopRow } from "./gift-shop-row";
import { GiftShopPlaque } from "./gift-shop-plaque";
import {
  forgetRequestedNote,
  useArticle,
  useRequestedNote,
} from "@/lib/article-notes";
import { ANNOTATION } from "@/lib/type";
import { usePlaqueWanted } from "@/lib/plaque";
import {
  closeOverlay,
  openOverlay,
  SHOP_OVERLAY,
  useActiveOverlay,
} from "@/lib/exclusive-overlay";
import { useKeydown } from "@/lib/keydown";

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
  const article = useArticle();
  const plaqueWanted = usePlaqueWanted(article !== null);
  const plaqueVisible = active === null && plaqueWanted;
  const { sign, shelves } = shopContents(article);

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
    if (requested === null) page?.setAttribute("inert", "");
    else page?.removeAttribute("inert");

    return release;
  }, [open, requested]);

  useEffect(() => {
    if (!open) forgetRequestedNote();
  }, [open]);

  useEffect(() => {
    if (requested !== null) rememberFocus();
  }, [requested, rememberFocus]);

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

  const restoring = useRef({ held: false, fromTheText: false });
  useEffect(() => {
    if (open) {
      return onceThePanelIsVisible(panelRef.current, () => {
        focusTheRequestedRow(panelRef.current, requested);
        restoring.current = {
          held: panelRef.current?.contains(document.activeElement) === true,
          fromTheText: requested !== null,
        };
      });
    }

    const { held, fromTheText } = restoring.current;
    if (!held) return;
    restoring.current = { held: false, fromTheText: false };

    if (!focusIsStillInside(panelRef.current)) return;

    const marker =
      focusBefore.current?.isConnected === true ? focusBefore.current : null;
    const plaque = plaqueVisible ? plaqueRef.current : null;
    const next = fromTheText ? (marker ?? plaque) : (plaque ?? marker);

    if (next) next.focus();
    else focusThePageItself();
  }, [open, plaqueVisible, requested]);

  return (
    <>
      <aside
        ref={panelRef}
        aria-label={sign.name}
        tabIndex={-1}
        inert={!open || undefined}
        data-shop-panel
        className="flex flex-col px-5 py-8 outline-none"
      >
        <GiftShopSign sign={sign} onClose={close} />

        <GiftShopNotes titled={!article} />

        {Tailored && !article ? <Tailored /> : null}

        {shelves.map((section) => (
          <section key={section.id} className={shelfSeat(section, article)}>
            {section.title ? (
              <h3 className={`px-3 ${ANNOTATION} text-foreground-hard`}>
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
        label={article ? sign.name : "Visit the gift shop"}
        onOpen={openShop}
      />
    </>
  );
}

"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { type RefObject, useEffect, useRef } from "react";
import { GiftShopNotes } from "./gift-shop-notes";
import { GiftShopSign, shelfSeat, shopContents } from "./gift-shop-sign";
import { GiftShopRow } from "./gift-shop-row";
import { GiftShopPlaque } from "./gift-shop-plaque";
import { GiftShopEdge, useEdgePeek } from "./gift-shop-edge";
import { useFocusRestored, useRememberedFocus } from "./gift-shop-focus";
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
import { isBrowserChord, isTypingTarget, useKeydown } from "@/lib/keydown";

const ID = SHOP_OVERLAY;

const Tailored =
  process.env.NODE_ENV === "development"
    ? dynamic(() => import("./gift-shop-tailored"))
    : null;

const close = () => closeOverlay(ID);

const useClosedByLeaving = () => {
  const pathname = usePathname();
  const lastPathname = useRef(pathname);
  useEffect(() => {
    if (lastPathname.current === pathname) return;
    lastPathname.current = pathname;
    closeOverlay(ID, { quietly: true });
  }, [pathname]);
};

const Scrim = ({ shown }: { shown: boolean }) =>
  shown ? (
    <div
      aria-hidden
      data-shop-scrim
      className="fixed inset-0 z-30"
      onClick={close}
    />
  ) : null;

const usePageHeldAside = (open: boolean, requested: number | null) => {
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
};

const isShopKey = (event: KeyboardEvent) =>
  (event.key === "g" || event.key === "G") &&
  !isBrowserChord(event) &&
  !isTypingTarget(event.target);

const LETTERED_PAGES = new Set(["/links"]);

const useShopKeys = ({
  active,
  endPeek,
  lettered,
}: {
  active: string | null;
  endPeek: () => void;
  lettered: boolean;
}) => {
  useKeydown((event) => {
    if (event.key === "Escape") {
      endPeek();
      closeOverlay(ID);
      return;
    }

    if (lettered || !isShopKey(event)) return;

    if (active === ID) {
      event.preventDefault();
      closeOverlay(ID);
      return;
    }

    const somethingElseHoldsTheScreen = active !== null;
    if (somethingElseHoldsTheScreen) return;

    event.preventDefault();
    openOverlay(ID);
  });
};

type Contents = ReturnType<typeof shopContents>;

const Shelves = ({ shelves, full }: Pick<Contents, "shelves" | "full">) =>
  shelves.map((section) => (
    <section key={section.id} className={shelfSeat(section, full)}>
      {section.title ? (
        <h3 className={`px-3 ${ANNOTATION} text-cadmium-900`}>
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
  ));

const ShopPanel = ({
  ref,
  open,
  modal,
  titled,
  contents: { sign, shelves, full },
}: {
  ref: RefObject<HTMLDivElement | null>;
  open: boolean;
  modal: boolean;
  titled: boolean;
  contents: Contents;
}) => (
  <div
    ref={ref}
    role="dialog"
    aria-modal={modal || undefined}
    aria-label={sign.name}
    tabIndex={-1}
    inert={!open || undefined}
    data-shop-panel
    className="flex flex-col px-6 py-8 outline-none"
  >
    <GiftShopSign sign={sign} onClose={close} />

    <GiftShopNotes titled={titled} />

    {Tailored && full ? <Tailored /> : null}

    <Shelves shelves={shelves} full={full} />
  </div>
);

const openTheShop = () => openOverlay(ID);

export function GiftShop() {
  const active = useActiveOverlay();
  const open = active === ID;
  const requested = useRequestedNote();
  const article = useArticle();
  const pathname = usePathname();
  const contents = shopContents(article, pathname);
  const { peeking, endPeek } = useEdgePeek(active === null);
  const plaqueWanted = usePlaqueWanted(article !== null);
  const plaqueVisible = active === null && !peeking && plaqueWanted;
  const panelRef = useRef<HTMLDivElement>(null);
  const plaqueRef = useRef<HTMLButtonElement>(null);
  const focusBefore = useRememberedFocus(open, requested);

  useClosedByLeaving();
  usePageHeldAside(open, requested);
  useShopKeys({ active, endPeek, lettered: LETTERED_PAGES.has(pathname) });
  useFocusRestored({
    open,
    requested,
    panelRef,
    plaqueRef,
    plaqueVisible,
    focusBefore,
  });

  return (
    <>
      <Scrim shown={open && requested === null} />
      <ShopPanel
        ref={panelRef}
        open={open}
        modal={open && requested === null}
        titled={!article}
        contents={contents}
      />
      <GiftShopEdge peeking={peeking} onOpen={openTheShop} />
      <GiftShopPlaque
        ref={plaqueRef}
        visible={plaqueVisible}
        label={article ? contents.sign.name : "Visit the gift shop"}
        onOpen={openTheShop}
      />
    </>
  );
}

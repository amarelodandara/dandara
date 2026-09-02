"use client";

import { amareloSection, giftShopSections } from "@/content/gift-shop";
import type { GiftShopSection } from "@/content/gift-shop";
import type { Article } from "@/lib/article-notes";
import { Kbd } from "./kbd";
import { ANNOTATION, PROSE, SECTION_HEADING } from "@/lib/type";

export type Sign = { name: string; blurb: string; closes: string };

const SHOP_SIGN: Sign = {
  name: "Gift shop",
  blurb: "Take what you need",
  closes: " gift shop",
};

export const shopContents = (article: Article | null) =>
  article
    ? {
        sign: {
          name: "References",
          blurb: `Footnotes of ${article.title}`,
          closes: " references",
        },
        shelves: [amareloSection],
      }
    : { sign: SHOP_SIGN, shelves: giftShopSections };

export const shelfSeat = (
  section: GiftShopSection,
  article: Article | null,
) => {
  if (section.title) return "mt-8";
  return article ? "mt-auto pt-14" : "mt-14";
};

export function GiftShopSign({
  sign,
  onClose,
}: {
  sign: Sign;
  onClose: () => void;
}) {
  return (
    <header data-paper data-perforated className="-mx-5 -mt-8 bg-shop-band">
      <div
        data-perforated
        className="flex items-center justify-between gap-3 px-8 pt-7 pb-6"
      >
        <h2 className={`min-w-0 ${SECTION_HEADING}`}>{sign.name}</h2>

        <button
          type="button"
          onClick={onClose}
          aria-keyshortcuts="g Escape"
          data-pressable
          className="-mr-3 flex shrink-0 items-center rounded-lg bg-background px-2.5 py-2 shadow-cutout transition-[background-color,scale] duration-(--motion-quick) ease-out-strong hover:bg-cutout focus-visible:bg-cutout active:scale-[0.97] active:duration-(--press)"
        >
          <span className={`${ANNOTATION} leading-none text-foreground-soft`}>
            Close
          </span>
          <span className="sr-only">{sign.closes}</span>
          <Kbd>G</Kbd>
        </button>
      </div>

      <p className={`px-8 py-3 ${PROSE} text-foreground-hard`}>{sign.blurb}</p>
    </header>
  );
}

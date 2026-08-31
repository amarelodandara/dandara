"use client";

import { amareloSection, giftShopSections } from "@/content/gift-shop";
import type { GiftShopSection } from "@/content/gift-shop";
import type { Article } from "@/lib/article-notes";
import { Kbd } from "./kbd";

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
    <header className="px-3">
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-[clamp(1.15rem,1.7vw,1.4rem)] leading-tight font-semibold tracking-[-0.01em]">
          {sign.name}
        </h2>

        <button
          type="button"
          onClick={onClose}
          aria-keyshortcuts="g Escape"
          data-pressable
          className="-mt-0.5 -mr-2 -mb-2 flex shrink-0 items-center rounded-lg bg-cutout px-2.5 py-2 transition-[background-color,scale] duration-(--motion-quick) ease-out-strong hover:bg-cutout-deep focus-visible:bg-cutout-deep active:scale-[0.97] active:duration-(--press)"
        >
          <span className="text-[0.7rem] leading-none font-medium tracking-[0.01em] text-foreground-soft">
            Close
          </span>
          <span className="sr-only">{sign.closes}</span>
          <Kbd>G</Kbd>
        </button>
      </div>

      <p className="mt-4 text-[0.9rem] leading-snug text-foreground-hard">
        {sign.blurb}
      </p>
    </header>
  );
}

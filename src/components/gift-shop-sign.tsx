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
    // The header runs the full width of the panel: negative margins cancel the
    // aside's padding and put it back inside, so it sits on the panel's own
    // yellow edge to edge rather than in a column with the shelves below it.
    //
    // px-8 is the aside's px-5 plus the px-3 every shelf heading and row adds
    // on top of it, which is where the content edge actually is. Matching the
    // aside alone would have left the header a notch to the left of everything
    // under it.
    <header data-paper data-perforated className="-mx-5 -mt-8 bg-shop-band">
      <div
        data-perforated
        className="flex items-center justify-between gap-3 px-8 pt-7 pb-6"
      >
        <h2 className="min-w-0 text-[clamp(1.15rem,1.7vw,1.4rem)] leading-tight font-semibold tracking-[-0.01em] text-balance">
          {sign.name}
        </h2>

        <button
          type="button"
          onClick={onClose}
          aria-keyshortcuts="g Escape"
          data-pressable
          className="-mr-3 flex shrink-0 items-center rounded-lg bg-background px-2.5 py-2 shadow-cutout transition-[background-color,scale] duration-(--motion-quick) ease-out-strong hover:bg-cutout focus-visible:bg-cutout active:scale-[0.97] active:duration-(--press)"
        >
          <span className="text-[0.7rem] leading-none font-medium tracking-[0.01em] text-foreground-soft">
            Close
          </span>
          <span className="sr-only">{sign.closes}</span>
          <Kbd>G</Kbd>
        </button>
      </div>

      <p className="px-8 py-3 text-[0.9rem] leading-snug text-foreground-hard">
        {sign.blurb}
      </p>
    </header>
  );
}

"use client";

import { useEffect, useState } from "react";
import type { GiftShopItem } from "@/content/gift-shop";
import { GiftShopRow } from "./gift-shop-row";

const MANIFEST = "/gift-shop/tailored/manifest.json";

/** Only the fields the shop needs; the sidecar carries more. */
type TailoredItem = {
  id: string;
  title: string;
  meta: string;
  href: string;
  download: string;
};

/**
 * The shelf of résumés written for a particular job posting.
 *
 * These are generated locally by `npm run cv:pdf`, land in a git-ignored
 * folder, and are read back from a manifest the generator rewrites each run.
 * Nothing about them is committed, which is also what keeps them off the
 * deployed site: there is no file there for this to find.
 *
 * Rendered through the same row as everything else in the shop, so a tailored
 * CV is taken away exactly like the permanent one.
 */
export default function GiftShopTailored() {
  const [items, setItems] = useState<TailoredItem[]>([]);

  useEffect(() => {
    let live = true;

    // `no-store` because the manifest changes underneath a running dev server
    // every time a CV is generated, and a cached one would hide the new file.
    fetch(MANIFEST, { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (live && Array.isArray(data?.items)) setItems(data.items);
      })
      // Nothing generated yet is the ordinary case, not a fault worth saying
      // anything about.
      .catch(() => {});

    return () => {
      live = false;
    };
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="mt-8">
      <h3 className="px-3 text-[0.7rem] font-medium tracking-[0.01em] text-foreground-hard">
        Tailored — local only
      </h3>
      <ul className="mt-2 space-y-0.5">
        {items.map((item) => (
          <li key={item.id}>
            <GiftShopRow item={{ kind: "file", ...item } satisfies GiftShopItem} />
          </li>
        ))}
      </ul>
    </section>
  );
}

"use client";

import { useEffect, useState } from "react";
import type { GiftShopItem } from "@/content/gift-shop";
import { GiftShopRow } from "./gift-shop-row";

const MANIFEST = "/gift-shop/tailored/manifest.json";

type TailoredItem = {
  id: string;
  title: string;
  meta: string;
  href: string;
  download: string;
};

export default function GiftShopTailored() {
  const [items, setItems] = useState<TailoredItem[]>([]);

  useEffect(() => {
    let live = true;

    fetch(MANIFEST, { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (live && Array.isArray(data?.items)) setItems(data.items);
      })
      .catch(() => {});

    return () => {
      live = false;
    };
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="mt-8">
      <ul className="space-y-0.5">
        {items.map((item) => (
          <li key={item.id}>
            <GiftShopRow
              item={
                {
                  kind: "file",
                  ...item,
                } satisfies GiftShopItem
              }
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

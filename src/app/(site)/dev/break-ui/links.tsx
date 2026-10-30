"use client";

import { useState } from "react";
import type { Ref } from "@/links/export";
import { fileKey } from "@/links/keys";
import { Selection } from "@/links/selection";
import { Sheet } from "@/links/sheet";
import { Visit } from "@/links/visit";
import type { RolodexSheet } from "./links-fixtures";

export function Sheets({ sheets }: { sheets: RolodexSheet[] }) {
  const [picked, setPicked] = useState(
    () =>
      new Set(sheets.filter((one) => one.picked).map((one) => one.link.slug)),
  );

  const toggle = (slug: string) =>
    setPicked((current) => {
      const next = new Set(current);
      if (!next.delete(slug)) next.add(slug);
      return next;
    });

  return (
    <ul className="flex flex-wrap gap-x-8 gap-y-12">
      {sheets.map(({ link }, index) => (
        <li key={link.slug} className="w-[86vw] sm:w-[min(24rem,76vw)]">
          <Sheet
            link={link}
            index={index}
            letter={fileKey(link.title).charAt(0)}
            picked={picked.has(link.slug)}
            onPick={() => toggle(link.slug)}
            corner={link.url ? <Visit link={link} /> : null}
          >
            {link.url ? (
              <div className="relative -mx-2 mt-2 flex max-sm:hidden">
                <Visit link={link} />
              </div>
            ) : null}
          </Sheet>
        </li>
      ))}
    </ul>
  );
}

export function Picked({ refs }: { refs: Ref[] }) {
  return <Selection refs={refs} all={false} rushing={false} />;
}

"use client";

import { Avatar } from "@base-ui/react/avatar";
import { Switch } from "@base-ui/react/switch";
import { useState } from "react";
import { ANNOTATION, TITLE } from "@/lib/type";
import type { Palette } from "@/lib/writing/palettes";

export function PaletteUiWidget({ palette }: { palette: Palette }) {
  const [on, setOn] = useState(true);
  const { ink, paper, common, ptName, accents } = palette;
  const track = on ? accents[0] : "transparent";

  return (
    <div
      className="flex w-full items-center gap-3 rounded-md p-4"
      style={{ background: paper, color: ink }}
    >
      <Avatar.Root className="size-11 shrink-0 overflow-hidden rounded-full">
        <Avatar.Fallback
          className="block size-full"
          style={{
            backgroundImage: `linear-gradient(135deg, ${accents[0]}, ${
              accents[1] ?? ink
            })`,
          }}
        />
      </Avatar.Root>

      <div className="min-w-0 flex-1">
        <p className={`${TITLE} truncate`}>{common}</p>
        <p className={`${ANNOTATION} truncate opacity-60`}>{ptName}</p>
      </div>

      <Switch.Root
        checked={on}
        onCheckedChange={setOn}
        className="relative inline-flex h-5 w-8 shrink-0 items-center rounded-full transition-colors duration-(--motion-quick)"
        style={{ background: track, border: `1px solid ${ink}` }}
      >
        <Switch.Thumb
          className="block size-3.5 rounded-full transition-transform duration-(--motion-quick)"
          style={{
            background: on ? paper : ink,
            transform: on ? "translateX(0.85rem)" : "translateX(0.15rem)",
          }}
        />
      </Switch.Root>
    </div>
  );
}

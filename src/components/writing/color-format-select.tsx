"use client";

import { Select } from "@base-ui/react/select";
import { LABEL, MICRO, PROSE } from "@/lib/type";
import {
  COLOR_FORMATS,
  FORMAT_LABELS,
  type ColorFormat,
} from "@/lib/writing/color-format";
import {
  setColorFormat,
  useColorFormat,
} from "@/lib/writing/color-format-store";

const ITEMS = COLOR_FORMATS.map((value) => ({
  value,
  label: FORMAT_LABELS[value],
}));

const TRIGGER = [
  `group inline-flex items-center gap-1 rounded-[0.25rem] px-1 py-0.5 ${PROSE}`,
  "border border-foreground/25 text-foreground",
  "transition-[background-color,border-color,color] duration-(--motion-quick) ease-out-strong",
  "can-hover:hover:border-sun-ink/70 can-hover:hover:bg-sun-core/15",
  "can-hover:hover:text-sun-ink",
  "focus-visible:border-sun-ink/70 focus-visible:text-sun-ink",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/40",
  "data-popup-open:border-sun-ink/70 data-popup-open:bg-sun-core/15 data-popup-open:text-sun-ink",
  "active:duration-(--press)",
].join(" ");

const POPUP = [
  "min-w-(--anchor-width) origin-(--transform-origin) rounded-lg bg-background p-1",
  "shadow-raised outline-none",
  "transition-[opacity,scale] duration-(--motion-quick) ease-out-strong",
  "data-starting-style:scale-[0.97] data-starting-style:opacity-0",
  "data-ending-style:scale-[0.97] data-ending-style:opacity-0",
  "motion-reduce:transition-none",
].join(" ");

const ITEM = [
  `grid grid-cols-[1rem_1fr] items-center gap-1.5 rounded-md px-2 py-1.5 ${LABEL}`,
  "cursor-default text-foreground-soft outline-none select-none",
  "transition-[background-color,color] duration-(--motion-quick) ease-out-strong",
  "data-highlighted:bg-sun-core/15 data-highlighted:text-sun-ink",
].join(" ");

function Caret() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="shrink-0"
    >
      <path d="M4 6.5 8 10.5l4-4" />
    </svg>
  );
}

export function ColorFormatSelect() {
  const format = useColorFormat();

  return (
    <Select.Root
      items={ITEMS}
      value={format}
      onValueChange={(next: ColorFormat | null) => {
        if (next) setColorFormat(next);
      }}
    >
      <Select.Trigger aria-label="Copy colors as" className={TRIGGER}>
        <Select.Value />
        <Select.Icon>
          <Caret />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Positioner sideOffset={6} className="z-20 outline-none">
          <Select.Popup className={POPUP}>
            <Select.List>
              {ITEMS.map((item) => (
                <Select.Item
                  key={item.value}
                  value={item.value}
                  className={ITEM}
                >
                  <Select.ItemIndicator
                    className={`${MICRO} col-start-1 text-foreground-soft transition-[color] duration-(--motion-quick) ease-out-strong group-data-highlighted/item:text-sun-ink`}
                  >
                    ✓
                  </Select.ItemIndicator>
                  <Select.ItemText className="col-start-2">
                    {item.label}
                  </Select.ItemText>
                </Select.Item>
              ))}
            </Select.List>
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  );
}

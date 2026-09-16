"use client";

import { useSyncExternalStore } from "react";
import type { Swatch } from "./palettes";

export type ColorFormat = keyof Pick<
  Swatch,
  "oklch" | "hex" | "hsl" | "variables"
>;

export const COLOR_FORMATS: ColorFormat[] = [
  "oklch",
  "hex",
  "hsl",
  "variables",
];

export const FORMAT_LABELS: Record<ColorFormat, string> = {
  oklch: "oklch",
  hex: "hex",
  hsl: "hsl",
  variables: "css",
};

const DEFAULT: ColorFormat = "oklch";

let current: ColorFormat = DEFAULT;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function setColorFormat(next: ColorFormat) {
  current = next;
  for (const listener of listeners) listener();
}

export function useColorFormat(): ColorFormat {
  return useSyncExternalStore(
    subscribe,
    () => current,
    () => DEFAULT,
  );
}

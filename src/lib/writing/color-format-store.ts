"use client";

import { useSyncExternalStore } from "react";
import type { ColorFormat } from "./color-format";

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

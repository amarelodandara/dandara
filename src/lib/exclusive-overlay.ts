import { useSyncExternalStore } from "react";
import { play } from "cuelume";

export const SHOP_OVERLAY = "gift-shop";

let active: string | null = null;
const listeners = new Set<() => void>();

const emit = () => { for (const listener of listeners) listener() };

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export function openOverlay(id: string) {
  if (active === id) return;
  active = id;
  emit();
  play("open", { emphasis: "subtle" });
}

export function closeOverlay(id: string, { quietly = false } = {}) {
  if (active !== id) return;
  active = null;
  emit();
  if (!quietly) play("close");
}

export function useActiveOverlay() {
  return useSyncExternalStore(
    subscribe,
    () => active,
    () => null,
  );
}

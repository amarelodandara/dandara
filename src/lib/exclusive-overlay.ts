import { useSyncExternalStore } from "react";

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
}

export function closeOverlay(id: string) {
  if (active !== id) return;
  active = null;
  emit();
}

export function useActiveOverlay() {
  return useSyncExternalStore(
    subscribe,
    () => active,
    () => null,
  );
}

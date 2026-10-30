import { useSyncExternalStore } from "react";

const listeners = new Set<() => void>();
let total = 0;

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export function shelve(count: number) {
  total = count;
  for (const listener of listeners) listener();
}

export const useTotal = () =>
  useSyncExternalStore(
    subscribe,
    () => total,
    () => 0,
  );

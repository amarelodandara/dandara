import { useSyncExternalStore } from "react";

const lists = new Map<string, MediaQueryList>();

const list = (query: string) => {
  let found = lists.get(query);
  if (!found) {
    found = window.matchMedia(query);
    lists.set(query, found);
  }
  return found;
};

export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const current = list(query);
      current.addEventListener("change", onChange);
      return () => current.removeEventListener("change", onChange);
    },
    () => list(query).matches,
    () => false,
  );
}

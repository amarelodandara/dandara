import { useSyncExternalStore } from "react";

/**
 * At most one overlay owns the screen at a time.
 *
 * This is not a preference. The gift shop slides the whole page plane sideways,
 * and a transform makes that element the containing block for every
 * `position: fixed` descendant — which the work pile's focused sheet is. Open
 * both and the sheet silently re-anchors to the page instead of the viewport.
 *
 * Holding the single active id here rather than firing eviction events means
 * every consumer can also *read* it: the gift shop plaque hides while anything
 * is open, which it must, since the page plane's stacking context traps the
 * focused sheet below any sibling of the plane.
 */
let active: string | null = null;
const listeners = new Set<() => void>();

const emit = () => listeners.forEach((listener) => listener());

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

/** The id of whatever currently owns the screen, or null. */
export function useActiveOverlay() {
  return useSyncExternalStore(
    subscribe,
    () => active,
    () => null,
  );
}

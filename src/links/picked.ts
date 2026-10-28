import { useSyncExternalStore } from "react";
import type { Ref } from "./export";

const KEY = "links";
const NONE: Ref[] = [];

const listeners = new Set<() => void>();
let picked: Ref[] | null = null;

const isRef = (value: unknown): value is Ref =>
  typeof value === "object" &&
  value !== null &&
  typeof (value as Ref).slug === "string" &&
  typeof (value as Ref).title === "string";

const stored = () => {
  try {
    const parsed: unknown = JSON.parse(
      window.localStorage.getItem(KEY) ?? "[]",
    );
    return Array.isArray(parsed)
      ? parsed.filter((value) => isRef(value))
      : NONE;
  } catch {
    return NONE;
  }
};

const current = () => {
  picked ??= stored();
  return picked;
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  const fromAnotherTab = (event: StorageEvent) => {
    if (event.key !== KEY) return;
    picked = stored();
    listener();
  };
  window.addEventListener("storage", fromAnotherTab);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", fromAnotherTab);
  };
};

const save = (next: Ref[]) => {
  picked = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {}
  for (const listener of listeners) listener();
};

export const pick = ({ slug, title, url, tag, by }: Ref) => {
  const rest = current().filter((ref) => ref.slug !== slug);
  save([...rest, { slug, title, url, tag, by }]);
};

export const pickOnly = (refs: Ref[]) =>
  save(
    refs.map(({ slug, title, url, tag, by }) => ({
      slug,
      title,
      url,
      tag,
      by,
    })),
  );

const BEFORE_KEY = "links:before";

export const keepBefore = (refs: Ref[] | null) => {
  try {
    if (refs) window.localStorage.setItem(BEFORE_KEY, JSON.stringify(refs));
    else window.localStorage.removeItem(BEFORE_KEY);
  } catch {}
};

export const takeBefore = () => {
  try {
    const parsed: unknown = JSON.parse(
      window.localStorage.getItem(BEFORE_KEY) ?? "[]",
    );
    window.localStorage.removeItem(BEFORE_KEY);
    return Array.isArray(parsed)
      ? parsed.filter((value) => isRef(value))
      : NONE;
  } catch {
    return NONE;
  }
};

export const unpick = (slug: string) =>
  save(current().filter((ref) => ref.slug !== slug));

export function usePicked() {
  return useSyncExternalStore(subscribe, current, () => NONE);
}

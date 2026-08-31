import { useSyncExternalStore } from "react";

export type ArticleNote = {
  n: number;
  title: string;
  href?: string;
  body?: string;
};

const NONE: ArticleNote[] = [];

let notes: ArticleNote[] = NONE;
let requested: number | null = null;

const listeners = new Set<() => void>();

const emit = () => {
  for (const listener of listeners) listener();
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export function publishArticleNotes(next: ArticleNote[]) {
  notes = next;
  emit();
}

export function withdrawArticleNotes() {
  notes = NONE;
  requested = null;
  emit();
}

export function requestNote(n: number) {
  if (requested === n) return;
  requested = n;
  emit();
}

export function forgetRequestedNote() {
  if (requested === null) return;
  requested = null;
  emit();
}

export function useArticleNotes() {
  return useSyncExternalStore(
    subscribe,
    () => notes,
    () => NONE,
  );
}

export function useRequestedNote() {
  return useSyncExternalStore(
    subscribe,
    () => requested,
    () => null,
  );
}

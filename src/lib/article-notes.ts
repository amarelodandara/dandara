import { useSyncExternalStore } from "react";

export type ArticleNote = {
  n: number;
  title: string;
  href?: string;
  body?: string;
};

export type Article = {
  title: string;
  notes: ArticleNote[];
};

const NONE: ArticleNote[] = [];

let article: Article | null = null;
let requested: number | null = null;

let asked = false;

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

export function publishArticle(next: Article) {
  article = next;
  emit();
}

export function withdrawArticle() {
  article = null;
  requested = null;
  asked = false;
  emit();
}

export function requestNote(n: number) {
  asked = true;
  if (requested === n) return;
  requested = n;
  emit();
}

export function forgetRequestedNote() {
  if (requested === null) return;
  requested = null;
  emit();
}

export function useArticle() {
  return useSyncExternalStore(
    subscribe,
    () => article,
    () => null,
  );
}

export function useArticleNotes() {
  return useSyncExternalStore(
    subscribe,
    () => article?.notes ?? NONE,
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

export function useNoteEverRequested() {
  return useSyncExternalStore(
    subscribe,
    () => asked,
    () => false,
  );
}

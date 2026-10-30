import { useEffect, useEffectEvent } from "react";

type Handler = (event: KeyboardEvent) => void;

export const isBrowserChord = (event: KeyboardEvent) =>
  event.metaKey || event.ctrlKey || event.altKey;

export const isTypingTarget = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  return /^(input|textarea|select)$/i.test(target.tagName);
};

const handlers = new Set<Handler>();
let listening = false;

const fanOut = (event: KeyboardEvent) => {
  for (const handler of handlers) handler(event);
};

export function useKeydown(handler: Handler) {
  const latest = useEffectEvent(handler);

  useEffect(() => {
    const subscriber: Handler = (event) => latest(event);
    handlers.add(subscriber);

    if (!listening) {
      window.addEventListener("keydown", fanOut);
      listening = true;
    }

    return () => {
      handlers.delete(subscriber);
      if (listening && handlers.size === 0) {
        window.removeEventListener("keydown", fanOut);
        listening = false;
      }
    };
  }, []);
}

import { useSyncExternalStore } from "react";
import { play, setEnabled, unlock } from "cuelume";

const KEY = "sound";

const listeners = new Set<() => void>();
let on: boolean | null = null;

const stored = () => {
  try {
    return window.localStorage.getItem(KEY) !== "off";
  } catch {
    return true;
  }
};

const current = () => {
  if (on === null) {
    on = stored();
    setEnabled(on);
  }
  return on;
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export function turnSound(next: boolean) {
  on = next;
  setEnabled(next);
  try {
    window.localStorage.setItem(KEY, next ? "on" : "off");
  } catch {}
  for (const listener of listeners) listener();
  if (next) {
    void unlock().then((ready) => {
      if (ready) play("toggle");
    });
  }
}

export function useSound() {
  return useSyncExternalStore(subscribe, current, () => true);
}

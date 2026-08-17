import { useSyncExternalStore } from "react";

let scrolledPast = false;

const subscribe = (onChange: () => void) => {
  const landing = document.querySelector("[data-landing]");

  if (!landing) {
    scrolledPast = true;
    onChange();
    return () => {};
  }

  const observer = new IntersectionObserver(
    ([entry]) => {
      scrolledPast = !entry.isIntersecting;
      onChange();
    },
    { threshold: 0 },
  );

  observer.observe(landing);
  return () => observer.disconnect();
};

export function usePastLanding() {
  return useSyncExternalStore(
    subscribe,
    () => scrolledPast,
    () => false,
  );
}

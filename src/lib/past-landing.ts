import { useSyncExternalStore } from "react";

let scrolledPast = false;

const subscribe = (onChange: () => void) => {
  let watched: Element | null = null;
  let intersection: IntersectionObserver | null = null;

  const retarget = () => {
    const landing = document.querySelector("[data-landing]");
    if (landing === watched) return;

    watched = landing;
    intersection?.disconnect();
    intersection = null;

    if (!landing) {
      scrolledPast = true;
      onChange();
      return;
    }

    intersection = new IntersectionObserver(
      ([entry]) => {
        scrolledPast = !entry.isIntersecting;
        onChange();
      },
      { threshold: 0 },
    );

    intersection.observe(landing);
  };

  retarget();

  const replacements = new MutationObserver(retarget);
  replacements.observe(document.body, { childList: true, subtree: true });

  return () => {
    replacements.disconnect();
    intersection?.disconnect();
  };
};

export function usePastLanding() {
  return useSyncExternalStore(
    subscribe,
    () => scrolledPast,
    () => false,
  );
}

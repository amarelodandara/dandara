import { useSyncExternalStore } from "react";

let arrived = false;

const subscribe = (onChange: () => void) => {
  let watched: Element | null = null;
  let intersection: IntersectionObserver | null = null;

  const retarget = () => {
    const end = document.querySelector("[data-article-end]");
    if (end === watched) return;

    watched = end;
    intersection?.disconnect();
    intersection = null;

    if (!end) {
      arrived = false;
      onChange();
      return;
    }

    intersection = new IntersectionObserver(
      ([entry]) => {
        arrived = entry.isIntersecting;
        onChange();
      },
      { threshold: 0 },
    );

    intersection.observe(end);
  };

  retarget();

  const replacements = new MutationObserver(retarget);
  replacements.observe(document.body, { childList: true, subtree: true });

  return () => {
    replacements.disconnect();
    intersection?.disconnect();
  };
};

export function useAtArticleEnd() {
  return useSyncExternalStore(
    subscribe,
    () => arrived,
    () => false,
  );
}

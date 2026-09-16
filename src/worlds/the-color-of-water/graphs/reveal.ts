import { useEffect, useRef, useState } from "react";

const HALF_IN_VIEW = 0.5;

type Phase = "resting" | "waiting" | "revealed";

export function useReveal<T extends Element>(reduce: boolean | null) {
  const ref = useRef<T>(null);
  const [phase, setPhase] = useState<Phase>("resting");

  useEffect(() => {
    const node = ref.current;
    if (!node || reduce) return;

    let first = true;
    const watcher = new IntersectionObserver(
      ([entry]) => {
        const seen = entry.intersectionRatio >= HALF_IN_VIEW;
        const firstReport = first;
        first = false;

        if (seen) {
          watcher.disconnect();
          if (!firstReport) setPhase("revealed");
          return;
        }
        if (firstReport) setPhase("waiting");
      },
      { threshold: HALF_IN_VIEW },
    );

    watcher.observe(node);
    return () => watcher.disconnect();
  }, [reduce]);

  return [ref, phase === "waiting" ? "hidden" : "show"] as const;
}

import type { Transition, Variants } from "motion/react";

export const easeOutCubic = [0.215, 0.61, 0.355, 1] as const;

export function graphTransition(
  reduce: boolean | null,
  extras?: Transition,
): Transition {
  if (reduce) return { duration: 0 };
  return { duration: 0.22, ease: easeOutCubic, ...extras };
}

export function fadeUp(reduce: boolean | null): Variants {
  if (reduce) {
    return {
      hidden: { opacity: 1, transform: "translateY(0px)" },
      show: { opacity: 1, transform: "translateY(0px)" },
    };
  }

  return {
    hidden: { opacity: 0, transform: "translateY(8px)" },
    show: {
      opacity: 1,
      transform: "translateY(0px)",
      transition: graphTransition(false),
    },
  };
}

export function staggerList(reduce: boolean | null, stagger = 0.08): Variants {
  return {
    hidden: {},
    show: {
      transition: reduce ? { duration: 0 } : { staggerChildren: stagger },
    },
  };
}

export type GraphPalette = "mono" | "duo" | "multi";

export function isMonoPalette(palette?: GraphPalette) {
  return palette === undefined || palette === "mono";
}

export function toneClass(
  palette: GraphPalette | undefined,
  role: "primary" | "secondary" | "idle" | "empty",
) {
  if (role === "empty") return "text-graph-frame";
  if (role === "idle") return "text-graph-muted";
  if (role === "primary") return "text-graph-accent";
  return isMonoPalette(palette) ? "text-graph-muted" : "text-graph-accent-2";
}

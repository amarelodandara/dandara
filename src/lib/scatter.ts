import type { SheetSize } from "@/components/sheet";

/** Change this one number to re-roll the entire composition. */
export const SCATTER_SEED = 20260812;

export type Placement = {
  /** Horizontal centre of the sheet, as a percentage of the canvas. */
  xPct: number;
  /** Top edge of the sheet, as a percentage of the canvas. */
  yPct: number;
  rotate: number;
  z: number;
};

/** Horizontal centre is clamped per size tier so a sheet never reaches the edge. */
const X_RANGE: Record<SheetSize, readonly [number, number]> = {
  narrow: [16, 84],
  wide: [24, 76],
};

/** Sheets are anchored by their top edge and grow downward, so this stays high. */
const Y_RANGE: readonly [number, number] = [2, 52];

const MAX_TILT = 3.5;

/** mulberry32 — small, fast, and identical on the server and in the browser. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const round = (n: number) => Math.round(n * 100) / 100;
const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

const lerp = (range: readonly [number, number], t: number) =>
  range[0] + t * (range[1] - range[0]);

/**
 * Lays sheets out on a loose jittered grid: every sheet gets a cell, then wanders
 * inside it. Guarantees overlap without letting two sheets land on top of each
 * other. Deterministic for a given seed, so the server and client agree.
 */
export function scatter(
  items: readonly { id: string; size: SheetSize }[],
  seed: number = SCATTER_SEED,
): Record<string, Placement> {
  const rand = mulberry32(seed);
  const count = items.length;
  const cols = Math.min(3, Math.max(1, count));
  const rows = Math.max(1, Math.ceil(count / cols));

  const placements = items.map((item, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);

    const fx = clamp01((col + 0.5) / cols + (rand() * 2 - 1) * (0.42 / cols));
    const fy = clamp01((row + 0.5) / rows + (rand() * 2 - 1) * (0.45 / rows));

    return {
      xPct: round(lerp(X_RANGE[item.size], fx)),
      yPct: round(lerp(Y_RANGE, fy)),
      rotate: round((rand() * 2 - 1) * MAX_TILT),
      z: 0,
    } satisfies Placement;
  });

  // Shuffle the paint order so a professional sheet can sit on top of a personal one.
  const order = items.map((_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  order.forEach((itemIndex, rank) => {
    placements[itemIndex].z = rank + 1;
  });

  return Object.fromEntries(items.map((item, i) => [item.id, placements[i]]));
}

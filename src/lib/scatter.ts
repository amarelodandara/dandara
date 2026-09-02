import type { SheetKind, SheetSize } from "@/components/sheet";

export const SCATTER_SEED = 20_260_812;

export type Placement = {
  xPct: number;
  yPct: number;
  rotate: number;
  z: number;
};

const X_RANGE: Record<SheetSize, readonly [number, number]> = {
  narrow: [16, 84],
  wide: [24, 76],
  feature: [36, 64],
};

const Y_RANGE: readonly [number, number] = [2, 52];

const MAX_TILT = 3.5;

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6D_2B_79_F5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4_294_967_296;
  };
}

const round = (n: number) => Math.round(n * 100) / 100;
const clamp01 = (n: number) => (n < 0 ? 0 : (Math.min(n, 1)));

const lerp = (range: readonly [number, number], t: number) =>
  range[0] + t * (range[1] - range[0]);

export function scatter(
  items: readonly { id: string; size: SheetSize; kind: SheetKind }[],
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

  for (let row = 0; row < rows; row++) {
    const inRow = [];
    for (let i = row * cols; i < Math.min((row + 1) * cols, count); i++) {
      inRow.push(i);
    }
    const heights = inRow
      .map((i) => placements[i].yPct)
      .toSorted((a, b) => a - b);
    for (const [rank, i] of inRow.entries()) placements[i].yPct = heights[rank];
  }

  const order = items.map((_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  order.sort(
    (a, b) =>
      Number(items[a].kind === "professional") -
      Number(items[b].kind === "professional"),
  );
  for (const [rank, itemIndex] of order.entries()) {
    placements[itemIndex].z = rank + 1;
  }

  return Object.fromEntries(items.map((item, i) => [item.id, placements[i]]));
}

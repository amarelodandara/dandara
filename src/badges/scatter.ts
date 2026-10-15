import { hash, seeded } from "./seeded.ts";
import { LOOK, type Badge } from "./shape.ts";

export const STICKERS = {
  count: 7,
  scale: 0.9,
  tiltDegrees: 25,
  apart: 0.75,
  shuffle: 2_654_435_761,
  tries: 40,
  breathStepMs: 700,
  deepestLobe: 1.16,
} as const;

export type Sticker = { x: number; y: number; tilt: number; ms: number };

type Spot = { x: number; y: number };

export function scatter(
  slug: string,
  {
    badge,
    width,
    height,
    overhang,
    count = STICKERS.count,
    padding = 0,
  }: {
    badge: Badge;
    width: number;
    height: number;
    overhang: number;
    count?: number;
    padding?: number;
  },
): Sticker[] {
  const radius =
    STICKERS.scale *
    (LOOK.box / 2 - LOOK.margin) *
    badge.scale *
    STICKERS.deepestLobe;
  const hang = radius * overhang - padding;
  const apart = 2 * radius * STICKERS.apart;
  const next = seeded(hash(slug) ^ STICKERS.shuffle);
  const placed: Spot[] = [];
  const nearest = (spot: Spot) =>
    Math.min(
      Infinity,
      ...placed.map((other) => Math.hypot(other.x - spot.x, other.y - spot.y)),
    );

  return Array.from({ length: count }, (_, index) => {
    let best: Spot = { x: width / 2, y: height / 2 };
    let bestGap = -1;
    for (let attempt = 0; attempt < STICKERS.tries; attempt++) {
      const spot = {
        x: -hang + next() * (width + 2 * hang),
        y: -hang + next() * (height + 2 * hang),
      };
      const gap = nearest(spot);
      if (gap >= apart) {
        best = spot;
        break;
      }
      if (gap > bestGap) {
        bestGap = gap;
        best = spot;
      }
    }
    placed.push(best);
    const tilt = (next() * 2 - 1) * STICKERS.tiltDegrees;
    return { ...best, tilt, ms: index * STICKERS.breathStepMs };
  });
}

"use client";

import { ArticleBadge } from "./badge";
import { badgeFor } from "./pick";
import { scatter, STICKERS } from "./scatter";
import { LOOK } from "./shape";

const HEIGHT = 293;
const WIDTH = HEIGHT * 1.5;
const INSIDE = -1;
const COPIES = 5;
const PADDING = 28;

const percent = (value: number, of: number) =>
  `${((value / of) * 100).toFixed(3)}%`;

export function BadgeTile({ slug }: { slug: string }) {
  const badge = badgeFor(slug);
  const size = LOOK.box * STICKERS.scale;
  const stickers = scatter(slug, {
    badge,
    width: WIDTH,
    height: HEIGHT,
    overhang: INSIDE,
    count: COPIES,
    padding: PADDING,
  });

  return (
    <div
      aria-hidden="true"
      style={{
        position: "relative",
        aspectRatio: "3 / 2",
        width: "100%",
        overflow: "hidden",
      }}
    >
      {stickers.map(({ x, y, tilt, ms }) => (
        <div
          key={ms}
          style={{
            position: "absolute",
            width: percent(size, WIDTH),
            left: percent(x - size / 2, WIDTH),
            top: percent(y - size / 2, HEIGHT),
            transform: `rotate(${tilt.toFixed(1)}deg)`,
          }}
        >
          <ArticleBadge
            badge={badge}
            startMs={ms}
            playing={false}
            flat
            className="block h-auto w-full"
          />
        </div>
      ))}
    </div>
  );
}

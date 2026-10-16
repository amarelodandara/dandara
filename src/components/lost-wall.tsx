import type { ReactNode } from "react";
import { Signpost, type Sign } from "@/components/signposts";
import { LAYOUTS, type Spot } from "@/lib/lost-wall";

const SHOWN_AT: Record<number, string> = {
  1: "grid auto-rows-24 grid-cols-1 md:hidden",
  2: "hidden h-dvh grid-cols-2 grid-rows-8 md:max-lg:grid",
  3: "hidden h-dvh grid-cols-3 grid-rows-6 lg:max-2xl:grid",
  4: "hidden h-dvh grid-cols-4 grid-rows-5 2xl:max-[1920px]:grid",
  5: "hidden h-dvh grid-cols-5 grid-rows-6 min-[1920px]:grid",
};

const COL_START: Record<number, string> = {
  1: "col-start-1",
  2: "col-start-2",
  3: "col-start-3",
  4: "col-start-4",
  5: "col-start-5",
};

const ROW_START: Record<number, string> = {
  1: "row-start-1",
  2: "row-start-2",
  3: "row-start-3",
  4: "row-start-4",
  5: "row-start-5",
  6: "row-start-6",
  7: "row-start-7",
  8: "row-start-8",
  9: "row-start-9",
  10: "row-start-10",
  11: "row-start-11",
  12: "row-start-12",
  13: "row-start-13",
  14: "row-start-14",
  15: "row-start-15",
};

const COL_SPAN: Record<number, string> = {
  1: "col-span-1",
  2: "col-span-2",
};

const ROW_SPAN: Record<number, string> = {
  1: "row-span-1",
  2: "row-span-2",
  3: "row-span-3",
};

const placed = ({ col, row, width, height }: Spot) =>
  `${COL_START[col + 1]} ${ROW_START[row + 1]} ${COL_SPAN[width]} ${ROW_SPAN[height]}`;

function Cell({
  spot,
  signs,
  hero,
}: {
  spot: Spot;
  signs: Sign[];
  hero: ReactNode;
}) {
  if (spot.kind === "hero") {
    return (
      <div
        data-recessed
        className={`${placed(spot)} flex flex-col justify-center rounded-(--shop-radius) bg-graphite-50 px-8 py-4`}
      >
        {hero}
      </div>
    );
  }
  if (spot.kind === "sign") {
    return (
      <div className={`${placed(spot)} grid`}>
        <Signpost {...signs[spot.index]} />
      </div>
    );
  }
  return (
    <div
      aria-hidden="true"
      className={`${placed(spot)} rounded-(--shop-radius) shadow-hollow`}
    />
  );
}

export function LostWall({ signs, hero }: { signs: Sign[]; hero: ReactNode }) {
  return (
    <main data-lost-wall>
      {LAYOUTS.map(({ columns, spots }) => (
        <div
          key={columns}
          className={`${SHOWN_AT[columns]} gap-3 p-[max(1.5rem,4vw)]`}
        >
          {spots.map((spot) => (
            <Cell
              key={`${spot.kind}-${spot.index}`}
              spot={spot}
              signs={signs}
              hero={hero}
            />
          ))}
        </div>
      ))}
    </main>
  );
}

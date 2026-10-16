export type Spot = {
  kind: "hero" | "sign" | "empty";
  index: number;
  col: number;
  row: number;
  width: number;
  height: number;
};

export type Layout = { columns: number; rows: number; spots: Spot[] };

export const LAYOUTS: Layout[] = [
  {
    columns: 1,
    rows: 15,
    spots: [
      { kind: "hero", index: 0, col: 0, row: 0, width: 1, height: 1 },
      { kind: "sign", index: 0, col: 0, row: 1, width: 1, height: 1 },
      { kind: "empty", index: 0, col: 0, row: 2, width: 1, height: 2 },
      { kind: "sign", index: 1, col: 0, row: 4, width: 1, height: 1 },
      { kind: "empty", index: 1, col: 0, row: 5, width: 1, height: 1 },
      { kind: "sign", index: 2, col: 0, row: 6, width: 1, height: 1 },
      { kind: "empty", index: 2, col: 0, row: 7, width: 1, height: 2 },
      { kind: "sign", index: 3, col: 0, row: 9, width: 1, height: 1 },
      { kind: "empty", index: 3, col: 0, row: 10, width: 1, height: 1 },
      { kind: "sign", index: 4, col: 0, row: 11, width: 1, height: 1 },
      { kind: "empty", index: 4, col: 0, row: 12, width: 1, height: 2 },
      { kind: "sign", index: 5, col: 0, row: 14, width: 1, height: 1 },
    ],
  },
  {
    columns: 2,
    rows: 8,
    spots: [
      { kind: "hero", index: 0, col: 0, row: 0, width: 1, height: 1 },
      { kind: "sign", index: 0, col: 0, row: 1, width: 1, height: 1 },
      { kind: "empty", index: 0, col: 1, row: 0, width: 1, height: 3 },
      { kind: "sign", index: 1, col: 0, row: 2, width: 1, height: 1 },
      { kind: "empty", index: 1, col: 0, row: 3, width: 2, height: 1 },
      { kind: "empty", index: 2, col: 0, row: 4, width: 1, height: 2 },
      { kind: "sign", index: 2, col: 1, row: 4, width: 1, height: 1 },
      { kind: "sign", index: 3, col: 1, row: 5, width: 1, height: 1 },
      { kind: "sign", index: 4, col: 0, row: 6, width: 1, height: 1 },
      { kind: "empty", index: 3, col: 1, row: 6, width: 1, height: 2 },
      { kind: "sign", index: 5, col: 0, row: 7, width: 1, height: 1 },
    ],
  },
  {
    columns: 3,
    rows: 6,
    spots: [
      { kind: "hero", index: 0, col: 0, row: 0, width: 1, height: 1 },
      { kind: "sign", index: 0, col: 2, row: 5, width: 1, height: 1 },
      { kind: "sign", index: 1, col: 0, row: 1, width: 1, height: 1 },
      { kind: "sign", index: 2, col: 2, row: 2, width: 1, height: 1 },
      { kind: "sign", index: 3, col: 0, row: 3, width: 1, height: 1 },
      { kind: "sign", index: 4, col: 2, row: 0, width: 1, height: 1 },
      { kind: "sign", index: 5, col: 0, row: 5, width: 1, height: 1 },
      { kind: "empty", index: 0, col: 1, row: 1, width: 2, height: 1 },
      { kind: "empty", index: 1, col: 0, row: 2, width: 2, height: 1 },
      { kind: "empty", index: 2, col: 1, row: 3, width: 1, height: 3 },
      { kind: "empty", index: 3, col: 2, row: 3, width: 1, height: 2 },
      { kind: "empty", index: 4, col: 0, row: 4, width: 1, height: 1 },
      { kind: "empty", index: 5, col: 1, row: 0, width: 1, height: 1 },
    ],
  },
  {
    columns: 4,
    rows: 5,
    spots: [
      { kind: "hero", index: 0, col: 0, row: 0, width: 1, height: 1 },
      { kind: "sign", index: 0, col: 2, row: 3, width: 1, height: 1 },
      { kind: "sign", index: 1, col: 0, row: 4, width: 1, height: 1 },
      { kind: "sign", index: 2, col: 0, row: 2, width: 1, height: 1 },
      { kind: "sign", index: 3, col: 3, row: 0, width: 1, height: 1 },
      { kind: "sign", index: 4, col: 2, row: 1, width: 1, height: 1 },
      { kind: "sign", index: 5, col: 3, row: 4, width: 1, height: 1 },
      { kind: "empty", index: 0, col: 2, row: 0, width: 1, height: 1 },
      { kind: "empty", index: 1, col: 0, row: 1, width: 2, height: 1 },
      { kind: "empty", index: 2, col: 3, row: 1, width: 1, height: 3 },
      { kind: "empty", index: 3, col: 1, row: 2, width: 2, height: 1 },
      { kind: "empty", index: 4, col: 0, row: 3, width: 2, height: 1 },
      { kind: "empty", index: 5, col: 1, row: 4, width: 2, height: 1 },
      { kind: "empty", index: 6, col: 1, row: 0, width: 1, height: 1 },
    ],
  },
  {
    columns: 5,
    rows: 6,
    spots: [
      { kind: "hero", index: 0, col: 0, row: 0, width: 1, height: 1 },
      { kind: "sign", index: 0, col: 1, row: 1, width: 1, height: 1 },
      { kind: "sign", index: 1, col: 4, row: 3, width: 1, height: 1 },
      { kind: "sign", index: 2, col: 3, row: 5, width: 1, height: 1 },
      { kind: "sign", index: 3, col: 1, row: 3, width: 1, height: 1 },
      { kind: "sign", index: 4, col: 4, row: 0, width: 1, height: 1 },
      { kind: "sign", index: 5, col: 0, row: 4, width: 1, height: 1 },
      { kind: "empty", index: 0, col: 2, row: 0, width: 1, height: 2 },
      { kind: "empty", index: 1, col: 3, row: 0, width: 1, height: 3 },
      { kind: "empty", index: 2, col: 0, row: 1, width: 1, height: 3 },
      { kind: "empty", index: 3, col: 4, row: 1, width: 1, height: 2 },
      { kind: "empty", index: 4, col: 1, row: 2, width: 2, height: 1 },
      { kind: "empty", index: 5, col: 2, row: 3, width: 1, height: 3 },
      { kind: "empty", index: 6, col: 3, row: 3, width: 1, height: 2 },
      { kind: "empty", index: 7, col: 1, row: 4, width: 1, height: 2 },
      { kind: "empty", index: 8, col: 4, row: 4, width: 1, height: 2 },
      { kind: "empty", index: 9, col: 0, row: 5, width: 1, height: 1 },
      { kind: "empty", index: 10, col: 1, row: 0, width: 1, height: 1 },
    ],
  },
];

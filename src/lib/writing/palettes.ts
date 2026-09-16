export type PalettePhoto = {
  src: string;
  width: number;
  height: number;
  alt: string;
  credit: string;
  x?: number;
  y?: number;
  zoom?: number;
  flip?: boolean;
};

export type Palette = {
  slug: string;
  name: string;
  scientific: string;
  common: string;
  ptName: string;
  colors: string[];
  weights?: number[];
  photo?: PalettePhoto;
};

export const PALETTES: Palette[] = [
  {
    slug: "idea",
    name: "Idea",
    scientific: "Batoideias",
    common: "Ray",
    ptName: "Raia",
    colors: [
      "oklch(0.255 0.015 76.2)",
      "oklch(0.55 0.035 75)",
      "oklch(0.973 0.004 91.4)",
    ],
    weights: [50, 30, 20],
    photo: {
      src: "/writing/deep-waters-of-colors/idea-ray.png",
      width: 2818,
      height: 2136,
      alt: "A spotted eagle ray seen from below, wings spread, gliding overhead.",
      credit: "Photo by John Norton, CC BY 2.0, via Wikimedia Commons",
    },
  },
  {
    slug: "patela",
    name: "Patela",
    scientific: "Paracanthurus hepatus",
    common: "Blue Surgeonfish",
    ptName: "Cirurgião Patela",
    colors: [
      "oklch(0.190 0.111 284.8)",
      "oklch(0.454 0.255 285.4)",
      "oklch(0.605 0.217 257.2)",
      "oklch(0.955 0.216 114.6)",
    ],
    weights: [50, 10, 25, 10],
    photo: {
      src: "/writing/deep-waters-of-colors/patela.png",
      width: 3872,
      height: 2592,
      alt: "A blue tang, dark blue body with a black palette-shaped patch and a yellow tail.",
      credit: "Photo by DerHans04, CC BY-SA 3.0, via Wikimedia Commons",
      zoom: 0.52,
    },
  },
  {
    slug: "caranx",
    name: "Caranx",
    scientific: "Caranx",
    common: "Jack",
    ptName: "Xaréu",
    colors: [
      "oklch(0.28 0.01 90)",
      "oklch(0.62 0.015 235)",
      "oklch(0.82 0.01 240)",
      "oklch(0.9 0.03 95)",
      "oklch(0.906 0.143 94.0)",
    ],
    weights: [45, 10, 15, 20, 10],
    photo: {
      src: "/writing/deep-waters-of-colors/caranx.png",
      width: 1997,
      height: 1123,
      alt: "A vintage hand-colored engraving of a Caranx jack, grey-blue back and pale gold belly.",
      credit: "From a public domain plate, via Wikimedia Commons",
      zoom: 0.44,
      flip: true,
    },
  },
  {
    slug: "idol",
    name: "Idol",
    scientific: "Zanclus cornutus",
    common: "Moorish Idol",
    ptName: "Ídolo Mourisco",
    colors: [
      "oklch(0.261 0.004 84.6)",
      "oklch(0.979 0.096 111.2)",
      "oklch(0.925 0.194 102.9)",
      "oklch(0.991 0.000 89.9)",
    ],
    weights: [40, 5, 15, 40],
    photo: {
      src: "/writing/deep-waters-of-colors/idol.png",
      width: 1183,
      height: 1183,
      alt: "A moorish idol, bold black and yellow bands, trailing dorsal filament.",
      credit: "Photo by Diego Delso, CC BY-SA 4.0, via Wikimedia Commons",
      zoom: 0.66,
    },
  },
  {
    slug: "volitas",
    name: "Volitas",
    scientific: "Pterois volitans",
    common: "Lion Fish",
    ptName: "Peixe-Leão",
    colors: [
      "oklch(0.260 0.000 89.9)",
      "oklch(0.807 0.009 67.7)",
      "oklch(0.446 0.126 45.5)",
      "oklch(0.858 0.094 74.9)",
      "oklch(0.729 0.146 168.1)",
    ],
    weights: [25, 15, 30, 20, 10],
    photo: {
      src: "/writing/deep-waters-of-colors/volitas.png",
      width: 1636,
      height: 1226,
      alt: "A red lionfish, striped fan-like fins spread wide, venomous spines fanned above.",
      credit: "Photo by Michael Gäbler, CC BY 3.0, via Wikimedia Commons",
      x: -24,
      y: -5,
      zoom: 0.76,
    },
  },
  {
    slug: "pink-moon",
    name: "Pink Moon",
    scientific: "Drymonema larsoni",
    common: "Pink Meanie",
    ptName: "Água Viva",
    colors: [
      "oklch(0.949 0.024 259.8)",
      "oklch(0.815 0.137 67.3)",
      "oklch(0.912 0.066 69.8)",
    ],
    weights: [50, 30, 20],
    photo: {
      src: "/writing/deep-waters-of-colors/pink-moon.png",
      width: 525,
      height: 700,
      alt: "A pink meanie jellyfish adrift in blue water, pale peach oral arms trailing below a translucent bell.",
      credit: "Photo by Liza Gomez Daglio, CC BY-SA 4.0, via Wikimedia Commons",
      y: -18,
      zoom: 1.15,
    },
  },
];

export function withAlpha(oklch: string, alpha: number): string {
  return oklch.replace(")", ` / ${alpha})`);
}

export function lightnessOf(oklch: string): number {
  return Number.parseFloat(oklch.replace("oklch(", ""));
}

function extreme(
  palette: Palette,
  pick: (a: number, b: number) => boolean,
): string {
  let best = palette.colors[0];
  for (const color of palette.colors) {
    if (pick(lightnessOf(color), lightnessOf(best))) best = color;
  }
  return best;
}

export function darkest(palette: Palette): string {
  return extreme(palette, (a, b) => a < b);
}

export function lightest(palette: Palette): string {
  return extreme(palette, (a, b) => a > b);
}

export function midtones(palette: Palette): string[] {
  const dark = darkest(palette);
  const light = lightest(palette);
  return palette.colors.filter((c) => c !== dark && c !== light);
}

export function shareOf(palette: Palette, index: number): number {
  return palette.weights?.[index] ?? 1;
}

export function findPalette(slug: string): Palette {
  const palette = PALETTES.find((one) => one.slug === slug);
  if (!palette) throw new Error(`Unknown palette: ${slug}`);
  return palette;
}

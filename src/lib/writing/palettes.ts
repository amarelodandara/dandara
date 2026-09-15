export type PalettePhoto = {
  src: string;
  alt: string;
  credit: string;
};

export type Palette = {
  slug: string;
  name: string;
  scientific: string;
  common: string;
  ptName: string;
  colors: string[];
  photo?: PalettePhoto;
};

export const PALETTES: Palette[] = [
  {
    slug: "idea",
    name: "Idea",
    scientific: "Batoideias",
    common: "ray",
    ptName: "Raia",
    colors: [
      "oklch(0.255 0.015 76.2)",
      "oklch(0.55 0.035 75)",
      "oklch(0.973 0.004 91.4)",
    ],
    photo: {
      src: "/writing/deep-waters-of-colors/idea-ray.png",
      alt: "A spotted eagle ray seen from below, wings spread, gliding overhead.",
      credit: "John Norton, CC BY 2.0, via Wikimedia Commons",
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
      "oklch(0.955 0.216 114.6)",
      "oklch(0.605 0.217 257.2)",
    ],
  },
  {
    slug: "caranx",
    name: "Caranx",
    scientific: "Caranx",
    common: "Jack",
    ptName: "Xaréu",
    colors: [
      "oklch(0.28 0.01 90)",
      "oklch(0.82 0.01 240)",
      "oklch(0.62 0.015 235)",
      "oklch(0.9 0.03 95)",
      "oklch(0.906 0.143 94.0)",
    ],
  },
  {
    slug: "pink-moon",
    name: "Pink Moon",
    scientific: "Drymonema larsoni",
    common: "Pink Meanie",
    ptName: "Água Viva",
    colors: [
      "oklch(0.22 0.05 345)",
      "oklch(0.62 0.22 345)",
      "oklch(0.4 0.14 345)",
      "oklch(0.95 0.01 340)",
    ],
  },
  {
    slug: "idol",
    name: "Idol",
    scientific: "Zanclus cornutus",
    common: "Moorish Idol",
    ptName: "Ídolo Mourisco",
    colors: [
      "oklch(0.18 0.005 90)",
      "oklch(0.85 0.16 95)",
      "oklch(0.55 0.02 60)",
      "oklch(0.97 0.003 90)",
    ],
  },
  {
    slug: "volitas",
    name: "Volitas",
    scientific: "Pterois volitans",
    common: "Lion Fish",
    ptName: "Peixe-Leão",
    colors: [
      "oklch(0.3 0.09 35)",
      "oklch(0.55 0.16 30)",
      "oklch(0.5 0.11 40)",
      "oklch(0.95 0.02 70)",
    ],
  },
];

export function withAlpha(oklch: string, alpha: number): string {
  return oklch.replace(")", ` / ${alpha})`);
}

export function lightnessOf(oklch: string): number {
  return Number.parseFloat(oklch.replace("oklch(", ""));
}

function extreme(palette: Palette, pick: (a: number, b: number) => boolean): string {
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

export function findPalette(slug: string): Palette {
  const palette = PALETTES.find((one) => one.slug === slug);
  if (!palette) throw new Error(`Unknown palette: ${slug}`);
  return palette;
}

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
  ink: string;
  paper: string;
  accents: string[];
  photo?: PalettePhoto;
};

export const PALETTES: Palette[] = [
  {
    slug: "idea",
    name: "Idea",
    scientific: "Batoideias",
    common: "ray",
    ptName: "Raia",
    ink: "oklch(0.255 0.015 76.2)",
    paper: "oklch(0.973 0.004 91.4)",
    accents: ["oklch(0.55 0.035 75)"],
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
    ink: "oklch(0.2 0.01 260)",
    paper: "oklch(0.96 0.012 255)",
    accents: [
      "oklch(0.55 0.18 255)",
      "oklch(0.87 0.17 95)",
      "oklch(0.32 0.06 255)",
    ],
  },
  {
    slug: "carcharias",
    name: "Carcharias",
    scientific: "Carcharodon carcharias",
    common: "White Shark",
    ptName: "Tubarão Branco",
    ink: "oklch(0.22 0.004 250)",
    paper: "oklch(0.95 0.004 220)",
    accents: [
      "oklch(0.48 0.012 240)",
      "oklch(0.72 0.008 230)",
    ],
  },
  {
    slug: "caranx",
    name: "Caranx",
    scientific: "Caranx",
    common: "Jack",
    ptName: "Xaréu",
    ink: "oklch(0.28 0.01 90)",
    paper: "oklch(0.9 0.03 95)",
    accents: [
      "oklch(0.82 0.01 240)",
      "oklch(0.62 0.015 235)",
    ],
  },
  {
    slug: "pink-moon",
    name: "Pink Moon",
    scientific: "Drymonema larsoni",
    common: "Pink Meanie",
    ptName: "Água Viva",
    ink: "oklch(0.22 0.05 345)",
    paper: "oklch(0.95 0.01 340)",
    accents: [
      "oklch(0.62 0.22 345)",
      "oklch(0.4 0.14 345)",
    ],
  },
  {
    slug: "idol",
    name: "Idol",
    scientific: "Zanclus cornutus",
    common: "Moorish Idol",
    ptName: "Ídolo Mourisco",
    ink: "oklch(0.18 0.005 90)",
    paper: "oklch(0.97 0.003 90)",
    accents: [
      "oklch(0.85 0.16 95)",
      "oklch(0.55 0.02 60)",
    ],
  },
  {
    slug: "volitas",
    name: "Volitas",
    scientific: "Pterois volitans",
    common: "Lion Fish",
    ptName: "Peixe-Leão",
    ink: "oklch(0.3 0.09 35)",
    paper: "oklch(0.95 0.02 70)",
    accents: [
      "oklch(0.55 0.16 30)",
      "oklch(0.5 0.11 40)",
    ],
  },
];

export function withAlpha(oklch: string, alpha: number): string {
  return oklch.replace(")", ` / ${alpha})`);
}

export function findPalette(slug: string): Palette {
  const palette = PALETTES.find((one) => one.slug === slug);
  if (!palette) throw new Error(`Unknown palette: ${slug}`);
  return palette;
}

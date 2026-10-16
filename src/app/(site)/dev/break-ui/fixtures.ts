import { BADGES } from "@/badges/data";
import type { Badge } from "@/badges/shape";
import type { Sign } from "@/components/signposts";
import type { Tile } from "@/lib/exhibition";

export type Dataset = "demo" | "worst" | "empty" | "one";

export const DATASETS: { id: Dataset; label: string }[] = [
  { id: "demo", label: "Demo data" },
  { id: "worst", label: "Worst case" },
  { id: "empty", label: "Empty" },
  { id: "one", label: "One" },
];

const SMALLEST_AT_WORDS = 100;
const LARGEST_AT_WORDS = 1600;
const SMALLEST_SCALE = 0.4;
const LARGEST_SCALE = 0.8;

const scaleFor = (words: number) => {
  const reach =
    (Math.log(words) - Math.log(SMALLEST_AT_WORDS)) /
    (Math.log(LARGEST_AT_WORDS) - Math.log(SMALLEST_AT_WORDS));
  const clamped = Math.min(1, Math.max(0, reach));
  return SMALLEST_SCALE + (LARGEST_SCALE - SMALLEST_SCALE) * clamped;
};

const like = (slug: string, title: string, words: number): Badge => ({
  ...BADGES[slug],
  title,
  words,
  scale: scaleFor(words),
});

export type Fixture = {
  badges: { note: string; badge: Badge }[];
  tiles: Tile[];
  signs: Sign[];
  changelog: { version: string; lines: string[] } | null;
  headings: { title: string; deck: string }[];
};

const demoTiles = (tiles: Tile[]) => tiles.slice(0, 6);

const worstTiles = (tiles: Tile[]): Tile[] => {
  const [a, b, c, d, e] = tiles;
  return [
    {
      ...a,
      id: "worst-long",
      title:
        "Sistema de design do Banco do Brasil: biblioteca de componentes e documentação",
      when: "Mar 2026",
      live: { href: "https://example.com", label: "bb.com.br" },
      read: "/writing/obsidian",
    },
    { ...b, id: "worst-bare", title: "Ócio", when: undefined, live: undefined },
    {
      ...c,
      id: "worst-word",
      title: "Desinstitucionalização",
      when: "2019",
    },
    {
      ...d,
      id: "worst-changelog",
      title: "Stone Co. Product Designer, Payments & Partner Platform",
      media: {
        kind: "changelog",
        version: "2022 — 2026 · Stone, StoneCo, Pagar.me e Ton",
        lines: [
          "launched: App Store para terminais, fluxo de Pix por aproximação",
          "fixed: https://www.figma.com/community/file/1234567890123/stone-design-system",
          "launched: App Store para terminais, fluxo de Pix por aproximação",
          "corrigido: textos do fluxo de cancelamento",
        ],
      },
    },
    {
      ...e,
      id: "worst-elsewhere",
      title: "Por que “bom o suficiente” é suficiente & outras heresias",
      when: "Oct 2026",
      read: "https://medium.com/design-bootcamp/por-que-bom-o-suficiente",
      readAt: "UX Collective Brasil",
    },
  ];
};

export function fixtureFor(dataset: Dataset, tiles: Tile[]): Fixture {
  if (dataset === "worst") {
    return {
      badges: [
        {
          note: "63 characters on a 180-word note",
          badge: like(
            "the-color-of-water",
            "Notas sobre a Bienal de São Paulo: o que ficou depois da visita",
            180,
          ),
        },
        {
          note: "4 characters on a 1,600-word essay",
          badge: like("obsidian", "Ócio", 1600),
        },
        {
          note: "ampersand and curly quotes, 420 words",
          badge: like(
            "museums-and-websites",
            "Design & “bom o suficiente”: notas de uma designer",
            420,
          ),
        },
        {
          note: "elsewhere entry typed with 0 words",
          badge: like("the-designer-archetype", "Por que escrevo", 0),
        },
      ],
      tiles: worstTiles(tiles),
      signs: [
        {
          href: "/work/photography",
          name: "Fotografia analógica e cadernos de viagem",
          area: "site",
        },
        { href: "/writing", name: "Ócio", area: "blog" },
        {
          href: "/changelog",
          name: "Desinstitucionalização",
          area: "work",
        },
      ],
      changelog: {
        version: "2022 — 2026 · Stone, StoneCo, Pagar.me e Ton",
        lines: [
          "launched: App Store para terminais, fluxo de Pix por aproximação",
          "fixed: https://www.figma.com/community/file/1234567890123/stone-design-system",
          "corrigido: textos do fluxo de cancelamento",
        ],
      },
      headings: [
        {
          title: "Desinstitucionalização: o museu depois da internet",
          deck: "Uma conversa longa sobre acervos, acesso e o que os sites dos museus brasileiros ainda não fazem",
        },
        { title: "Ócio", deck: "" },
      ],
    };
  }

  if (dataset === "empty") {
    return {
      badges: [],
      tiles: [],
      signs: [],
      changelog: { version: "2026", lines: [] },
      headings: [],
    };
  }

  if (dataset === "one") {
    return {
      badges: [{ note: "one badge", badge: BADGES.obsidian }],
      tiles: tiles.slice(0, 1),
      signs: [{ href: "/writing", name: "Writing", area: "blog" }],
      changelog: {
        version: "2026",
        lines: ["launched: one thing"],
      },
      headings: [{ title: "How I Obsidian", deck: "One deck" }],
    };
  }

  return {
    badges: Object.entries(BADGES).map(([slug, badge]) => ({
      note: `${slug}, ${badge.words} words`,
      badge,
    })),
    tiles: demoTiles(tiles),
    signs: [
      { href: "/writing", name: "Writing", area: "blog" },
      { href: "/changelog", name: "Changelog", area: "site" },
      { href: "/work/sketchbook", name: "Sketchbook", area: "site" },
    ],
    changelog: {
      version: "2022 — 2026",
      lines: [
        "launched: App Store for terminals, Pix NFC flow, Ticketing app, News automation",
        "improved: Pre-authorization app, Activation flow, Sale cancelation flow",
      ],
    },
    headings: [
      {
        title: "Museums and websites: anticipating visitors’ needs",
        deck: "What a museum's website owes the people about to walk in",
      },
    ],
  };
}

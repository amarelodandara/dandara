import type { PaletteGraph } from "./graphs/drawing";

export type Swatch = {
  oklch: string;
  hex: string;
  hsl: string;
  variables: string;
  share: number;
  ink: string;
  lit: string;
};

export type Palette = {
  slug: string;
  name: string;
  photo: {
    src: string;
    width: number;
    height: number;
    alt: string;
    credit: string;
  };
  swatches: Swatch[];
  person: { name: string; role: string };
  code: { label: string; file: string; lines: number; html: string };
  graph: PaletteGraph;
};

export const PALETTES: Record<string, Palette> = {
  idea: {
    slug: "idea",
    name: "Idea",
    photo: {
      src: "/writing/the-color-of-water/idea.webp",
      width: 845,
      height: 640,
      alt: "A spotted eagle ray seen from below, wings spread, gliding overhead.",
      credit: "Photo by John Norton, CC BY 2.0, via Wikimedia Commons",
    },
    swatches: [
      {
        oklch: "oklch(0.255 0.015 76.2)",
        hex: "#27221b",
        hsl: "hsl(35 18.2% 12.9%)",
        variables: "--idea-1: oklch(0.255 0.015 76.2);",
        share: 50,
        ink: "oklch(0.973 0.004 91.4)",
        lit: "oklch(0.973 0.004 91.4 / 0.12)",
      },
      {
        oklch: "oklch(0.55 0.035 75)",
        hex: "#7e6f5b",
        hsl: "hsl(34.3 16.1% 42.5%)",
        variables: "--idea-2: oklch(0.55 0.035 75);",
        share: 30,
        ink: "oklch(0.255 0.015 76.2)",
        lit: "oklch(0.255 0.015 76.2 / 0.12)",
      },
      {
        oklch: "oklch(0.973 0.004 91.4)",
        hex: "#f7f6f3",
        hsl: "hsl(45 20% 96.1%)",
        variables: "--idea-3: oklch(0.973 0.004 91.4);",
        share: 20,
        ink: "oklch(0.255 0.015 76.2)",
        lit: "oklch(0.255 0.015 76.2 / 0.12)",
      },
    ],
    person: {
      name: "Raya Baitoi",
      role: "Chief Executive Officer",
    },
    code: {
      label: "c++",
      file: "glide.cpp",
      lines: 9,
      html: '<span class="hljs-keyword">enum class</span> <span class="hljs-title class_">Glide</span> {\n  Flap,\n  Drift,\n};\n\n<span class="hljs-function">Glide <span class="hljs-title">ray</span><span class="hljs-params">(<span class="hljs-type">int</span> beat)</span> </span>{\n  <span class="hljs-keyword">return</span> beat &gt; <span class="hljs-number">3</span> ? Glide::Drift\n                  : Glide::Flap;\n}',
    },
    graph: {
      kind: "flow",
      title: "THE PLAN",
      direction: "column",
      rows: [
        {
          nodes: [
            {
              label: "execute",
            },
            {
              label: "execute",
              tone: "accent",
            },
            {
              label: "execute",
              stretch: true,
              tone: "muted",
            },
          ],
        },
      ],
    },
  },
  patela: {
    slug: "patela",
    name: "Patela",
    photo: {
      src: "/writing/the-color-of-water/patela.webp",
      width: 498,
      height: 333,
      alt: "A blue tang, dark blue body with a black palette-shaped patch and a yellow tail.",
      credit: "Photo by DerHans04, CC BY-SA 3.0, via Wikimedia Commons",
    },
    swatches: [
      {
        oklch: "oklch(0.190 0.111 284.8)",
        hex: "#140042",
        hsl: "hsl(258.2 100% 12.9%)",
        variables: "--patela-1: oklch(0.190 0.111 284.8);",
        share: 50,
        ink: "oklch(0.955 0.216 114.6)",
        lit: "oklch(0.955 0.216 114.6 / 0.12)",
      },
      {
        oklch: "oklch(0.454 0.255 285.4)",
        hex: "#5712d9",
        hsl: "hsl(260.8 84.7% 46.1%)",
        variables: "--patela-2: oklch(0.454 0.255 285.4);",
        share: 10,
        ink: "oklch(0.955 0.216 114.6)",
        lit: "oklch(0.955 0.216 114.6 / 0.12)",
      },
      {
        oklch: "oklch(0.605 0.217 257.2)",
        hex: "#007bff",
        hsl: "hsl(211.1 100% 50%)",
        variables: "--patela-3: oklch(0.605 0.217 257.2);",
        share: 25,
        ink: "oklch(0.190 0.111 284.8)",
        lit: "oklch(0.190 0.111 284.8 / 0.12)",
      },
      {
        oklch: "oklch(0.955 0.216 114.6)",
        hex: "#eeff14",
        hsl: "hsl(64.3 100% 53.9%)",
        variables: "--patela-4: oklch(0.955 0.216 114.6);",
        share: 10,
        ink: "oklch(0.190 0.111 284.8)",
        lit: "oklch(0.190 0.111 284.8 / 0.12)",
      },
    ],
    person: {
      name: "Blue Surg",
      role: "DevRel",
    },
    code: {
      label: "blade",
      file: "tank.blade.php",
      lines: 10,
      html: '<span class="hljs-tag">&lt;<span class="hljs-name">flux:card</span>&gt;</span>\n  <span class="hljs-tag">&lt;<span class="hljs-name">flux:heading</span>&gt;</span>Tank<span class="hljs-tag">&lt;/<span class="hljs-name">flux:heading</span>&gt;</span>\n\n  <span class="hljs-tag">&lt;<span class="hljs-name">flux:input</span>\n    <span class="hljs-attr">wire:model.live</span>=<span class="hljs-string">&quot;species&quot;</span>\n    <span class="hljs-attr">label</span>=<span class="hljs-string">&quot;Species&quot;</span>\n  /&gt;</span>\n\n  <span class="hljs-tag">&lt;<span class="hljs-name">flux:button</span>&gt;</span>Save<span class="hljs-tag">&lt;/<span class="hljs-name">flux:button</span>&gt;</span>\n<span class="hljs-tag">&lt;/<span class="hljs-name">flux:card</span>&gt;</span>',
    },
    graph: {
      kind: "stack",
      title: "USAGE",
      items: [
        {
          label: "Empathy",
          muted: true,
        },
        {
          label: "Focus",
        },
        {
          label: "Impute",
          muted: true,
        },
      ],
    },
  },
  caranx: {
    slug: "caranx",
    name: "Caranx",
    photo: {
      src: "/writing/the-color-of-water/caranx.webp",
      width: 501,
      height: 282,
      alt: "A vintage hand-colored engraving of a Caranx jack, grey-blue back and pale gold belly.",
      credit: "From a public domain plate, via Wikimedia Commons",
    },
    swatches: [
      {
        oklch: "oklch(0.28 0.01 90)",
        hex: "#2b2923",
        hsl: "hsl(45 10.3% 15.3%)",
        variables: "--caranx-1: oklch(0.28 0.01 90);",
        share: 45,
        ink: "oklch(0.906 0.143 94.0)",
        lit: "oklch(0.906 0.143 94.0 / 0.12)",
      },
      {
        oklch: "oklch(0.62 0.015 235)",
        hex: "#7e888e",
        hsl: "hsl(202.5 6.6% 52.5%)",
        variables: "--caranx-2: oklch(0.62 0.015 235);",
        share: 10,
        ink: "oklch(0.28 0.01 90)",
        lit: "oklch(0.28 0.01 90 / 0.12)",
      },
      {
        oklch: "oklch(0.82 0.01 240)",
        hex: "#bfc5ca",
        hsl: "hsl(207.3 9.4% 77.1%)",
        variables: "--caranx-3: oklch(0.82 0.01 240);",
        share: 15,
        ink: "oklch(0.28 0.01 90)",
        lit: "oklch(0.28 0.01 90 / 0.12)",
      },
      {
        oklch: "oklch(0.9 0.03 95)",
        hex: "#e4dec8",
        hsl: "hsl(47.1 34.1% 83.9%)",
        variables: "--caranx-4: oklch(0.9 0.03 95);",
        share: 20,
        ink: "oklch(0.28 0.01 90)",
        lit: "oklch(0.28 0.01 90 / 0.12)",
      },
      {
        oklch: "oklch(0.906 0.143 94.0)",
        hex: "#ffde66",
        hsl: "hsl(47.1 100% 70%)",
        variables: "--caranx-5: oklch(0.906 0.143 94.0);",
        share: 10,
        ink: "oklch(0.28 0.01 90)",
        lit: "oklch(0.28 0.01 90 / 0.12)",
      },
    ],
    person: {
      name: "Jackie",
      role: "Chief Engineering Officer",
    },
    code: {
      label: "rust",
      file: "caranx.rs",
      lines: 9,
      html: '<span class="hljs-keyword">struct</span> <span class="hljs-title class_">Jack</span> {\n    speed: <span class="hljs-type">f32</span>,\n}\n\n<span class="hljs-keyword">impl</span> <span class="hljs-title class_">Jack</span> {\n    <span class="hljs-keyword">fn</span> <span class="hljs-title function_">chase</span>(&amp;<span class="hljs-keyword">self</span>) <span class="hljs-punctuation">-&gt;</span> <span class="hljs-type">f32</span> {\n        <span class="hljs-keyword">self</span>.speed * <span class="hljs-number">1.4</span>\n    }\n}',
    },
    graph: {
      kind: "tree",
      title: "SHOAL",
      items: [
        {
          label: "school/",
          dir: true,
        },
        {
          label: "caranx.rs",
          depth: 1,
          tone: "ink",
        },
        {
          label: "shoal.rs",
          depth: 1,
          tone: "muted",
        },
        {
          label: "Cargo.toml",
          tone: "alt",
        },
      ],
    },
  },
  idol: {
    slug: "idol",
    name: "Idol",
    photo: {
      src: "/writing/the-color-of-water/idol.webp",
      width: 423,
      height: 423,
      alt: "A moorish idol, bold black and yellow bands, trailing dorsal filament.",
      credit: "Photo by Diego Delso, CC BY-SA 4.0, via Wikimedia Commons",
    },
    swatches: [
      {
        oklch: "oklch(0.261 0.004 84.6)",
        hex: "#252422",
        hsl: "hsl(40 4.2% 13.9%)",
        variables: "--idol-1: oklch(0.261 0.004 84.6);",
        share: 40,
        ink: "oklch(0.991 0.000 89.9)",
        lit: "oklch(0.991 0.000 89.9 / 0.12)",
      },
      {
        oklch: "oklch(0.979 0.096 111.2)",
        hex: "#faffb4",
        hsl: "hsl(64 100% 85.3%)",
        variables: "--idol-2: oklch(0.979 0.096 111.2);",
        share: 5,
        ink: "oklch(0.261 0.004 84.6)",
        lit: "oklch(0.261 0.004 84.6 / 0.12)",
      },
      {
        oklch: "oklch(0.925 0.194 102.9)",
        hex: "#ffea04",
        hsl: "hsl(55 100% 50.8%)",
        variables: "--idol-3: oklch(0.925 0.194 102.9);",
        share: 15,
        ink: "oklch(0.261 0.004 84.6)",
        lit: "oklch(0.261 0.004 84.6 / 0.12)",
      },
      {
        oklch: "oklch(0.991 0.000 89.9)",
        hex: "#fcfcfc",
        hsl: "hsl(0 0% 98.8%)",
        variables: "--idol-4: oklch(0.991 0.000 89.9);",
        share: 40,
        ink: "oklch(0.261 0.004 84.6)",
        lit: "oklch(0.261 0.004 84.6 / 0.12)",
      },
    ],
    person: {
      name: "Zaya Idol",
      role: "Chef Design Officer",
    },
    code: {
      label: "css",
      file: "idol.css",
      lines: 10,
      html: '<span class="hljs-selector-class">.idol</span> {\n  <span class="hljs-attr">--band</span>: <span class="hljs-built_in">oklch</span>(<span class="hljs-number">0.93</span> <span class="hljs-number">0.19</span> <span class="hljs-number">103</span>);\n  <span class="hljs-attr">--ink</span>: <span class="hljs-built_in">color-mix</span>(in oklch,\n    <span class="hljs-built_in">var</span>(--band) <span class="hljs-number">60%</span>, black);\n  <span class="hljs-attribute">background</span>: <span class="hljs-built_in">linear-gradient</span>(\n    <span class="hljs-number">105deg</span>, <span class="hljs-built_in">var</span>(--band), <span class="hljs-number">#fff</span>);\n  <span class="hljs-attribute">color</span>: <span class="hljs-built_in">var</span>(--ink);\n\n  &amp;<span class="hljs-selector-pseudo">:hover</span> { <span class="hljs-attr">--band</span>: <span class="hljs-number">#ffd400</span>; }\n}',
    },
    graph: {
      kind: "check",
      title: "BLOG DASHBOARD",
      items: [
        {
          label: "build",
          done: true,
        },
        {
          label: "curate",
          done: false,
        },
      ],
    },
  },
  volitas: {
    slug: "volitas",
    name: "Volitas",
    photo: {
      src: "/writing/the-color-of-water/volitas.webp",
      width: 650,
      height: 487,
      alt: "A red lionfish, striped fan-like fins spread wide, venomous spines fanned above.",
      credit: "Photo by Michael Gäbler, CC BY 3.0, via Wikimedia Commons",
    },
    swatches: [
      {
        oklch: "oklch(0.260 0.000 89.9)",
        hex: "#242424",
        hsl: "hsl(0 0% 14.1%)",
        variables: "--volitas-1: oklch(0.260 0.000 89.9);",
        share: 25,
        ink: "oklch(0.858 0.094 74.9)",
        lit: "oklch(0.858 0.094 74.9 / 0.12)",
      },
      {
        oklch: "oklch(0.807 0.009 67.7)",
        hex: "#c4bfba",
        hsl: "hsl(30 7.8% 74.9%)",
        variables: "--volitas-2: oklch(0.807 0.009 67.7);",
        share: 15,
        ink: "oklch(0.260 0.000 89.9)",
        lit: "oklch(0.260 0.000 89.9 / 0.12)",
      },
      {
        oklch: "oklch(0.446 0.126 45.5)",
        hex: "#8a3701",
        hsl: "hsl(23.6 98.6% 27.3%)",
        variables: "--volitas-3: oklch(0.446 0.126 45.5);",
        share: 30,
        ink: "oklch(0.858 0.094 74.9)",
        lit: "oklch(0.858 0.094 74.9 / 0.12)",
      },
      {
        oklch: "oklch(0.858 0.094 74.9)",
        hex: "#f5c88a",
        hsl: "hsl(34.8 84.3% 75.1%)",
        variables: "--volitas-4: oklch(0.858 0.094 74.9);",
        share: 20,
        ink: "oklch(0.260 0.000 89.9)",
        lit: "oklch(0.260 0.000 89.9 / 0.12)",
      },
      {
        oklch: "oklch(0.729 0.146 168.1)",
        hex: "#0cc496",
        hsl: "hsl(165 88.5% 40.8%)",
        variables: "--volitas-5: oklch(0.729 0.146 168.1);",
        share: 10,
        ink: "oklch(0.260 0.000 89.9)",
        lit: "oklch(0.260 0.000 89.9 / 0.12)",
      },
    ],
    person: {
      name: "Leon Volita",
      role: "VP of Product",
    },
    code: {
      label: "ruby",
      file: "lionfish.rb",
      lines: 9,
      html: '<span class="hljs-keyword">class</span> <span class="hljs-title class_">Lionfish</span> &lt; <span class="hljs-title class_ inherited__">Fish</span>\n  scope <span class="hljs-symbol">:venomous</span>, -&gt; {\n    where(<span class="hljs-string">&quot;spines &gt; ?&quot;</span>, <span class="hljs-number">12</span>)\n  }\n\n  <span class="hljs-keyword">def</span> <span class="hljs-title function_">flare</span>\n    fins.sum(&amp;<span class="hljs-symbol">:span</span>)\n  <span class="hljs-keyword">end</span>\n<span class="hljs-keyword">end</span>',
    },
    graph: {
      kind: "slope",
      title: "USERS",
      palette: "duo",
      fromLabel: "2025",
      toLabel: "2026",
      items: [
        {
          label: "store",
          from: 8200,
          to: 12_400,
        },
        {
          label: "docs",
          from: 5100,
          to: 4100,
        },
        {
          label: "dashboard",
          from: 640,
          to: 860,
        },
      ],
    },
  },
  "pink-moon": {
    slug: "pink-moon",
    name: "Pink Moon",
    photo: {
      src: "/writing/the-color-of-water/pink-moon.webp",
      width: 736,
      height: 982,
      alt: "A pink meanie jellyfish adrift in blue water, pale peach oral arms trailing below a translucent bell.",
      credit: "Photo by Liza Gomez Daglio, CC BY-SA 4.0, via Wikimedia Commons",
    },
    swatches: [
      {
        oklch: "oklch(0.949 0.024 259.8)",
        hex: "#e5efff",
        hsl: "hsl(216.9 100% 94.9%)",
        variables: "--pink-moon-1: oklch(0.949 0.024 259.8);",
        share: 50,
        ink: "oklch(0.4 0.021 264)",
        lit: "oklch(0.4 0.021 264 / 0.12)",
      },
      {
        oklch: "oklch(0.815 0.137 67.3)",
        hex: "#fdb058",
        hsl: "hsl(32 97.6% 66.9%)",
        variables: "--pink-moon-2: oklch(0.815 0.137 67.3);",
        share: 30,
        ink: "oklch(0.4 0.021 264)",
        lit: "oklch(0.4 0.021 264 / 0.12)",
      },
      {
        oklch: "oklch(0.912 0.066 69.8)",
        hex: "#ffdbb3",
        hsl: "hsl(31.6 100% 85.1%)",
        variables: "--pink-moon-3: oklch(0.912 0.066 69.8);",
        share: 20,
        ink: "oklch(0.4 0.021 264)",
        lit: "oklch(0.4 0.021 264 / 0.12)",
      },
    ],
    person: {
      name: "Larson Dry",
      role: "Personality Hire",
    },
    code: {
      label: "markdown",
      file: "field-notes.md",
      lines: 8,
      html: '<span class="hljs-section"># Pink Moon</span>\n\nA <span class="hljs-emphasis">*drifting*</span> bell, <span class="hljs-strong">**8**</span> arms.\n\n<span class="hljs-bullet">-</span> [x] log the bloom\n<span class="hljs-bullet">-</span> [ ] tag the shoal\n\n<span class="hljs-quote">&gt; found at 40 m</span>',
    },
    graph: {
      kind: "countdown",
      title: "FREEZE",
      to: "2027-01-01T00:00:00Z",
      done: "open",
      caption: "until offsite",
    },
  },
};

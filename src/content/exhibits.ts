import { PHOTOS } from "@/content/photography";
import { SKETCHES } from "@/content/sketchbook";

export type Room = "main" | "sketchbook" | "photography";

export type ExhibitLink = { href: string; label: string };

export type ExhibitMedia =
  | {
      kind: "image";
      src: string;
      width: number;
      height: number;
      alt: string;
    }
  | {
      kind: "video";
      sources: { src: string; type: string }[];
      poster?: string;
      width: number;
      height: number;
      label: string;
    }
  | {
      kind: "flip";
      frames: [string, string];
      width: number;
      height: number;
      alt: string;
    }
  | {
      kind: "changelog";
      version: string;
      lines: string[];
    };

export type Exhibit = {
  id: string;
  title: string;
  date?: string;
  live?: ExhibitLink;
  project?: string;
  series?: string;
  rooms: Room[];
  featured?: boolean;
  media: ExhibitMedia;
};

export type ArticleExhibit = {
  article: string;
  explains: string[];
  rooms: Room[];
  featured?: boolean;
};

export const ROOMS: Record<
  Room,
  { title: string; href: string; description: string; intro?: string[] }
> = {
  main: {
    title: "Work",
    href: "/work",
    description: "The main exhibition: product, interface and brand work.",
  },
  sketchbook: {
    title: "Sketchbook",
    href: "/work/sketchbook",
    description: "Pages from my sketchbooks: ideas worked out by hand first.",
    intro: [
      "Draw to discover what you see, write to discover what you think.",
      "Nothing will ever beat putting pen to paper, so I carry an A6 Cicero notebook with me at all times. Every time an opportunity to sit down and focus comes up, I push an A5 ring notebook close to me too.",
    ],
  },
  photography: {
    title: "Photography",
    href: "/work/photography",
    description: "Photographs taken with digital and film cameras.",
  },
};

const MUSEUMS: ExhibitLink = {
  href: "https://servico-museu.vercel.app",
  label: "servico-museu.vercel.app",
};

const LINKS_AMARELOS: ExhibitLink = {
  href: "https://linksamarelos.com",
  label: "linksamarelos.com",
};

const ONDAS_AMARELAS: ExhibitLink = {
  href: "https://open.spotify.com/show/043Gs7eyY2KOlotEWSTSxB",
  label: "Spotify",
};

const FIN: ExhibitLink = {
  href: "https://www.behance.net/gallery/123564241/Fin-Financas-Jovem",
  label: "Behance",
};

const MP4 = "video/mp4";
const AV1 = (level: string) => `video/mp4; codecs="av01.0.${level}.08"`;

const WORK: Exhibit[] = [
  {
    id: "color-of-water-plates",
    title: "Fishy components",
    date: "2026-09-15",
    project: "color-of-water",
    rooms: ["main"],
    featured: true,
    media: {
      kind: "image",
      src: "/work/color-of-water-plates.png",
      width: 1920,
      height: 1080,
      alt: "Six name plates from The color of water, each wearing a different palette: dark slabs, a glowing blue pill, a white card on yellow, a pale gradient, every one holding a portrait, a name and a role.",
    },
  },
  {
    id: "color-of-water-copy",
    title: "Copy palette component",
    date: "2026-09-15",
    project: "color-of-water",
    rooms: ["main"],
    featured: true,
    media: {
      kind: "video",
      sources: [{ src: "/work/color-of-water-copy.mp4", type: MP4 }],
      width: 1080,
      height: 1080,
      label:
        "A screen recording from The color of water: a palette of sea colours, and the Copy palette button settling into Copied in place before it returns.",
    },
  },
  {
    id: "servico-museu-interactions",
    title: "In Service of Museums",
    date: "2026-08",
    live: MUSEUMS,
    project: "museums",
    rooms: ["main"],
    featured: true,
    media: {
      kind: "video",
      sources: [{ src: "/work/servico-museu-interactions.mp4", type: MP4 }],
      width: 1920,
      height: 1080,
      label:
        "Close-ups of the In Service of Museums site: the Ler resumo button pressed under the cursor, the two reading buttons with their word counts, a search that finds a museum in the research list as you type, and sidenotes that sit beside the paragraph they annotate.",
    },
  },
  {
    id: "museu-mark",
    title: "Icon for research thesis",
    date: "2026-08",
    live: MUSEUMS,
    project: "museums",
    rooms: ["main"],
    media: {
      kind: "video",
      sources: [{ src: "/work/museu-mark.mp4", type: MP4 }],
      width: 1080,
      height: 1080,
      label:
        "The mark for In Service of Museums: a white gallery frame holding a grainy field of blue and yellow that rises and settles like a slow wave.",
    },
  },
  {
    id: "stone",
    title: "Stone Co. Product Designer",
    date: "2026-03",
    project: "stone",
    rooms: ["main"],
    media: {
      kind: "changelog",
      version: "2022 — 2026",
      lines: [
        "launched: App Store for terminals, Pix NFC flow, Ticketing app, News automation",
        "improved: Pre-authorization app, Activation flow, Sale cancelation flow",
      ],
    },
  },
  {
    id: "stone-store",
    title: "Stone Terminal Store",
    date: "2023",
    project: "stone",
    rooms: ["main"],
    featured: true,
    media: {
      kind: "video",
      sources: [{ src: "/work/stone-store.mp4", type: MP4 }],
      width: 1920,
      height: 1080,
      label:
        "A green slide typed out line by line: Stone's 212 partners processed R$ 9.6M a month, yet their apps only reached merchants through a sales visit and a manual unlock. Then the self-serve app store on a green payment terminal, its screen moving from browsing to installing and opening an app. Then the result: in six months, 40% of partners had moved to the self-serve store, with 33 apps live.",
    },
  },
  {
    id: "stone-talk",
    title: "Presenting the App Store on Stone Stage",
    date: "2024",
    project: "stone",
    rooms: ["main"],
    featured: true,
    media: {
      kind: "image",
      src: "/work/stone-talk.jpg",
      width: 3024,
      height: 4032,
      alt: "Nicoly Dandara speaking into a microphone beside a projected slide of a Stone payment terminal running the app store.",
    },
  },
  {
    id: "links-amarelos",
    title: "linksamarelos.com",
    date: "2025",
    live: LINKS_AMARELOS,
    project: "amarelos",
    rooms: ["main"],
    featured: true,
    media: {
      kind: "video",
      sources: [
        { src: "/work/links-amarelos.av1.mp4", type: AV1("12M") },
        { src: "/work/links-amarelos.mp4", type: MP4 },
      ],
      width: 2688,
      height: 1512,
      label:
        "A screen recording of the links amarelos site: a yellow page promising monthly recommendations of texts, books, documentaries and things with no taxonomy yet.",
    },
  },
  {
    id: "caiu-na-rede",
    title: "caiu na rede, é link!",
    date: "2025",
    live: LINKS_AMARELOS,
    project: "amarelos",
    rooms: ["main"],
    media: {
      kind: "video",
      sources: [{ src: "/work/caiu-na-rede.mp4", type: MP4 }],
      width: 1080,
      height: 1350,
      label:
        "A white wireframe net floating on yellow, between two pale bands where caiu na rede, é link! scrolls past. A small ball drops into it, the net stretches into a deep funnel around the ball, then shrinks away.",
    },
  },
  {
    id: "cascata-erro",
    title: "Recommendation cascade",
    date: "2025",
    live: LINKS_AMARELOS,
    project: "amarelos",
    rooms: ["main"],
    media: {
      kind: "video",
      sources: [{ src: "/work/cascata-erro.mp4", type: MP4 }],
      width: 1080,
      height: 1920,
      label:
        "A vertical story on yellow where a recomendação especial pop-up, recommending onde dá pra conversar, opens and cascades into stacks of copies, more stacks spawning until they fill the screen.",
    },
  },
  {
    id: "ondas-amarelas-covers",
    title: "ondas amarelas covers",
    date: "2025",
    live: ONDAS_AMARELAS,
    project: "amarelos",
    rooms: ["main"],
    featured: true,
    media: {
      kind: "video",
      sources: [{ src: "/work/ondas-amarelas.mp4", type: MP4 }],
      width: 1080,
      height: 1080,
      label:
        "The ondas amarelas logo, a yellow circle with a pixel cursor, then the covers of episodes 9, 1 and 3 and the show cover, one after another on pale yellow.",
    },
  },
  {
    id: "obsidian-graph",
    title: "Personal Obsidian graph",
    date: "2026-09-27",
    project: "obsidian",
    rooms: ["main"],
    media: {
      kind: "image",
      src: "/work/obsidian-graph.png",
      width: 2000,
      height: 1446,
      alt: "The graph view of a personal Obsidian vault: thousands of notes as pale dots, linked into one dense sphere with a few bright hubs.",
    },
  },
  {
    id: "serase",
    title: "Serase",
    date: "2020",
    project: "serase",
    rooms: ["main"],
    media: {
      kind: "video",
      sources: [{ src: "/work/serase.mp4", type: MP4 }],
      width: 1920,
      height: 1080,
      label:
        "Four phones drifting past in a loop, each showing a screen of Serase, a personal finance app: its dollar-sign icon, a form adding R$ 100,00 of income, weekly analyses with a calendar of spending, and a home screen with the balance and recent transactions.",
    },
  },
  {
    id: "fin-challenge",
    title: "Fin onboarding, design challenge",
    date: "2021",
    live: FIN,
    project: "fin",
    rooms: ["main"],
    media: {
      kind: "video",
      sources: [{ src: "/work/fin-challenge.mp4", type: MP4 }],
      width: 1920,
      height: 1080,
      label:
        "Five phones showing the onboarding of Fin, a personal finance app, slide into a staggered row from above and below: choosing a sign-up method, creating a password, entering bank login details, choosing a bank and a bank account connected. As they slide away, text rises in: #1 Winner of Junior UI/UX Designer challenge. Fin's onboarding, designed in 15 days and awarded by a committee of industry names.",
    },
  },
];

export const EXHIBITS: Exhibit[] = [...WORK, ...PHOTOS, ...SKETCHES];

export const ARTICLE_EXHIBITS: ArticleExhibit[] = [
  {
    article: "the-color-of-water",
    explains: ["color-of-water"],
    rooms: [],
  },
  {
    article: "museums-and-websites",
    explains: ["museums"],
    rooms: [],
  },
  {
    article: "obsidian",
    explains: ["obsidian"],
    rooms: [],
  },
];

import type { Exhibit } from "@/content/exhibits";

export type Series = {
  id: string;
  title: string;
  lines: string[];
};

const GALAXY = "Galaxy S22";
const CYBERSHOT = "Cyber-shot DSC-W90";

export const SERIES: Series[] = [
  {
    id: "polis",
    title: "Polis",
    lines: [
      "Grandiose cities, from small point of views",
      `${GALAXY} and ${CYBERSHOT}`,
      "Lightroom edit",
    ],
  },
  {
    id: "looze",
    title: "Looze",
    lines: [
      "You know time crawls on when you’re waiting for the song to start",
      `${CYBERSHOT} and ${GALAXY}`,
    ],
  },
  {
    id: "ways-of-up",
    title: "Ways of Up",
    lines: ["Beautiful staircases", GALAXY],
  },
  {
    id: "sao-paulo",
    title: "São Paulo",
    lines: ["A cidade de São Paulo", GALAXY],
  },
  {
    id: "98",
    title: "98'",
    lines: [
      "When the world looks as infinite as the screen of your computer",
      CYBERSHOT,
    ],
  },
];

const photo = (
  series: string,
  n: number,
  {
    title,
    date,
    height,
    alt,
  }: Pick<Exhibit, "title" | "date"> & {
    height: number;
    alt: string;
  },
): Exhibit => ({
  id: `${series}-${n}`,
  title,
  date,
  series,
  rooms: ["photography"],
  media: {
    kind: "image",
    src: `/work/photography/${series}-${n}.webp`,
    width: 1000,
    height,
    alt,
  },
});

const PORTRAIT = 1333;

export const PHOTOS: Exhibit[] = [
  photo("98", 1, {
    title: "Firelight",
    date: "2023-09-17",
    height: 1492,
    alt: "A tall concrete floodlight pole crowned with lamps, against a deep blue sky with a few clouds low in the frame.",
  }),
  photo("98", 2, {
    title: "Lionheart",
    date: "2023-09-17",
    height: 1334,
    alt: "A boy in red at the far left edge of a dry grass hill, the floodlight pole standing at the right under a wide blue sky.",
  }),
  photo("98", 3, {
    title: "Kings",
    date: "2023-09-17",
    height: PORTRAIT,
    alt: "Three people on the crest of a grassy hill flying kites, two kites small against a blue sky with low clouds.",
  }),
  photo("polis", 1, {
    title: "Estação da Luz",
    date: "2025-05-28",
    height: PORTRAIT,
    alt: "Black and white view up into an iron and glass train station roof, its arched trusses running towards a bright end window.",
  }),
  photo("polis", 2, {
    title: "Helena",
    date: "2024-03-13",
    height: PORTRAIT,
    alt: "A blue-grey office tower with a rounded corner of curved window bands, seen from below against a clear blue sky.",
  }),
  photo("polis", 3, {
    title: "Cosmococa",
    date: "2024-01-09",
    height: PORTRAIT,
    alt: "Looking up between dark stone walls at a bright, cloud-streaked sky.",
  }),
  photo("polis", 4, {
    title: "Edifício Argélia",
    date: "2024-05-18",
    height: PORTRAIT,
    alt: "Apartment blocks at dusk, a small moon above the rooftops and the last orange light on a tower at the right.",
  }),
  photo("polis", 5, {
    title: "CCCBB",
    date: "2024-01-15",
    height: PORTRAIT,
    alt: "Looking straight up a warm-toned courtyard to a glass skylight hung with rows of white panels.",
  }),
  photo("polis", 6, {
    title: "Delrey",
    date: "2024-05-18",
    height: PORTRAIT,
    alt: "The top of a pale tower catching orange evening light beside a speckled apartment block, under a clear blue sky.",
  }),
  photo("looze", 1, {
    title: "Lolla",
    date: "2024-03-26",
    height: PORTRAIT,
    alt: "Black and white portrait of a man in a cap, glasses and rain poncho, standing still in a dense festival crowd.",
  }),
  photo("looze", 2, {
    title: "The Driver Era",
    date: "2025-05-11",
    height: PORTRAIT,
    alt: "Black and white concert: a singer pointing from a smoky stage while phones and hands rise from the crowd in silhouette.",
  }),
  photo("looze", 3, {
    title: "23:48",
    date: "2024-03-26",
    height: PORTRAIT,
    alt: "A blurred night view of the Lollapalooza sign, yellow and teal, glowing above a dark structure.",
  }),
  photo("looze", 4, {
    title: "Record",
    date: "2024-03-26",
    height: PORTRAIT,
    alt: "A wall of album covers behind a face moving too fast for the shutter, all soft and grainy.",
  }),
  photo("ways-of-up", 1, {
    title: "Wooden",
    date: "2024-02-28",
    height: PORTRAIT,
    alt: "Looking down an oval wooden stairwell, turned balusters circling a pale floor far below.",
  }),
  photo("ways-of-up", 2, {
    title: "Turn",
    date: "2023-11-28",
    height: 1336,
    alt: "Black and white curving terrazzo staircase between plain walls, a handrail climbing towards a small bright window.",
  }),
  photo("ways-of-up", 3, {
    title: "Spiral",
    date: "2024-06-12",
    height: PORTRAIT,
    alt: "A wooden spiral staircase with a brass rail seen from above, sunlight across a herringbone floor.",
  }),
  photo("sao-paulo", 1, {
    title: "Above",
    date: "2023-11-28",
    height: PORTRAIT,
    alt: "Black and white view through an aeroplane window into grey fog, the curve of an engine glowing at the bottom.",
  }),
  photo("sao-paulo", 2, {
    title: "Mute",
    date: "2023-11-28",
    height: PORTRAIT,
    alt: "Black and white close view of an aeroplane engine cowling under a dark, cloudy sky.",
  }),
  photo("sao-paulo", 3, {
    title: "MIS",
    date: "2023-11-28",
    height: PORTRAIT,
    alt: "Black and white museum case of vintage cameras, a Canon rangefinder and a Kodak Retina Reflex IV lit from below.",
  }),
];

import {
  ARTICLE_EXHIBITS,
  EXHIBITS,
  type ExhibitLink,
  type ExhibitMedia,
  ROOMS,
  type Room,
} from "@/content/exhibits";
import { SERIES } from "@/content/photography";
import { loadPostList } from "@/lib/writing/posts";

export const COLUMNS = 3;

const CAPTION_SHARE = 0.12;
const WORDS_SHARE = 0.55;
const SIGN_SHARE = 0.25;

export type Tile = {
  id: string;
  title: string;
  when: string;
  live?: ExhibitLink;
  read?: string;
  media: ExhibitMedia;
  related: string[];
  rank: number;
};

type Draft = Omit<Tile, "related" | "rank"> & {
  date: string;
  groups: string[];
};

const YEAR_ONLY = /^\d{4}$/;
const YEAR_AND_MONTH = 7;

const SHORT_MONTH = new Intl.DateTimeFormat("en-US", {
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

export const formatWhen = (date: string) =>
  YEAR_ONLY.test(date)
    ? date
    : SHORT_MONTH.format(
        new Date(`${date.slice(0, YEAR_AND_MONTH)}-01T00:00:00Z`),
      );

const height = (media: ExhibitMedia) =>
  (media.kind === "changelog" ? WORDS_SHARE : media.height / media.width) +
  CAPTION_SHARE;

export function deal(tiles: readonly Tile[], signed: boolean) {
  const stacks: string[][] = Array.from({ length: COLUMNS }, () => []);
  const filled = Array.from({ length: COLUMNS }, () => 0);
  if (signed) filled[COLUMNS - 1] = SIGN_SHARE;
  for (const tile of tiles) {
    const shortest = filled.indexOf(Math.min(...filled));
    stacks[shortest].push(tile.id);
    filled[shortest] += height(tile.media);
  }
  return stacks;
}

type Filter = { featured?: boolean; series?: string };

async function drafts(
  room: Room,
  { featured = false, series }: Filter,
): Promise<Draft[]> {
  const wanted = (entry: {
    rooms: Room[];
    featured?: boolean;
    series?: string;
  }) =>
    entry.rooms.includes(room) &&
    (!featured || entry.featured === true) &&
    entry.series === series;

  const works = EXHIBITS.filter((entry) => wanted(entry)).map(
    ({ id, title, date, live, project, media }) => ({
      id,
      title,
      date,
      when: formatWhen(date),
      live,
      media,
      groups: project ? [project] : [],
    }),
  );

  const articles = series
    ? []
    : ARTICLE_EXHIBITS.filter((entry) => wanted(entry));
  if (articles.length === 0) return works;

  const list = await loadPostList();
  const posts = new Map(list.map(({ slug, meta }) => [slug, meta]));

  const written = articles.flatMap(({ article, explains }) => {
    const meta = posts.get(article);
    if (!meta) return [];
    return [
      {
        id: `article-${article}`,
        title: meta.title,
        date: meta.date,
        when: formatWhen(meta.date),
        read: `/writing/${article}`,
        media: {
          kind: "image" as const,
          src: `/writing/og/${article}.png`,
          width: 1200,
          height: 630,
          alt: `${meta.title} — ${meta.deck}`,
        },
        groups: explains,
      },
    ];
  });

  return [...works, ...written];
}

export async function loadExhibition(room: Room, filter: Filter = {}) {
  const found = await drafts(room, filter);
  const sorted = found.toSorted((a, b) => b.date.localeCompare(a.date));

  const tiles: Tile[] = sorted.map(
    ({ id, title, when, live, read, media, groups }, rank) => ({
      id,
      title,
      when,
      live,
      read,
      media,
      rank,
      related: sorted
        .filter(
          (other) =>
            other.id !== id &&
            other.groups.some((group) => groups.includes(group)),
        )
        .map((other) => other.id),
    }),
  );

  return { tiles, columns: deal(tiles, filter.featured === true) };
}

export const roomsWithWork = (): Room[] =>
  (Object.keys(ROOMS) as Room[]).filter(
    (room) =>
      EXHIBITS.some((entry) => entry.rooms.includes(room)) ||
      ARTICLE_EXHIBITS.some((entry) => entry.rooms.includes(room)),
  );

const newestIn = (series: string) =>
  EXHIBITS.filter((entry) => entry.series === series)
    .map((entry) => entry.date)
    .toSorted()
    .at(-1) ?? "";

export const seriesIn = (room: Room) =>
  SERIES.filter((series) =>
    EXHIBITS.some(
      (entry) => entry.series === series.id && entry.rooms.includes(room),
    ),
  ).toSorted((a, b) => newestIn(b.id).localeCompare(newestIn(a.id)));

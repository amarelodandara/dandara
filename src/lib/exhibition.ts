import {
  ARTICLE_EXHIBITS,
  EXHIBITS,
  type ExhibitLink,
  type ExhibitMedia,
  ROOMS,
  type Room,
} from "@/content/exhibits";
import type { Tag } from "@/badges/tags";
import { SERIES } from "@/content/photography";
import { loadWritingList } from "@/lib/writing/posts";

export const COLUMNS = 3;

const CAPTION_SHARE = 0.12;
const WORDS_SHARE = 0.55;
const SIGN_SHARE = 0.25;
const BADGES_SHARE = 2 / 3;

const ALPHABETICAL = new Intl.Collator("en", {
  sensitivity: "base",
  numeric: true,
});

const EXHIBITED_TAGS: ReadonlySet<Tag> = new Set(["design", "engineering"]);

export type Tile = {
  id: string;
  title: string;
  when?: string;
  live?: ExhibitLink;
  read?: string;
  readAt?: string;
  media: ExhibitMedia;
  related: string[];
  rank: number;
};

type Draft = Omit<Tile, "related" | "rank"> & {
  date?: string;
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

const share = (media: ExhibitMedia) => {
  if (media.kind === "changelog") return WORDS_SHARE;
  if (media.kind === "badges") return BADGES_SHARE;
  return media.height / media.width;
};

const height = (media: ExhibitMedia) => share(media) + CAPTION_SHARE;

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
      when: date ? formatWhen(date) : undefined,
      live,
      media,
      groups: project ? [project] : [],
    }),
  );

  if (room !== "main" || series) return works;

  const exhibited = new Map(
    ARTICLE_EXHIBITS.map((entry) => [entry.article, entry]),
  );
  const writing = await loadWritingList();
  const written = writing
    .filter(({ tags }) => tags.some((tag) => EXHIBITED_TAGS.has(tag)))
    .filter(({ badge }) => !featured || exhibited.get(badge)?.featured === true)
    .map(({ badge, title, date, href, venue }) => ({
      id: `article-${badge}`,
      title: title.split(":", 1)[0],
      date,
      when: formatWhen(date),
      read: href,
      readAt: venue,
      media: { kind: "badges" as const, slug: badge },
      groups: exhibited.get(badge)?.explains ?? [],
    }));

  return [...works, ...written];
}

export async function loadExhibition(room: Room, filter: Filter = {}) {
  const found = await drafts(room, filter);
  const sorted = found.toSorted(
    room === "main"
      ? (a, b) => ALPHABETICAL.compare(a.title, b.title)
      : (a, b) => (b.date ?? "").localeCompare(a.date ?? ""),
  );

  const tiles: Tile[] = sorted.map(
    ({ id, title, when, live, read, readAt, media, groups }, rank) => ({
      id,
      title,
      when,
      live,
      read,
      readAt,
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
  (Object.keys(ROOMS) as Room[]).filter((room) =>
    EXHIBITS.some((entry) => entry.rooms.includes(room)),
  );

const newestIn = (series: string) =>
  EXHIBITS.filter((entry) => entry.series === series)
    .map((entry) => entry.date ?? "")
    .toSorted()
    .at(-1) ?? "";

export const seriesIn = (room: Room) =>
  SERIES.filter((series) =>
    EXHIBITS.some(
      (entry) => entry.series === series.id && entry.rooms.includes(room),
    ),
  ).toSorted((a, b) => newestIn(b.id).localeCompare(newestIn(a.id)));

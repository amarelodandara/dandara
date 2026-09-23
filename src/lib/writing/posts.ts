import type { ComponentType } from "react";
import { ELSEWHERE } from "@/content/elsewhere";
import type { ArticleNote } from "@/lib/article-notes";

export type PostMeta = {
  title: string;
  deck: string;
  searchTitle?: string;
  description?: string;
  blurb: string;
  date: string;
};

export type Post = {
  default: ComponentType;
  meta: PostMeta;
  notes: ArticleNote[];
};

const POSTS: Record<string, () => Promise<unknown>> = {
  "museums-and-websites": () =>
    import("@/content/writing/museums-and-websites.mdx"),
  "the-color-of-water": () =>
    import("@/content/writing/the-color-of-water.mdx"),
};

export const SLUGS = Object.keys(POSTS);

export async function loadPost(slug: string): Promise<Post | null> {
  const load = POSTS[slug];
  if (!load) return null;
  return (await load()) as Post;
}

export async function loadPostList() {
  const listed = await Promise.all(
    Object.entries(POSTS).map(async ([slug, load]) => {
      const { meta } = (await load()) as Post;
      return { slug, meta };
    }),
  );

  return listed.toSorted((a, b) => b.meta.date.localeCompare(a.meta.date));
}

export async function loadWritingList() {
  const posts = await loadPostList();
  const here = posts.map(({ slug, meta }) => ({
    key: slug,
    title: meta.title,
    deck: meta.deck,
    date: meta.date,
    href: `/writing/${slug}`,
    venue: undefined,
  }));
  const away = ELSEWHERE.map((piece) => ({ key: piece.href, ...piece }));

  return [...here, ...away].toSorted((a, b) => b.date.localeCompare(a.date));
}

const READABLE_DATE = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

const READABLE_MONTH = new Intl.DateTimeFormat("en-GB", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

const asDate = (date: string) => new Date(`${date}T00:00:00Z`);

export const formatPostDate = (date: string) =>
  READABLE_DATE.format(asDate(date));

export const formatPostMonth = (date: string) =>
  READABLE_MONTH.format(asDate(date));

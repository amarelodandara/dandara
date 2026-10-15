import type { MetadataRoute } from "next";
import { ROOMS } from "@/content/exhibits";
import { roomsWithWork } from "@/lib/exhibition";
import { SITE_URL } from "@/lib/site";
import { loadPostList } from "@/lib/writing/posts";

const MAIN_ROOM_PRIORITY = 0.9;
const THEMED_ROOM_PRIORITY = 0.6;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await loadPostList();
  const newest = posts[0]?.meta.date;

  return [
    {
      url: SITE_URL,
      lastModified: newest,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/writing`,
      lastModified: newest,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/changelog`,
      changeFrequency: "weekly",
      priority: 0.3,
    },
    ...roomsWithWork().map((room) => ({
      url: `${SITE_URL}${ROOMS[room].href}`,
      changeFrequency: "monthly" as const,
      priority: room === "main" ? MAIN_ROOM_PRIORITY : THEMED_ROOM_PRIORITY,
    })),
    ...posts.map(({ slug, meta }) => ({
      url: `${SITE_URL}/writing/${slug}`,
      lastModified: meta.date,
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
  ];
}

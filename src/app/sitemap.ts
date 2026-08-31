import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { loadPostList } from "@/lib/writing/posts";

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
    ...posts.map(({ slug, meta }) => ({
      url: `${SITE_URL}/writing/${slug}`,
      lastModified: meta.date,
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
  ];
}

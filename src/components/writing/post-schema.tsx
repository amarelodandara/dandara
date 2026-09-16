import { NAME, SITE_URL } from "@/lib/site";
import type { PostMeta } from "@/lib/writing/posts";

export function PostSchema({ slug, meta }: { slug: string; meta: PostMeta }) {
  const url = `${SITE_URL}/writing/${slug}`;
  const posting = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: meta.title,
    description: meta.description ?? meta.deck,
    datePublished: meta.date,
    inLanguage: "en",
    url,
    mainEntityOfPage: url,
    image: `${SITE_URL}/writing/og/${slug}.png`,
    author: {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: NAME,
      url: SITE_URL,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(posting).replaceAll("<", String.raw`\u003c`),
      }}
    />
  );
}

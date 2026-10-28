import type { Metadata } from "next";
import { LINKS } from "@/links/data";
import { Rolodex } from "@/links/rolodex";
import { CARD, CARD_VIDEO, NAME } from "@/lib/site";

const description = "The references I keep reaching for, filed A to Z.";

export const metadata: Metadata = {
  title: "Links",
  description,
  alternates: {
    canonical: "/links",
    types: { "application/rss+xml": "/links/feed.xml" },
  },
  openGraph: {
    type: "website",
    url: "/links",
    siteName: NAME,
    locale: "en_US",
    title: "Links",
    description,
    images: [CARD],
    videos: [CARD_VIDEO],
  },
  twitter: { title: "Links", description, images: [CARD] },
};

export default function LinksPage() {
  return (
    <main className="flex w-full flex-1 flex-col">
      <h1 className="sr-only">Links: {LINKS.length} references</h1>
      <Rolodex
        links={LINKS.map(({ slug, title, url, tag, by, note }) => ({
          slug,
          title,
          url,
          tag,
          by,
          note,
        }))}
      />
    </main>
  );
}

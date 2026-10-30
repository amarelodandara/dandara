import type { Link } from "./link";
import type { Kind } from "./kinds";
import { SITE_URL } from "@/lib/site";

const TYPE: Record<Kind, string> = {
  link: "CreativeWork",
  book: "Book",
  quote: "Quotation",
  movie: "Movie",
  person: "Person",
};

const item = ({ title, url, tag, by }: Link) => ({
  "@type": TYPE[tag],
  name: title,
  ...(url ? { url } : {}),
  ...(by && tag !== "person" ? { creditText: by } : {}),
});

export function LinksSchema({
  links,
  description,
}: {
  links: Link[];
  description: string;
}) {
  const page = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Links",
    description,
    url: `${SITE_URL}/links`,
    author: { "@id": `${SITE_URL}/#person` },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: links.length,
      itemListOrder: "https://schema.org/ItemListOrderAscending",
      itemListElement: links.map((link, at) => ({
        "@type": "ListItem",
        position: at + 1,
        item: item(link),
      })),
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(page).replaceAll("<", String.raw`\u003c`),
      }}
    />
  );
}

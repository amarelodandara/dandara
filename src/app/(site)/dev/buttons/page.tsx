import { notFound } from "next/navigation";
import { Playground } from "./playground";
import { LINKS } from "@/links/data";

const SAMPLES = 5;

export default function Buttons() {
  if (process.env.NODE_ENV !== "development") notFound();

  const withBoth = LINKS.filter((link) => link.url && link.by);
  const { slug, title, url, tag, by, note } = withBoth[0];

  return (
    <div data-links className="contents">
      <Playground
        link={{ slug, title, url, tag, by, note }}
        refs={withBoth
          .slice(0, SAMPLES)
          .map(({ slug, title, url, tag, by }) => ({
            slug,
            title,
            url,
            tag,
            by,
          }))}
      />
    </div>
  );
}

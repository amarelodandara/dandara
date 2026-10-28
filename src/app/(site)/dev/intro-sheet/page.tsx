import { notFound } from "next/navigation";
import { Tuner } from "./tuner";
import { LINKS } from "@/links/data";

export default function IntroSheet() {
  if (process.env.NODE_ENV !== "development") notFound();

  const index = Math.max(
    0,
    LINKS.findIndex((link) => link.url && link.by),
  );
  const { slug, title, url, tag, by, note } = LINKS[index];

  return (
    <Tuner
      count={LINKS.length}
      link={{ slug, title, url, tag, by, note }}
      index={index}
    />
  );
}

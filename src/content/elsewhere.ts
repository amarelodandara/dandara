import type { Tag } from "@/badges/tags";

export type Elsewhere = {
  slug: string;
  title: string;
  deck: string;
  href: string;
  venue: string;
  date: string;
  tags: Tag[];
  words: number;
};

export const ELSEWHERE: Elsewhere[] = [
  {
    slug: "the-designer-archetype",
    title: "The Designer archetype",
    deck: "There is a little bit of us in everyone.",
    href: "https://medium.com/design-bootcamp/the-designer-archetype-b3027b2ec995?sharedUserId=nicolydandara",
    venue: "UX Collective",
    date: "2026-09-22",
    tags: ["design", "career"],
    words: 1500,
  },
];

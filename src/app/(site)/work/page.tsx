import type { Metadata } from "next";
import { ExhibitionRoom } from "@/components/exhibition-room";
import { ROOMS } from "@/content/exhibits";
import { CARD, NAME } from "@/lib/site";

const { title, description } = ROOMS.main;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/work" },
  openGraph: {
    type: "website",
    url: "/work",
    siteName: NAME,
    locale: "en_US",
    title,
    description,
    images: [CARD],
  },
  twitter: { title, description, images: [CARD] },
};

export default function WorkPage() {
  return <ExhibitionRoom room="main" />;
}

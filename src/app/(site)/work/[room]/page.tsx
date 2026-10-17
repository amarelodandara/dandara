import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExhibitionRoom } from "@/components/exhibition-room";
import { ROOMS, type Room } from "@/content/exhibits";
import { roomsWithWork } from "@/lib/exhibition";
import { CARD, FEED, NAME } from "@/lib/site";

export const dynamicParams = false;

const themed = () => roomsWithWork().filter((room) => room !== "main");

const asRoom = (slug: string): Room | null =>
  themed().find((room) => room === slug) ?? null;

export function generateStaticParams() {
  return themed().map((room) => ({ room }));
}

export async function generateMetadata({
  params,
}: PageProps<"/work/[room]">): Promise<Metadata> {
  const { room: slug } = await params;
  const room = asRoom(slug);
  if (!room) return {};
  const { title, description, href } = ROOMS[room];
  return {
    title,
    description,
    alternates: { canonical: href, types: FEED },
    openGraph: {
      type: "website",
      url: href,
      siteName: NAME,
      locale: "en_US",
      title,
      description,
      images: [CARD],
    },
    twitter: { title, description, images: [CARD] },
  };
}

export default async function ThemedRoomPage({
  params,
}: PageProps<"/work/[room]">) {
  const { room: slug } = await params;
  const room = asRoom(slug);
  if (!room) notFound();
  return <ExhibitionRoom room={room} />;
}

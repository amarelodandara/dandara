import type { Metadata } from "next";
import { NotFoundWall } from "@/components/not-found-wall";
import { BROKEN_ICON } from "@/lib/site";

export const metadata: Metadata = {
  title: "Not found",
  description: "This address does not match a page on this site.",
  icons: { icon: BROKEN_ICON },
};

export default function NotFound() {
  return <NotFoundWall />;
}

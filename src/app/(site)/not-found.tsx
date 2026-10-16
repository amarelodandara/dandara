import type { Metadata } from "next";
import { NotFoundWall } from "@/components/not-found-wall";

export const metadata: Metadata = {
  title: "Not found",
  description: "This address does not match a page on this site.",
};

export default function NotFound() {
  return <NotFoundWall />;
}

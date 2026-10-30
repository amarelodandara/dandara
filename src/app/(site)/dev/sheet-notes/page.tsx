import { notFound } from "next/navigation";
import { SheetNotes } from "./editor";
import { LINKS } from "@/links/data";

export default function SheetNotesPage() {
  if (process.env.NODE_ENV !== "development") notFound();

  return <SheetNotes links={LINKS} />;
}

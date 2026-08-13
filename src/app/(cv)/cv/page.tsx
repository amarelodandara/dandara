import { notFound } from "next/navigation";
import { CvDocument } from "@/components/cv/document";
import { loadCv } from "@/lib/cv/load";
import "./cv.css";

export default async function CvPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string; variant?: string }>;
}) {
  if (process.env.NODE_ENV !== "development") notFound();

  const { lang = "en", variant = "base" } = await searchParams;

  const doc = await loadCv(lang, variant);
  if (!doc) notFound();

  return <CvDocument doc={doc} />;
}

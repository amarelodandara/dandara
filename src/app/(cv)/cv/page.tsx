import { notFound } from "next/navigation";
import { CvDocument } from "@/components/cv/document";
import { loadCv } from "@/lib/cv/load";
import "./cv.css";

/**
 * The résumé, rendered so that Chrome can print it. Never part of the site.
 *
 * `?lang=` picks the document and `?variant=` picks which copy of it: `base`
 * for the tracked one, or the slug of a version tailored to a job posting.
 * Search params rather than a route segment, because tailored variants are
 * generated locally and git-ignored — there is nothing for a segment to
 * prerender, and a file-per-variant would mean a tracked file changing on
 * every application.
 */
export default async function CvPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string; variant?: string }>;
}) {
  // First statement, and deliberately ahead of awaiting the params: with no
  // request-time API on the reachable path, `next build` prerenders this as a
  // static 404 and production never reaches the filesystem below.
  if (process.env.NODE_ENV !== "development") notFound();

  const { lang = "en", variant = "base" } = await searchParams;

  const doc = await loadCv(lang, variant);
  if (!doc) notFound();

  return <CvDocument doc={doc} />;
}

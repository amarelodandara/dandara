import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CV",
  // Belt and braces: the route already 404s outside development, so nothing
  // should ever crawl this. Costs a line.
  robots: { index: false, follow: false },
};

/**
 * A second root, deliberately bare.
 *
 * The résumé's first reader is an applicant tracking system, not a person, and
 * every nicety the site layout provides is a way for that reading to go wrong:
 * Inter is a variable font with stylistic sets that substitute glyphs on the
 * very digits that carry dates, and a subsetted substitution is exactly what
 * breaks the PDF's ToUnicode map. So this root imports no `globals.css`, loads
 * no font, mounts no shop, and paints nothing. `cv.css` starts from white.
 *
 * Sharing a root with the site and overriding it would have been the smaller
 * diff and the worse idea — an override only holds until someone adds a rule
 * to `body`, and the failure is silent: the PDF looks right and extracts to
 * gibberish.
 */
export default function CvLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

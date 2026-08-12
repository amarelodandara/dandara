/**
 * The résumé's shape. One document, one page, five or six sections — small
 * enough that the grammar can be closed rather than general, which is the
 * point: an agent writes these files unattended, and a closed grammar is one
 * a parser can reject confidently.
 */

/** Letter for the English document, A4 for the Portuguese one. */
export type PageSize = "letter" | "a4";

export type CvLang = "en" | "pt";

export type CvMeta = {
  lang: CvLang;
  name: string;
  title: string;
  /**
   * Atoms, not a joined string. The renderer owns the separator, so changing
   * it is one edit rather than one per document — and the separator matters:
   * a middot is non-ASCII and some parsers glue it to the token beside it.
   */
  contact: string[];
  pageSize: PageSize;
};

/**
 * The two inline forms the body allows. Anything else — italics, code, images,
 * reference links — is a parse error rather than a silent passthrough, because
 * the failure mode of a passthrough is literal asterisks in a PDF a recruiter
 * reads.
 */
export type Inline =
  | { t: "text"; v: string }
  | { t: "bold"; v: string }
  | { t: "link"; v: string; href: string };

/** A job, a degree, or anything else with a heading and a date line. */
export type CvEntry = {
  heading: Inline[];
  /** Place and dates: the bare line directly under the heading. */
  meta?: string;
  bullets: Inline[][];
};

/** Prose or a bullet list that belongs to the section rather than an entry. */
export type CvBlock =
  | { t: "paragraph"; content: Inline[] }
  | { t: "bullets"; items: Inline[][] };

export type CvSection = {
  heading: string;
  /** Rendered before the entries, which is the order they are written in. */
  blocks: CvBlock[];
  entries: CvEntry[];
};

export type CvDoc = {
  meta: CvMeta;
  sections: CvSection[];
};

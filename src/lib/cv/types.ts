export type PageSize = "letter" | "a4";

export type CvLang = "en" | "pt";

export type CvMeta = {
  lang: CvLang;
  name: string;
  title: string;
  contact: string[];
  pageSize: PageSize;
};

export type Inline =
  | { t: "text"; v: string }
  | { t: "bold"; v: string }
  | { t: "link"; v: string; href: string };

export type CvEntry = {
  heading: Inline[];
  meta?: string;
  bullets: Inline[][];
};

export type CvBlock =
  | { t: "paragraph"; content: Inline[] }
  | { t: "bullets"; items: Inline[][] };

export type CvSection = {
  heading: string;
  blocks: CvBlock[];
  entries: CvEntry[];
};

export type CvDoc = {
  meta: CvMeta;
  sections: CvSection[];
};

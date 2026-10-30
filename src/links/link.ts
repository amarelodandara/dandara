import type { Kind } from "./kinds";

export type Link = {
  slug: string;
  title: string;
  url?: string;
  tag: Kind;
  by?: string;
  note?: string;
};

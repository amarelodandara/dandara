import type { Dataset } from "./fixtures";
import { LINKS } from "@/links/data";
import type { Ref } from "@/links/export";
import type { SheetLink } from "@/links/sheet";

export type RolodexSheet = {
  link: SheetLink;
  picked: boolean;
};

const sheet = (link: SheetLink, picked = false): RolodexSheet => ({
  link,
  picked,
});

const toRef = ({ slug, title, url, tag, by }: SheetLink): Ref => ({
  slug,
  title,
  url,
  tag,
  by,
});

const WORST_LINKS: SheetLink[] = [
  {
    slug: "worst-ocean",
    title:
      "Technology is an ocean. Learn to surf. But also, understand how our collective actions contribute to rising sea levels, and swim",
    tag: "quote",
    by: "Kazuyo Sejima, Ryue Nishizawa e SANAA",
  },
  {
    slug: "worst-amarante",
    title:
      "Desinstitucionalização e reforma psiquiátrica: memórias de um movimento",
    url: "https://www.scielo.br/j/csc/a/desinstitucionalizacao",
    tag: "book",
    by: "Paulo Amarante e Fernando Tenório",
    note: "Li na faculdade e voltei a ele depois do Museu da Loucura, em Barbacena: me ensinou a desconfiar.",
  },
  {
    slug: "worst-m",
    title: "M",
    url: "https://letterboxd.com/film/m/",
    tag: "movie",
    by: "Fritz Lang",
  },
  {
    slug: "worst-1984",
    title: "1984",
    url: "https://en.wikipedia.org/wiki/Nineteen_Eighty-Four",
    tag: "book",
    by: "George Orwell",
  },
  {
    slug: "worst-pasted-url",
    title:
      "medium.com/design-bootcamp/por-que-bom-o-suficiente-e-suficiente-8f3a2c1b9d0e",
    url: "https://medium.com/design-bootcamp/por-que-bom-o-suficiente-e-suficiente-8f3a2c1b9d0e",
    tag: "link",
  },
  {
    slug: "worst-ocio",
    title: "Ócio criativo",
    url: "https://www.amazon.com.br/dp/8575421123",
    tag: "book",
    by: "Domenico De Masi",
  },
  {
    slug: "worst-person",
    title: "Aleksandra Wiśniewska-Kowalczyk",
    url: "https://wisniewska-kowalczyk.example.com",
    tag: "person",
  },
  {
    slug: "worst-ze",
    title: "Zé Pereira",
    tag: "quote",
    note: "Desinstitucionalização",
  },
];

const DEMO_SHEETS = 6;
const PICK_EVERY = 3;

const rolodex = (links: SheetLink[], picked: (index: number) => boolean) => ({
  sheets: links.map((link, index) => sheet(link, picked(index))),
  refs: links.map((link) => toRef(link)),
});

export function rolodexFor(dataset: Dataset) {
  if (dataset === "worst")
    return rolodex(WORST_LINKS, (index) => index % PICK_EVERY === 0);
  if (dataset === "empty") return rolodex([], () => false);
  if (dataset === "one") return rolodex(LINKS.slice(0, 1), () => true);
  return rolodex(LINKS.slice(0, DEMO_SHEETS), (index) => index === 1);
}

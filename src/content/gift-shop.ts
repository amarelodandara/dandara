import type { Format } from "@/links/export";
import { SITE_URL } from "@/lib/site";

type Common = {
  id: string;
  title: string;
};

export type GiftShopItem = Common &
  (
    | {
        kind: "file";
        meta: string;
        href: string;
        download: string;
        preview?: { src: string; width: number; height: number; alt: string };
      }
    | { kind: "copy"; meta: string; text: string }
    | { kind: "copy-file"; meta: string; href: string }
    | { kind: "swatch"; hex: string; fill: string }
    | { kind: "badge"; slug: string }
    | { kind: "picked"; meta: string; format: Format }
  );

export type GiftShopSection = {
  id: string;
  title?: string;
  counted?: "picked" | "all";
  items: GiftShopItem[];
};

export const amareloSection: GiftShopSection = {
  id: "amarelo",
  items: [
    {
      kind: "swatch",
      id: "amarelo",
      title: "Amarelo Dandara",
      hex: "#FFCC00",
      fill: "bg-cadmium-400",
    },
  ],
};

export const ticketSection = (
  slug: string,
  title: string,
): GiftShopSection => ({
  id: "ticket",
  items: [{ kind: "badge", id: "ticket", title, slug }],
});

export const feedSection: GiftShopSection = {
  id: "feed",
  title: "Reading",
  items: [
    {
      kind: "copy",
      id: "rss",
      title: "RSS feed",
      meta: "Paste it into your reader",
      text: `${SITE_URL}/feed.xml`,
    },
  ],
};

export const linksSections: GiftShopSection[] = [
  {
    id: "links-hung",
    title: "Your selection",
    counted: "picked",
    items: [
      {
        kind: "picked",
        id: "hung-checklist",
        title: "Markdown",
        meta: "Good for Notion, Obsidian, Todoist",
        format: "markdown",
      },
      {
        kind: "picked",
        id: "hung-bookmarks",
        title: "HTML",
        meta: "Good for Shiori, Raindrop, any browser",
        format: "bookmarks",
      },
      {
        kind: "picked",
        id: "hung-csv",
        title: "CSV",
        meta: "Good for Notion, Capacities",
        format: "csv",
      },
    ],
  },
  {
    id: "links-all",
    title: "The whole rolodex",
    counted: "all",
    items: [
      {
        kind: "copy-file",
        id: "links-md",
        title: "Markdown",
        meta: "Good for Notion, Obsidian, Todoist",
        href: "/links/links.md",
      },
      {
        kind: "file",
        id: "links-bookmarks",
        title: "HTML",
        meta: "Good for Shiori, Raindrop, any browser",
        href: "/links/bookmarks.html",
        download: "dandara-bookmarks.html",
      },
      {
        kind: "file",
        id: "links-csv",
        title: "CSV",
        meta: "Good for Notion, Capacities",
        href: "/links/links.csv",
        download: "dandara-links.csv",
      },
    ],
  },
];

export const giftShopSections: GiftShopSection[] = [
  {
    id: "documents",
    title: "Documents",
    items: [
      {
        kind: "file",
        id: "cv-en",
        title: "Resumé",
        meta: "PDF · English",
        href: "/gift-shop/cv-en.pdf",
        download: "Nicoly_Dandara_ProductDesigner.pdf",
      },
      {
        kind: "file",
        id: "cv-pt",
        title: "Currículo",
        meta: "PDF · Português",
        href: "/gift-shop/cv-pt.pdf",
        download: "Nicoly_Dandara_Designer_Produto.pdf",
      },
      {
        kind: "file",
        id: "vcard",
        title: "Contact card",
        meta: "vCard",
        href: "/gift-shop/nicoly-dandara.vcf",
        download: "nicoly-dandara.vcf",
      },
    ],
  },
  {
    id: "press",
    title: "Press",
    items: [
      {
        kind: "file",
        id: "portrait",
        title: "Portrait",
        meta: "JPEG",
        href: "/gift-shop/portrait.jpg",
        download: "Nicoly_Dandara_Portrait.jpg",
        preview: {
          src: "/gift-shop/portrait.jpg",
          width: 723,
          height: 885,
          alt: "Nicoly Dandara, seated against a bare brick wall.",
        },
      },
      {
        kind: "file",
        id: "talk",
        title: "Speaking",
        meta: "JPEG",
        href: "/gift-shop/talk-speaking.jpg",
        download: "Nicoly_Dandara_Speaking.jpg",
        preview: {
          src: "/gift-shop/talk-speaking.jpg",
          width: 3024,
          height: 4032,
          alt: "Nicoly Dandara mid-sentence with a microphone, in front of two projected screens.",
        },
      },
      {
        kind: "copy",
        id: "bio-line",
        title: "Bio in one line",
        meta: "Plain text",
        text: "Nicoly Dandara is a Product Designer with 5+ years of experience, mostly spent building software for Stone's credit card machines.",
      },
      {
        kind: "copy",
        id: "bio-paragraph",
        title: "Bio in one paragraph",
        meta: "Plain text",
        text: "Nicoly Dandara is a Product Designer with 5+ years of experience designing for companies, for herself, and for other people. Most of her professional work has been building software for Stone's credit card machines. She holds a degree in Graphic Design, where her thesis explored service design in museums, and outside of client work she publishes links amarelos, a curated newsletter, and ondas amarelas, a curated podcast.",
      },
    ],
  },
  amareloSection,
];

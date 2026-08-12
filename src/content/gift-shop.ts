/**
 * Everything in the gift shop, grouped into the sections it is browsed by.
 * Three behaviours: a file you take away, a piece of text you take a copy of,
 * or a swatch that hands over its hex. Nothing here belongs in the main
 * content — it is the useful, unglamorous material a working designer is
 * asked for.
 */

type Common = {
  id: string;
  title: string;
  /** The quiet second line: format, size, language. */
  meta: string;
};

export type GiftShopItem = Common &
  (
    | {
        kind: "file";
        /** Short and stable in the URL... */
        href: string;
        /** ...long and legible once it lands in someone's downloads folder. */
        download: string;
        /** Only set where the file is worth seeing before taking. */
        preview?: { src: string; width: number; height: number; alt: string };
      }
    | { kind: "copy"; text: string }
    /** Rendered as a chip rather than a row; the hex is both fill and payload. */
    | { kind: "swatch"; hex: string }
  );

export type GiftShopSection = {
  id: string;
  /**
   * Shown above the group, in the same small-label idiom as the page. Left off
   * where the items already name themselves and a heading would only repeat.
   */
  title?: string;
  items: GiftShopItem[];
};

export const giftShopSections: GiftShopSection[] = [
  {
    id: "documents",
    title: "Documents",
    items: [
      {
        kind: "file",
        id: "cv-en",
        title: "Curriculum vitae",
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
        meta: "JPEG · 1500 × 2000",
        href: "/gift-shop/portrait.jpg",
        download: "Nicoly_Dandara_Portrait.jpg",
        preview: {
          src: "/gift-shop/portrait.jpg",
          width: 1500,
          height: 2000,
          alt: "Nicoly Dandara, seated against a bare brick wall.",
        },
      },
      // TODO: the talk photo goes here once the file lands. It wants the same
      // shape as the portrait above — drop it at /gift-shop/talk.jpg and fill
      // in the real dimensions, weight, and alt text.
      //
      // TODO: replace the two bios below with the real text.
      {
        kind: "copy",
        id: "bio-line",
        title: "Bio — one line",
        meta: "Copy to clipboard",
        text: "TODO: one line. The version that goes under a talk title or beside a byline.",
      },
      {
        kind: "copy",
        id: "bio-paragraph",
        title: "Bio — one paragraph",
        meta: "Copy to clipboard",
        text: "TODO: one paragraph. The version a conference programme or a podcast description asks for — a few sentences, written in the third person.",
      },
    ],
  },
  {
    id: "amarelo",
    items: [
      {
        kind: "swatch",
        id: "amarelo",
        title: "Amarelo Dandara",
        meta: "Click to copy",
        hex: "#FFCC00",
      },
    ],
  },
];

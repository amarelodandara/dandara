/**
 * Everything in the gift shop. Two behaviours: a file you take away, or a piece
 * of text you take a copy of. Nothing here belongs in the main content — it is
 * the useful, unglamorous material a working designer is asked for.
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
  );

export const giftShopItems: GiftShopItem[] = [
  {
    kind: "file",
    id: "cv-en",
    title: "Curriculum vitae",
    meta: "PDF · English · 6 KB",
    href: "/gift-shop/cv-en.pdf",
    download: "Nicoly_Dandara_ProductDesigner.pdf",
  },
  {
    kind: "file",
    id: "cv-pt",
    title: "Currículo",
    meta: "PDF · Português · 6 KB",
    href: "/gift-shop/cv-pt.pdf",
    download: "Nicoly_Dandara_Designer_Produto.pdf",
  },
  {
    kind: "file",
    id: "portrait",
    title: "Portrait",
    meta: "JPEG · 1500 × 2000 · 706 KB",
    href: "/gift-shop/portrait.jpg",
    download: "Nicoly_Dandara_Portrait.jpg",
    preview: {
      src: "/gift-shop/portrait.jpg",
      width: 1500,
      height: 2000,
      alt: "Nicoly Dandara, seated against a bare brick wall.",
    },
  },
  {
    kind: "file",
    id: "vcard",
    title: "Contact card",
    meta: "vCard · 243 bytes",
    href: "/gift-shop/nicoly-dandara.vcf",
    download: "nicoly-dandara.vcf",
  },
  // TODO: replace the three bios below with the real text.
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
  {
    kind: "copy",
    id: "bio-page",
    title: "Bio — one page",
    meta: "Copy to clipboard",
    text: "TODO: one page. The long version, for anyone introducing you properly: what you do, how you came to it, and what you are working on now.",
  },
];

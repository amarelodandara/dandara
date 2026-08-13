type Common = {
  id: string;
  title: string;
  meta: string;
};

export type GiftShopItem = Common &
  (
    | {
        kind: "file";
        href: string;
        download: string;
        preview?: { src: string; width: number; height: number; alt: string };
      }
    | { kind: "copy"; text: string }
    | { kind: "swatch"; hex: string; fill: string }
  );

export type GiftShopSection = {
  id: string;
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
      {
        kind: "file",
        id: "talk",
        title: "Speaking",
        meta: "JPEG · 3024 × 4032",
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
        fill: "bg-background-hard",
      },
    ],
  },
];

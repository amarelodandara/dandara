export type Experience = {
  company: string;
  href?: string;
  role: string;
  period: string;
  description?: string;
};

export const EXPERIENCE: Experience[] = [
  {
    company: "Stone Co.",
    href: "https://www.stone.com.br/",
    role: "Product Designer",
    period: "2022 — 2026",
    description:
      "As a designer for the In Person Sales team I was the voice of design for all 22+ devices and 3 development platforms for the biggest acquirer in the country. My favorite project was building an App Store (à la Apple) that ran in a credit card machine and within its first 6 months converted more than 40% of the partner base to this new, easier and more engaging flow.",
  },
  {
    company: "QuintoAndar",
    href: "https://www.quintoandar.com.br/",
    role: "Product Designer",
    period: "2021 — 2022",
  },
  {
    company: "TeamHub",
    role: "Front End Developer",
    period: "2021",
  },
];

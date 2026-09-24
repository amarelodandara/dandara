export type Experience = {
  company: string;
  href?: string;
  role: string;
  period: string;
};

export const EXPERIENCE: Experience[] = [
  {
    company: "Stone Co.",
    href: "https://www.stone.com.br/",
    role: "Product Designer",
    period: "2022 — 2026",
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

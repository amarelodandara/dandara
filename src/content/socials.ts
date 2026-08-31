export type Social = { label: string; href: string };

export const FIND_ME: Social[] = [
  { label: "Email", href: "mailto:nicolydndr@gmail.com" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/nicolydandara/" },
  { label: "Twitter", href: "https://x.com/amarelodandara" },
  {
    label: "Bluesky",
    href: "https://bsky.app/profile/amarelodandara.bsky.social",
  },
  { label: "GitHub", href: "https://github.com/amarelodandara" },
];

export const TWITTER = FIND_ME.find((one) => one.label === "Twitter")!;

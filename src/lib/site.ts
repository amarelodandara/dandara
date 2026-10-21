export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://adandara.com";

export const NAME = "Nicoly Dandara";
export const TITLE = "Dandara";
export const DESCRIPTION =
  "Product design, design engineering and relentless taste";

export const CARD = {
  url: "/og.png",
  width: 1200,
  height: 630,
  alt: "Dandara — product design, design engineering and relentless curation.",
};

export const CARD_VIDEO = {
  url: `${SITE_URL}/og.mp4`,
  width: 1200,
  height: 630,
  type: "video/mp4",
};

export const FEED = { "application/rss+xml": "/feed.xml" };

export const ICON = { url: "/icon.svg", type: "image/svg+xml" };

export const BROKEN_ICON = { url: "/icon-broken.svg", type: "image/svg+xml" };

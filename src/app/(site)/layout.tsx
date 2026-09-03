import type { Metadata } from "next";
import dynamic from "next/dynamic";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GiftShop } from "@/components/gift-shop";
import { DESCRIPTION, NAME, SITE_URL, TITLE } from "@/lib/site";
import { ANNOTATION } from "@/lib/type";
import "../globals.css";

const Agentation =
  process.env.NODE_ENV === "development"
    ? dynamic(() => import("agentation").then((mod) => mod.Agentation))
    : null;

const SKIP = [
  `sr-only ${ANNOTATION} leading-none`,
  "focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50",
  "focus:rounded-lg focus:bg-background focus:px-3 focus:py-2 focus:shadow-card",
  "focus:outline-2 focus:outline-offset-2 focus:outline-foreground",
].join(" ");

const inter = localFont({
  src: [
    { path: "../../fonts/InterVariable.woff2", style: "normal" },
    { path: "../../fonts/InterVariable-Italic.woff2", style: "italic" },
  ],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE, template: `%s — ${NAME}` },
  description: DESCRIPTION,
  applicationName: NAME,
  authors: [{ name: NAME, url: SITE_URL }],
  creator: NAME,
  alternates: {
    canonical: "/",
    types: { "application/rss+xml": "/feed.xml" },
  },
  openGraph: {
    type: "profile",
    firstName: "Nicoly",
    lastName: "Dandara",
    username: "amarelodandara",
    url: SITE_URL,
    siteName: NAME,
    title: TITLE,
    description: DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full">
        <a href="#content" className={SKIP}>
          Skip to content
        </a>

        <div
          id="content"
          data-page
          tabIndex={-1}
          className="relative z-10 flex min-h-full flex-col bg-background outline-none"
        >
          {children}
        </div>

        <GiftShop />

        {Agentation ? <Agentation endpoint="http://localhost:4747" /> : null}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

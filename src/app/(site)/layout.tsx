import type { Metadata } from "next";
import dynamic from "next/dynamic";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Colophon } from "@/components/colophon";
import { GiftShop } from "@/components/gift-shop";
import { DESCRIPTION, NAME, SITE_URL, TITLE } from "@/lib/site";
import "../globals.css";

const Agentation =
  process.env.NODE_ENV === "development"
    ? dynamic(() => import("agentation").then((mod) => mod.Agentation))
    : null;

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
  alternates: { canonical: "/" },
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
        <GiftShop />

        <div data-page className="relative z-10 flex min-h-full flex-col bg-background">
          {children}
          <Colophon />
        </div>

        {Agentation ? <Agentation endpoint="http://localhost:4747" /> : null}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

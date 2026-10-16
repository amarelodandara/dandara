import type { Metadata } from "next";
import dynamic from "next/dynamic";
import localFont from "next/font/local";
import { NotFoundWall } from "@/components/not-found-wall";
import { BROKEN_ICON } from "@/lib/site";
import "./globals.css";

const Agentation =
  process.env.NODE_ENV === "development"
    ? dynamic(() => import("agentation").then((mod) => mod.Agentation))
    : null;

const inter = localFont({
  src: [
    { path: "../fonts/InterVariable.woff2", style: "normal" },
    { path: "../fonts/InterVariable-Italic.woff2", style: "italic" },
  ],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Not found",
  description: "This address does not match a page on this site.",
  icons: { icon: BROKEN_ICON },
};

export default function GlobalNotFound() {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full bg-cadmium-50">
        <NotFoundWall />
        {Agentation ? <Agentation endpoint="http://localhost:4747" /> : null}
      </body>
    </html>
  );
}

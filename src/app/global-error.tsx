"use client";

import localFont from "next/font/local";
import { ErrorWall } from "@/components/error-wall";
import { BROKEN_ICON } from "@/lib/site";
import "./globals.css";

const inter = localFont({
  src: [
    { path: "../fonts/InterVariable.woff2", style: "normal" },
    { path: "../fonts/InterVariable-Italic.woff2", style: "italic" },
  ],
  variable: "--font-inter",
  display: "swap",
});

export default function GlobalError({ retry }: { retry: () => void }) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <head>
        <title>Something broke — Nicoly Dandara</title>
        <link rel="icon" href={BROKEN_ICON.url} type={BROKEN_ICON.type} />
      </head>
      <body className="min-h-full bg-cadmium-50">
        <ErrorWall retry={retry} />
      </body>
    </html>
  );
}

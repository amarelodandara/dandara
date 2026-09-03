import type { Metadata } from "next";
import localFont from "next/font/local";
import { LINK } from "@/components/link";
import { ACCENT_PROSE, ANNOTATION, PAGE_HEADING, PROSE } from "@/lib/type";
import "./globals.css";

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
};

const ELSEWHERE = [
  { href: "/", label: "Home", blurb: "the selected work, and who I am" },
  {
    href: "/writing",
    label: "Writing",
    blurb: "essays on design and building",
  },
  { href: "/cv", label: "CV", blurb: "the full history, printable" },
  { href: "/feed.xml", label: "Feed", blurb: "RSS for the writing" },
  { href: "/sitemap.xml", label: "Sitemap", blurb: "every page on this site" },
];

export default function GlobalNotFound() {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full bg-background">
        <main className="mx-auto w-full max-w-[1400px] px-[7vw] pt-[9vh] pb-[14vh] sm:pt-[12vh]">
          <div className="mx-auto w-full max-w-2xl">
            <p className={`${ANNOTATION} text-foreground-soft`}>404</p>
            <h1 className={`mt-1.5 ${PAGE_HEADING}`}>Nothing hangs here</h1>
            <p className={`mt-6 ${ACCENT_PROSE} text-foreground-soft`}>
              This address does not match a page on this site. It may have been
              renamed, or it may never have existed. Everything that does exist
              is one link away.
            </p>

            <ul className="mt-12 space-y-4">
              {ELSEWHERE.map(({ href, label, blurb }) => (
                <li key={href} className={PROSE}>
                  <a href={href} className={LINK}>
                    {label}
                  </a>
                  <span className="text-foreground-soft"> — {blurb}</span>
                </li>
              ))}
            </ul>
          </div>
        </main>
      </body>
    </html>
  );
}

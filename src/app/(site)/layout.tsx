import type { Metadata } from "next";
import localFont from "next/font/local";
import { Agentation } from "agentation";
import { Colophon } from "@/components/colophon";
import { GiftShop } from "@/components/gift-shop";
import "../globals.css";

const inter = localFont({
  src: [
    { path: "../../fonts/InterVariable.woff2", style: "normal" },
    { path: "../../fonts/InterVariable-Italic.woff2", style: "italic" },
  ],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dandara",
  description: "Portfolio",
};

/**
 * The site's root layout. It sits in a route group so that `/cv` can have a
 * root of its own — the résumé is printed to PDF and read by a machine, and
 * everything here (Inter's variant glyphs, the yellow ground, the shop) is
 * hostile to that. Groups leave the URLs alone: this is still `/`.
 */
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full">
        {/* Under the page, permanently. The plane above it is opaque. */}
        <GiftShop />

        {/* The page plane. Opaque, and the thing that slides aside. The
            colophon lives here rather than in a route, so every page ends on
            the same label. `main` carries flex-1, so it stays pinned to the
            bottom on short pages. */}
        <div data-page className="relative z-10 flex min-h-full flex-col bg-background">
          {children}
          <Colophon />
        </div>

        {process.env.NODE_ENV === "development" && (
          <Agentation endpoint="http://localhost:4747" />
        )}
      </body>
    </html>
  );
}

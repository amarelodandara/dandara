import type { Metadata } from "next";
import localFont from "next/font/local";
import { Agentation } from "agentation";
import { GiftShop } from "@/components/gift-shop";
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
  title: "Dandara",
  description: "Portfolio",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full">
        {/* Under the page, permanently. The plane above it is opaque. */}
        <GiftShop />

        {/* The page plane. Opaque, and the thing that slides aside. */}
        <div data-page className="relative z-10 flex min-h-full flex-col bg-paper">
          {children}
        </div>

        {process.env.NODE_ENV === "development" && (
          <Agentation endpoint="http://localhost:4747" />
        )}
      </body>
    </html>
  );
}

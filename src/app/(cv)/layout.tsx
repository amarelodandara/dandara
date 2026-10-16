import type { Metadata } from "next";
import { ICON } from "@/lib/site";

export const metadata: Metadata = {
  title: "CV",
  icons: { icon: ICON },
  robots: { index: false, follow: false },
};

export default function CvLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CV",
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

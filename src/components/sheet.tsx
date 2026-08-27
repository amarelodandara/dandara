"use client";

import type { ReactNode } from "react";

export type SheetKind = "professional" | "personal";
export type SheetSize = "narrow" | "wide" | "feature";
export type SheetFront = "picture" | "words";
export type SheetLink = { href: string; label: string };

export type SheetProps = {
  id: string;
  kind: SheetKind;
  title: string;
  size?: SheetSize;
  eyebrow?: string;
  front?: ReactNode;
  frontKind?: SheetFront;
  link?: SheetLink;
  children?: ReactNode;
};

export function Sheet({ children }: SheetProps) {
  return <>{children}</>;
}

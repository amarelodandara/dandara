"use client";

import type { ReactNode } from "react";

export type SheetKind = "professional" | "personal";
export type SheetSize = "narrow" | "wide" | "feature";

export type SheetProps = {
  id: string;
  kind: SheetKind;
  title: string;
  size?: SheetSize;
  children: ReactNode;
};

export function Sheet({ children }: SheetProps) {
  return <>{children}</>;
}

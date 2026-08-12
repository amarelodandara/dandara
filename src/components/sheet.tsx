"use client";

import type { ReactNode } from "react";

export type SheetKind = "professional" | "personal";
export type SheetSize = "narrow" | "wide";

export type SheetProps = {
  /** Stable slug. Keys the scatter and the z-order — changing it moves the sheet. */
  id: string;
  /** Picks the pastel. Blue for professional work, yellow for personal. */
  kind: SheetKind;
  /** Accessible name for the open/close button and the focused dialog. */
  title: string;
  /** Two width tiers, so the pile has some rhythm. */
  size?: SheetSize;
  children: ReactNode;
};

/**
 * A declarative marker, not a renderer. `WorkPile` reads these props off its
 * children and draws the frame itself, so this component's body never runs.
 *
 * It carries `"use client"` deliberately: a server component passed as a child
 * would be executed before `WorkPile` ever saw it, and the props would be gone
 * by then. As a client reference the element survives with its props intact,
 * while `children` is still rendered on the server and passed through as output.
 */
export function Sheet({ children }: SheetProps) {
  return <>{children}</>;
}

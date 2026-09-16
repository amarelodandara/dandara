import type { ReactNode } from "react";
import "./world.css";

export const WORLD = "the-color-of-water";

export function World({ children }: { children?: ReactNode }) {
  return (
    <div data-world={WORLD} className="contents">
      {children}
    </div>
  );
}

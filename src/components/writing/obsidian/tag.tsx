import type { ReactNode } from "react";
import { LABEL } from "@/lib/type";

export const TAG = `inline-block rounded-sm bg-graphite-100 px-2 py-0.5 leading-none text-graphite-700 ${LABEL}`;

export function Tag({ children }: { children: ReactNode }) {
  return <span className={TAG}>{children}</span>;
}

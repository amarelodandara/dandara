import { MICRO } from "@/lib/type";

export function Kbd({ children }: { children: string }) {
  return (
    <kbd
      aria-hidden="true"
      className={`ml-2 inline-flex min-w-[1.1em] items-center justify-center rounded-[0.25rem] border border-foreground/15 px-1 py-0.5 ${MICRO} text-foreground/35`}
    >
      {children}
    </kbd>
  );
}

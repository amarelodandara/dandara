import { MICRO } from "@/lib/type";

export function Kbd({ children }: { children: string }) {
  return (
    <kbd
      aria-hidden="true"
      className={`ml-2 hidden min-w-[1.1em] items-center justify-center rounded-sm border border-graphite-200 px-1 py-0.5 can-hover:inline-flex ${MICRO} text-graphite-400`}
    >
      {children}
    </kbd>
  );
}

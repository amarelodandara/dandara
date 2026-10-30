import { MICRO } from "@/lib/type";

export function Kbd({
  children,
  tone = "border-graphite-200 text-graphite-600",
}: {
  children: string;
  tone?: string;
}) {
  return (
    <kbd
      aria-hidden="true"
      className={`ml-2 hidden min-w-[1.1em] items-center justify-center rounded-sm border px-1 py-0.5 can-hover:inline-flex ${MICRO} ${tone}`}
    >
      {children}
    </kbd>
  );
}

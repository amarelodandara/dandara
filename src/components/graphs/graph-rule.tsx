import { cn } from "@/lib/cn";

function GraphRule({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "block h-px w-full border-t border-dashed border-(--graph-frame)",
        className,
      )}
    />
  );
}

export { GraphRule };

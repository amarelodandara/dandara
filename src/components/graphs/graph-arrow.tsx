import { cn } from "@/lib/cn";

function GraphArrow({
  accent = false,
  stretch = false,
  column = false,
  className,
}: {
  accent?: boolean;
  stretch?: boolean;
  column?: boolean;
  className?: string;
}) {
  const rule = column
    ? "min-h-6 w-px flex-1 border-l border-dashed border-current"
    : "h-px min-w-6 flex-1 border-t border-dashed border-current";
  const drawn = column || stretch;

  return (
    <div
      aria-hidden="true"
      className={cn(
        "flex items-center gap-1",
        column ? "min-h-6 flex-col" : "min-w-6",
        stretch && (column ? "min-h-10" : "min-w-10 flex-1"),
        accent ? "text-(--graph-accent)" : "text-(--graph-frame)",
        className,
      )}
    >
      {drawn ? <span className={rule} /> : <span>- - -</span>}
      <span className="shrink-0">{column ? "▼" : "▶"}</span>
    </div>
  );
}

export { GraphArrow };

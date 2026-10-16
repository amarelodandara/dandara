export type GraphPalette = "mono" | "duo" | "multi";

export function isMonoPalette(palette?: GraphPalette) {
  return palette === undefined || palette === "mono";
}

export function toneClass(
  palette: GraphPalette | undefined,
  role: "primary" | "secondary" | "idle" | "empty",
) {
  if (role === "empty") return "text-(--graph-frame)";
  if (role === "idle") return "text-(--graph-muted)";
  if (role === "primary") return "text-(--graph-accent)";
  return isMonoPalette(palette)
    ? "text-(--graph-muted)"
    : "text-(--graph-accent-2)";
}

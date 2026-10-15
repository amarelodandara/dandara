import { BADGES } from "./data";
import type { Badge } from "./shape";

export function badgeFor(slug: string): Badge {
  const badge = BADGES[slug];
  if (!badge) {
    throw new Error(`No badge baked for "${slug}". Run "npm run badges".`);
  }
  return badge;
}

export const badgesFor = (entries: { badge: string }[]) =>
  Object.fromEntries(entries.map(({ badge }) => [badge, badgeFor(badge)]));

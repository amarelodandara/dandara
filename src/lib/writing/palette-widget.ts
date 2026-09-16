const DEFAULT_ROLE = "Chief Executive Officer";

const ROLES: Record<string, string> = {
  idol: "Chef Design Officer",
};

export function roleFor(slug: string): string {
  return ROLES[slug] ?? DEFAULT_ROLE;
}

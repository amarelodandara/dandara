const DEFAULT_ROLE = "Chief Executive Officer";

const ROLES: Record<string, string> = {
  idol: "Chef Design Officer",
  patela: "DevRel",
  caranx: "Chief Engineering Officer",
  "pink-moon": "Personality Hire",
};

export function roleFor(slug: string): string {
  return ROLES[slug] ?? DEFAULT_ROLE;
}

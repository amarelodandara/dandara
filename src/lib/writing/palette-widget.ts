const DEFAULT_ROLE = "Chief Executive Officer";

const ROLES: Record<string, string> = {
  idol: "Chef Design Officer",
  patela: "DevRel",
  caranx: "Chief Engineering Officer",
  "pink-moon": "Personality Hire",
  volitas: "VP of Product",
};

export function roleFor(slug: string): string {
  return ROLES[slug] ?? DEFAULT_ROLE;
}

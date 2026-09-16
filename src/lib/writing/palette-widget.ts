const DEFAULT_ROLE = "Chief Executive Officer";

const ROLES: Record<string, string> = {
  idol: "Chef Design Officer",
  patela: "DevRel",
  caranx: "Chief Engineering Officer",
  "pink-moon": "Personality Hire",
  volitas: "VP of Product",
};

const NAMES: Record<string, string> = {
  idea: "Raya Baitoi",
  patela: "Blue Surg",
  caranx: "Jackie",
  idol: "Zaya Idol",
  volitas: "Leon Volita",
  "pink-moon": "Larson Dry",
};

export function roleFor(slug: string): string {
  return ROLES[slug] ?? DEFAULT_ROLE;
}

export function nameFor(slug: string, fallback: string): string {
  return NAMES[slug] ?? fallback;
}

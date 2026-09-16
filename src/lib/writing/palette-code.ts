export type CodeSample = {
  language: string;
  label: string;
  file: string;
  code: string;
};

const SAMPLES: Record<string, CodeSample> = {
  idea: {
    language: "cpp",
    label: "c++",
    file: "glide.cpp",
    code: `enum class Glide {
  Flap,
  Drift,
};

Glide ray(int beat) {
  return beat > 3 ? Glide::Drift
                  : Glide::Flap;
}`,
  },
  patela: {
    language: "xml",
    label: "blade",
    file: "tank.blade.php",
    code: `<flux:card>
  <flux:heading>Tank</flux:heading>

  <flux:input
    wire:model.live="species"
    label="Species"
  />

  <flux:button>Save</flux:button>
</flux:card>`,
  },
  caranx: {
    language: "rust",
    label: "rust",
    file: "caranx.rs",
    code: `struct Jack {
    speed: f32,
}

impl Jack {
    fn chase(&self) -> f32 {
        self.speed * 1.4
    }
}`,
  },
  idol: {
    language: "css",
    label: "css",
    file: "idol.css",
    code: `.idol {
  --band: oklch(0.93 0.19 103);
  --ink: color-mix(in oklch,
    var(--band) 60%, black);
  background: linear-gradient(
    105deg, var(--band), #fff);
  color: var(--ink);

  &:hover { --band: #ffd400; }
}`,
  },
  volitas: {
    language: "sql",
    label: "sql",
    file: "lionfish.sql",
    code: `select fin, venom
from lionfish
where spines > 12
order by venom desc;`,
  },
  "pink-moon": {
    language: "json",
    label: "json",
    file: "bell.json",
    code: `{
  "bell": "pink-moon",
  "arms": 8,
  "drift": true
}`,
  },
};

const FALLBACK: CodeSample = SAMPLES.idea;

export function codeFor(slug: string): CodeSample {
  return SAMPLES[slug] ?? FALLBACK;
}

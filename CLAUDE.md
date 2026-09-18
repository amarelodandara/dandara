@AGENTS.md

# The type scale

Eight roles. They live in `src/lib/type.ts` and that file is the only place a
font size is written down. **Never type a `text-[…]`, `text-sm`, `leading-*`,
`tracking-*` or `font-*` class into a component.** Import the role.

```tsx
import { PROSE, SECTION_HEADING } from "@/lib/type";

<h2 className={`mt-12 ${SECTION_HEADING}`}>…</h2>
<p className={PROSE}>…</p>
```

| role | value | reach for it when |
| --- | --- | --- |
| `PAGE_HEADING` | `clamp(2rem, 4.5vw, 3.25rem)` · 700 · −0.03em | it is the top of a page. Nothing on the site is larger. |
| `SECTION_HEADING` | `clamp(1.15rem, 1.7vw, 1.4rem)` · 600 · −0.01em | a heading, or the name of a thing that has a page or a picture of its own. |
| `ACCENT_PROSE` | `clamp(1.05rem, 1.4vw, 1.25rem)` · 400 · soft | a line that opens something rather than being read through — a deck, a quote. |
| `PROSE` | `clamp(0.95rem, 1.15vw, 1.0625rem)` · 400 | anything read as a passage. |
| `TITLE` | `0.9rem` · 600 · tight | the name of one object inside a list. |
| `LABEL` | `0.85rem` · 400 | it names the thing beside it without asking to be read first. One line. Colour comes from the call site. |
| `ANNOTATION` | `0.7rem` · 400 | everything small: eyebrows, button text, dates, captions, note bodies. |
| `MICRO` | `0.65rem` · mono | apparatus — a key you press, a marker you count. |
| `STRONG` | 600 | emphasis inside prose. The weight every `<strong>` gets. |

## The two laws

1. **Fluid for language, fixed for chrome.** Every role sized with `clamp()` is
   a run of language somebody reads; every fixed `rem` labels an object. A new
   role obeys this or it is not a new role.
2. **Tracking closes up as size grows.** −0.03em, −0.01em, then nothing.
   Nothing on the site tracks positively.

## Rules that decide the near misses

- **Colour is contextual, not part of the role.** `cadmium-900` is the
  yellow panel's version of soft: anything inside the gift shop takes it,
  anything on the wall takes `graphite-700`. Add it at the call site.
- **Leading is layout, not type.** `ANNOTATION` sets none. Add `leading-none`
  where a box must be tight, `leading-normal` where the text genuinely wraps.
- **A label that runs to a paragraph is prose set small**, so it is `PROSE`, not
  `LABEL`.
- **Weight is never punctuation.** Do not drop to 400 mid-sentence to separate a
  name from its description; that is what `STRONG` is for.
- **Never write a raw colour.** Every colour is a step on one of two ramps in
  `globals.css`: `graphite` (neutral) and `cadmium` (lemon to orange, olive at
  900), 50 to 900. Reach for a step, not an opacity: `text-graphite-400`, not
  `text-graphite-900/35`. Opacity is kept for what has to stay translucent:
  focus rings (they sit on the wall and on yellow), scrims, and lines drawn on
  the yellow panel.

## Exceptions

There are two. The first is the whole CV flow: `src/app/(cv)/**` and
`src/components/cv/**` are set in Arial at point sizes, because they have to
survive an applicant tracking system and a printer. Leave them alone. They are
not part of this scale and must not import from `src/lib/type.ts`.

The second is a world (below). A world may borrow these roles, but it is not
bound by them, and it never adds one: a variant a single post wants lives in
that post's folder, not in `type.ts`.

Everywhere else has none. If a design seems to need one, the answer is a role it
already fits — check `LABEL` before inventing a quiet variant of a heading.

# Worlds

A world is a post (or project) that brings its own look: its own colours,
fonts, components and motion. `the-color-of-water` is the first. Everything
that belongs to a world lives in `src/worlds/<slug>/` and nowhere else.

**Nothing flows out.** A world never edits `globals.css`, `src/lib/type.ts`,
the root layouts, `mdx-components.tsx`, `PostMeta` or the post page template to
get its look. It may *read* the site's tokens and shared pieces (`@/lib/type`,
`@/components/copy`, `@/lib/pressable`, `CAPTION`). If a world needs something
new, that thing goes in the world's folder, even if it looks reusable. It
graduates to the site only by a separate decision, never as a side effect of a
post.

**Everything is scoped.** The post's MDX sets the world as its layout and
imports its components itself:

```mdx
import { Palette } from "@/worlds/<slug>/showcase";

export { World as default } from "@/worlds/<slug>/world";
```

`World` wraps the body in `<div data-world="<slug>" className="contents">`, and
every rule in the world's `world.css` starts with `[data-world="<slug>"]`. This
is required, not tidiness: the home page, the writing index, the feed and the
sitemap import every post module to read its `meta`, so a world's stylesheet
reaches pages that never render it. Names that CSS cannot scope (`@keyframes`,
`@property`, `@font-face`) are prefixed with the world's name.

- **Fonts** are a plain `@font-face` in `world.css`, with the file in the world's
  folder. Never `next/font`: it preloads the font on every page that imports
  the module. A declared face only downloads when something uses it.
- **Grid placement** does not pass through the wrapper. The article grid's
  `[data-article] > *` and `> figure` rules miss a world's blocks, so
  `world.css` restates them for `[data-world="<slug>"] > *`. Forgetting this
  scatters the post's paragraphs across the grid's columns.
- **Portals** leave the wrapper. Put `data-world={WORLD}` on the positioner.
- **The page around the post** (its deck, say) is restyled only from
  `world.css`, via `[data-article]:has(> [data-world="<slug>"])`. The page
  template has no per-post switches.
- **Lint.** `src/worlds/**` may use `style` and classes Tailwind does not know.
  Everything else in the house style still applies.

**A finished world is baked.** While a world is being designed its values can be
computed: skins derived from a palette, colour conversions, syntax
highlighting, image framing. Once it ships, the results are written out as
literals, and the code that derived them is deleted:

- data in the world's `.ts` file (for `the-color-of-water`, `palettes.ts`:
  hex, hsl and css forms of every colour, highlighted code as HTML);
- per-item custom properties in `world.css` (`[data-palette="…"]` blocks);
- photos resized once to twice their drawn size, as WebP, and not passed through
  `next/image`;
- client components get only the fields they render. Props are serialised into
  the page, so a whole data object sent to a client component ships all of it.

How the numbers were reached goes in the commit message that bakes them. To
change a baked world, edit the literals. Do not bring back the derivation.

# House style

- **No comments in `.ts` or `.tsx`.** `house/no-comments` is enforced on push.
  Reasoning goes in the commit message. `.css` is exempt, which is why
  `globals.css` carries the prose.
- Do not run `npm run dev`, `next dev`, or kill a dev server. One is usually
  already running. Verify with `npx tsc --noEmit` and `npx eslint`.
- `npm run typecheck` starts with `rm -rf .next/dev/types`, which disturbs a
  running dev server. Prefer plain `npx tsc --noEmit`.
- Prettier is not clean across this repo. Format only the files you touched, or
  the diff fills with unrelated churn.

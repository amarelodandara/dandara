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
  the yellow panel. The one colour outside the ramps is the site's areas:
  their `area-*` tokens in `globals.css` are for the changelog's tags and
  the signposts that lead to those areas, and nothing else.

## Exceptions

There are three. The first is the whole CV flow: `src/app/(cv)/**` and
`src/components/cv/**` are set in Arial at point sizes, because they have to
survive an applicant tracking system and a printer. Leave them alone. They are
not part of this scale and must not import from `src/lib/type.ts`.

The second is a world (below). A world may borrow these roles, but it is not
bound by them, and it never adds one: a variant a single post wants lives in
that post's folder, not in `type.ts`.

The third is the article badges (below). They are free of the scale and
of the colour rules entirely.

Everywhere else has none. If a design seems to need one, the answer is a role it
already fits — check `LABEL` before inventing a quiet variant of a heading.

# The space scale

Space has no roles, only allowed steps. Padding, margin, gap and space classes
take a step from this table and nothing else; `better-tailwindcss/no-restricted-classes`
rejects any other. `0`, `px` and `auto` are always allowed.

| tier | steps | reach for it when |
| --- | --- | --- |
| inside one object | `0.5` `1` `1.5` `2` `2.5` `3` | padding inside a chip, key or nav link; the gap between a title and its date. Half steps live here and nowhere else. |
| between the parts of a thing | `4` `6` `8` | a heading and its list, a sign's padding, the mat around an exhibit, paragraphs. |
| between blocks | `12` `16` | rules and figures in a post, the post footer, the gap between the home header's columns. |
| the page frame | `[7vw]` | the side gutter of every page. |
| | `[max(1.5rem,4vw)]` | the exhibition wall's gutter. It runs wider than the text on purpose. |
| | `[9vh]` → `sm:[12vh]` | the top and the bottom of every page: `py-[9vh] sm:py-[12vh]`, or the same pair split when the top and bottom sit on different elements. |
| | `[18vh]` | a major break: between the movements of the home page, and down the hero's columns from `md`. |
| | `[10vh]` | a minor break: between exhibition rooms, before the signposts and the colophon. |
| | `[5vh]` | the nav's distance from the top of the window. |
| optical | `[…em]` `[…lh]` | space that has to follow the text, not the grid. |
| named | `(--wall-gap)` | the gap between pieces on a wall (1.5rem, 2rem from 768px). |

`--shop-gap` (1rem, 1.25rem from 768px) insets the gift-shop panel and lives
in `globals.css`. Positions (`top`, `left`, `inset`) are not checked; the
gift-shop plaque floats in viewport units.

A world and the badges are free of this table, like the type scale. So is the CV.

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

# Badges

Every article, here or elsewhere, has a badge: an organic blob in its tags'
colours with its title running round the inside of the edge. It breathes,
the title drifts, and the gloss follows the pointer. Badges are a novelty
item, so they sit outside the house rules on purpose: their own text size,
tracking, raw `oklch` colours and inline styles. Everything they need lives
in `src/badges/`. The rest of the site only mounts them (`BadgeHover`,
`ArticleBadge`); it never borrows their colours or sizes for anything else.

- **Tags** live in each post's `meta` (`tags: ["design"]`, one to three) and
  on each `ELSEWHERE` entry, which also carries a hand-typed `words`. The
  colour of every tag is in `src/badges/tags.ts`.
- **Baked.** `npm run badges` (`scripts/badges.mts`) counts words, seeds the
  shape from the slug and mixes the colours, then writes
  `src/badges/data.ts`. Never edit that file by hand; it runs before every
  build. A post without a baked badge throws.
- **Drawn** by `shape.ts`, which both the live component and the OG script
  use, so a change to the look lands everywhere at once.
- **Where they appear:** following the pointer over the writing lists
  (`hover.tsx`), on the References shelf of the gift shop, where it can
  be dragged like the swatch it replaces (`gift-shop-badge.tsx`), as stickers scattered
  in the yellow panel of each post's OG card (`scripts/og-image.mts`), and as
  a still 3:2 tile on the main exhibition wall (`tile.tsx`), scattered the
  same way as the OG card but kept inside the frame, for every article
  tagged design or engineering. `scatter.ts` places the copies for both.

# Links

`/links` is a rolodex of references, filed A to Z. Everything it needs lives
in `src/links/`.

- **Data** is `src/links/data.ts`, and the site never reads the vault.
  New references arrive as a JSON list Nicoly hands over, entries shaped
  like `Link` (`title`, `url`, `tag`, and optionally `by`, `note`,
  `slug`). `npm run links -- path/to/list.json` (`scripts/links.mts`)
  checks each one, skips any already on the rolodex (same slug, or the
  same URL give or take the protocol, `www.` and a trailing slash) and
  names it, then adds the rest. Only quotes may go without a `url`. Do
  not edit `data.ts` by hand; commit what the script writes.
- **Order** is alphabetical by title and is the array order of `LINKS`.
  Everything (the drum, the list, every export) reads that order.
- **Kinds** are link, book, quote, movie and person (`kinds.ts`). Every
  sheet is the same cream card (`cadmium-100`); the kind is data, not
  colour. Only sheet 000, the introduction, is yellow. The first sheet of
  each letter carries an index tab, placed along the top edge by its
  place in the alphabet.
- **Radius** is a percentage of the card (`CARD_SHAPE`), so the corners
  shrink and grow with the card instead of staying a fixed size.
- **Selecting** a sheet (the round button in the front sheet's corner;
  there is no key for it) puts a sticker in that spot: the site's icon as a
  round of foil. Every picked sheet is listed above the drum in the article
  measure, title as a link and who made it, in the order they were picked,
  and the page follows the newest one down while the drum stays fixed to the
  bottom of the window. Roll all picks every sheet; Roll it back up restores
  the selection from before. Export opens the gift shop.
- **Motion:** `roll.ts` is the physics (fling, drag, travel whose
  duration grows with the square root of the distance), `use-roll.ts`
  paints the drum and wires the pointer (the wheel is left to the page, so
  the list above can always be scrolled), `sound.ts` makes the ticks
  with Web Audio.
- **What you picked** is kept in localStorage (`picked.ts`), whole entries,
  so the gift shop can export them without loading `LINKS` on every page.

# Content limits

What the components hold before they break. Found by stress-testing them
with worst-case content (Portuguese included) on `/dev/break-ui`, a dev-only
page with a Demo / Worst case / Empty / One toggle. Its fixtures live beside
it in `src/app/(site)/dev/break-ui/`; when a component starts taking new
content, add its worst case there and look at 320px, 768px and 1440px.

- **Badge titles** run round the ring once, and the ring is sized by word
  count. `npm run badges` throws when a title will not fit. Roughly:

  | words | 100 | 150 | 200 | 300 | 500 | 800 | 1,200 | 1,600+ |
  | --- | --- | --- | --- | --- | --- | --- | --- | --- |
  | characters | 25 | 32 | 37 | 44 | 53 | 61 | 68 | 73 |

  A short note needs a short title. An `ELSEWHERE` entry's `words` is typed
  by hand; 0 still bakes, at the smallest size.
- **Post meta** is read by a regex, not by JavaScript. Each field is
  `name: "value",`, on one line or with the value on the next (Prettier
  moves it there when it fits alone but not after its key). A title or
  deck never contains a straight double quote, escaped or not: use
  “curly quotes”. Breaking that stops the build with "has no title".
- **Post titles and decks** also set the OG card, which grows upward from
  the bottom with nothing to stop it. Keep titles under about 90
  characters and decks under about 80, an estimate from the card's CSS.
- **Rolodex sheets** never truncate or clamp: the text is written to fit a
  320px phone, and the same text shows on every screen. `src/links/fit.ts`
  estimates the wrap (about 28 characters a title line, 39 a note line):
  title and note together take at most 6 lines on a phone and 5 on a wide
  screen, and `by` stays under 39 characters, one line. `npm run links`
  refuses an entry that does not fit, and `npm run links -- --check` lists
  the sheets already on the rolodex that do not.
- **Headings and signposts** break a single word too long for the line
  mid-word rather than overflowing, so a long Portuguese compound survives
  at 320px. It will not look good; prefer ordinary words in names.
- **Exhibit captions** stay on one line at 768px up to about 20 characters
  with a link and 30 without. Longer titles wrap, and the Live / Read links
  drop below the title together when they would squeeze it.
- **The changelog card** (mdxcn's `Changelog`, also on the wall):
  - Each line starts with `launched:`, `improved:`, `fixed:` or
    `removed:` (or `add`, `change`, `fix`, `remove`, `+`, `~`, `*`, `-`).
    Any other label, a Portuguese one included, silently becomes
    "improved" and the word disappears.
  - `version` stays under about 20 characters. It is centred in the
    frame's top border with no truncation and runs out of both sides.
  - No bare URLs in a line; they run out of the frame at every width.
  - It needs a wide span. In a wall column at 768px (about 214px) it
    collapses to one word per line.

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

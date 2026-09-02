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
| `LABEL` | `0.85rem` · 400 · soft | it names the thing beside it without asking to be read first. One line. |
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

- **Colour is contextual, not part of the role.** `foreground-hard` is the
  yellow panel's version of soft: anything inside the gift shop takes it,
  anything on the wall takes `foreground-soft`. Add it at the call site.
- **Leading is layout, not type.** `ANNOTATION` sets none. Add `leading-none`
  where a box must be tight, `leading-normal` where the text genuinely wraps.
- **A label that runs to a paragraph is prose set small**, so it is `PROSE`, not
  `LABEL`.
- **Weight is never punctuation.** Do not drop to 400 mid-sentence to separate a
  name from its description; that is what `STRONG` is for.
- **Never write a raw colour.** `black/35` is wrong; `foreground/35` is the same
  thing through the token.

## Exceptions

There is one, and it is the whole CV flow: `src/app/(cv)/**` and
`src/components/cv/**` are set in Arial at point sizes, because they have to
survive an applicant tracking system and a printer. Leave them alone. They are
not part of this scale and must not import from `src/lib/type.ts`.

Everywhere else has none. If a design seems to need one, the answer is a role it
already fits — check `LABEL` before inventing a quiet variant of a heading.

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

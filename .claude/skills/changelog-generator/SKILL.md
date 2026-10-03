---
name: changelog-generator
description: Automatically creates user-facing changelogs from git commits by analyzing commit history, categorizing changes, and transforming technical commits into clear, customer-friendly release notes. Use when preparing release notes, weekly or monthly update summaries, or maintaining CHANGELOG.md.
---

# Changelog Generator

Turn technical git commits into a changelog that visitors to the site can read.

## What to do

1. **Scan git history** for the requested range: since the last entry in `CHANGELOG.md`, a date range, or between two refs. Read commit bodies, not just subjects, when a subject is vague.
2. **Categorize** into New, Improved, Fixed, and tag each entry with its area (below).
3. **Translate** each commit into what a visitor sees or can do. Name the place on the site, not the component.
4. **Filter noise.** Leave out refactors, lint, tests, vendored skills, deploy plumbing, dev-only tooling and pure performance work nobody would notice. Merge commits that fix the same thing into one line.
5. **Format** as `## Week of <Monday's date>` sections, newest first, prepended to `CHANGELOG.md`, under `### New`, `### Improved` or `### Fixed`. Each entry is `- [Area] **Thing** what changed. How it changed.` First say what is different for the visitor, then the concrete mechanism or measure behind it: the CSS property, the size, the timing, the before and after. Take those details from the commit body and diff, never guess them.
6. **Hand it back for review** before committing. Flag any entry you were unsure how to describe.

## Areas

Every entry starts with exactly one area tag. The `/changelog` page reads `CHANGELOG.md` at build time, and the build fails on an entry with no tag or an unknown one. The list lives in `AREAS` in `src/lib/changelog.ts`. A new area is added there and here together.

| Tag | What it covers |
| --- | --- |
| `[Home]` | The home page: name and role, personal work, Find me, Open for work, experience, the newest writing, the arrival animation, the colophon. |
| `[Work]` | The work: sheets on the wall, the pile, wall labels, the closer look, the lightbox, project videos. |
| `[Blog]` | `/writing`, every post, footnotes, a post's share card, a post's own look (its world), writing published elsewhere. |
| `[Gift shop]` | The drawer and its shelves: documents, press kit, portrait, swatch, RSS, the shop's header, sign and plaque. |
| `[Site-wide]` | Changes with no single home: colour, type, text selection, navigation, the 404, phones in general, keyboard and hover, performance, search engines, the changelog page itself. |

How to choose:
- **Where a visitor notices it first.** Not where the code lives.
- **The more specific area wins.** A post's share card is `[Blog]`, not `[Site-wide]`.
- **`[Site-wide]` only when nothing narrower fits.**
- **One change touching two areas is two entries,** one per area.
- **Leave CV changes out.** Edits to the résumé's content are personal, not site updates.
- **Leave copy changes out.** Rewording a bio, a role or a description is not a change to the site. A new piece of content, like a post or a sheet, still counts.

## Example

```markdown
## Week of September 28, 2026

### New
- [Blog] **Writing index** added at `/writing`, listing every post grouped by year.
- [Gift shop] **RSS feed** added to the gift shop on `/writing`, as a link you can copy.

### Improved
- [Site-wide] **Text selection** is now on brand instead of the browser's default blue. A light yellow is set through the CSS `::selection` pseudo-element.

### Fixed
- [Blog] **"Copy palette" button** no longer jumps sideways when its label changes to "Copied".
```

## Tips

- Run from the repository root.
- If a `CHANGELOG_STYLE.md` exists, follow it.
- **Write plainly.** Anyone should understand an entry without knowing the site. No metaphors (no "museum", "wall", "plaque", "sheets", "door"), no wordplay. Use the plain name: project, footer, gift shop, home page.
- **Be specific and brief.** Name the thing, say what changed and how, in one or two sentences. The Text selection entry in the example above is the model.
- **Leave out changes visitors never see**, such as build fixes, even when the commit is a `fix:`.

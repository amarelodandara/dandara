---
name: tailor-cv
description: Tailor Nicoly's résumé to a specific job description and generate an ATS-clean PDF she can download from the gift shop. Use when given a job description, a job posting URL, or asked to "tailor my CV", "optimise my resume for this role", or "make a version for this job".
---

# Tailor the CV to a job posting

Paste a job description; get back a one-page, ATS-clean PDF written for it,
downloadable from the gift shop on the local dev site.

**First, invoke the `resume-ats-optimizer` skill and follow its Keyword
Optimization Process (Steps 1–4) and its Analysis Output Format.** That skill
owns all the general ATS knowledge — the compatibility checklist, the three
keyword categories, the match-score formula, the placement priorities. This one
owns only the repository pipeline around it. Where the two disagree on ATS
substance, `resume-ats-optimizer` wins.

## Prerequisites

A dev server must be reachable, or the generator will start one. If Playwright's
browser is missing, the generator fails with a download instruction — run
`npx playwright install chromium` and retry.

## Steps

1. **Get the job description.** From the arguments if present, otherwise ask for
   it. If given a URL, fetch it. Work from the literal posting text — keyword
   extraction against a summary of a posting produces a résumé tailored to the
   summary.

2. **Detect the language** from the posting's own text, not from the company's
   country: a São Paulo company frequently posts in English. Map to `en` or
   `pt`. If the posting is genuinely bilingual, ask which to write — do not
   produce both.

3. **Read `src/content/cv/full.en.md` first, then `base.<lang>.md`.**

   `full.en.md` is the master: every true thing about Nicoly's career, written
   in résumé-ready language, so that tailoring is an act of *selection* rather
   than invention. It carries several summaries at different angles, bullets
   grouped by the theme they argue, the full project detail, and — load-bearing
   — a **Fixed facts** section and a **What Nicoly cannot claim** section.
   Read both of those before writing a single line.

   `base.<lang>.md` is one already-tuned selection from that pool. Read it for
   shape and for canonical wording, and do not edit it.

   For a Portuguese posting, read `full.en.md` **and** `full.pt.md`. All the
   guidance lives in the English master and is not duplicated; `full.pt.md`
   holds only the Portuguese prose to draw from.

   Never render, generate, or send a `full` file. It sits at the CV root, where
   `loadCv` only ever resolves `base.<lang>.md`, so `/cv?variant=full` and
   `npm run cv:pdf --variant full` cannot reach it. Do not move it into
   `tailored/`, which would make it reachable.

   If the posting wants something the master does not cover, that is a gap in
   the master, not licence to invent. Say so in the report so it can be added
   from life rather than from guesswork.

4. **Derive a slug** of `<company>-<role>`, kebab-cased and ASCII-folded, e.g.
   `linear-senior-product-designer`. It must match `^[a-z0-9][a-z0-9-]{0,63}$`
   or the route will refuse to load it.

5. **Write the keyword file** to
   `src/content/cv/tailored/<slug>.<lang>.keywords.json`. Following
   `resume-ats-optimizer` Step 1, extract the posting's hard skills, soft
   skills, and industry terms, and sort them into `critical` (what the posting
   treats as non-negotiable) and `important` (everything else worth carrying).

   ```json
   {
     "role": "Linear — Senior / Staff Product Designer",
     "source": "https://…",
     "critical": [
       { "label": "Figma" },
       { "label": "prototyping / prototypes", "match": "prototyp" }
     ],
     "important": [
       { "label": "written communication", "match": "written|writing|communicat" }
     ]
   }
   ```

   `match` is a case-insensitive regular expression and defaults to the label.
   Use it to catch inflections — `prototyp` finds *prototyping* and
   *prototypes* — and `\\b…\\b` to stop short words matching inside longer ones.

   **Include requirements the résumé cannot meet.** A missing keyword that
   cannot be honestly added is information about the fit, and leaving it out of
   the list to flatter the score defeats the point of measuring.

   Then get the **before** score by running the check against the base CV:
   ```bash
   npm run cv:score -- public/gift-shop/cv-<lang>.pdf \
     --keywords src/content/cv/tailored/<slug>.<lang>.keywords.json
   ```

6. **Write `src/content/cv/tailored/<slug>.<lang>.md`.** Start from the base's
   shape, then select against the master:
   - take the **Summary** whose angle matches the posting and bend it toward the
     posting's vocabulary, so it carries the five to eight highest-priority
     keywords as natural prose — do not stack two summaries together;
   - **choose the bullets from the master** whose theme the posting rewards, and
     order them so the most relevant land first within each role. The master
     holds far more bullets than fit; picking is the job. Rewording a chosen
     bullet toward the posting's language is expected;
   - decide how to present **03/2026 – Present** using the master's *The current
     period* section, and say in the report which of the three framings you
     chose and why;
   - build the **Skills** section from the master's skills pool, in the
     posting's own terminology, and leave out what the posting has no use for;
   - keep the **Projects** the posting gives a reason to read. adandara.com and
     *In Service of Museums* usually earn their place for engineering-adjacent
     and research-adjacent roles; the newsletter and podcast earn theirs where
     writing or a published body of work is rewarded;
   - leave the frontmatter's `name`, `contact`, and `pageSize` alone.

   **Never invent or alter an employer, job title, date, degree, metric, or
   URL.** Every number must be copied from the master's *Fixed facts* exactly as
   written there. Tailoring re-emphasises what is already true; it does not add
   experience. If the posting asks for something Nicoly does not have — a number
   of years, a seniority title, a named tool — the master's *What Nicoly cannot
   claim* section almost certainly names it. Say so plainly in the report and
   lead with the strengths that are real. A résumé that wins a screen it cannot
   survive is worse than one that does not.

   Stay inside the document grammar: `## Section`, `### Entry`, one bare meta
   line under an entry, `- ` bullets, paragraphs, `**bold**`, and bare URLs.
   Nothing else parses — `src/lib/cv/parse.ts` throws with a line number.

7. **Generate.** This prints the ATS check as part of its output — the score is
   measured from the finished PDF's own text layer, so it can never drift from
   the document the way a hand-written number would.
   ```bash
   npm run cv:pdf -- --lang <lang> --variant <slug> \
                     --title "<Company> — <Role>"
   ```
   On a parse error, fix the markdown and run it again. Never edit anything
   under `public/gift-shop/` by hand.

   **Show the full keyword table to the user, every run.** Not a summary of it,
   and not only the percentage — the point is seeing which words landed and
   which did not.

   If the score is below 80%, look at the misses and ask which can be closed
   truthfully, usually by restoring wording the base résumé already had. Then
   rewrite and generate again. Iterate until the score stops moving honestly;
   do not manufacture keywords to reach a number.

8. **Verify.**
   ```bash
   npm run cv:verify -- public/gift-shop/tailored/<slug>.<lang>.pdf
   ```
   This is not optional. It is the only check that the PDF's text layer is
   readable by the software that reads it first — a broken one looks perfect.

   If it reports more than one page, cut copy until it fits, usually from
   Skills or the oldest bullets. **Never reduce the type size**; below 10pt
   breaks `resume-ats-optimizer`'s own rule.

9. **Confirm nothing tracked changed.** Run `git status --short`. Tailored
   files are git-ignored, so the output should be no different from before the
   run. Say so in the report.

10. **Report** in `resume-ats-optimizer`'s Analysis Output Format, plus:
    - the full keyword table from step 7, both tiers;
    - match score before → after;
    - which keywords were added, and where they landed;
    - which bullets were selected from the master, reordered or reworded, and why;
    - which framing of 03/2026 – Present was used, and why;
    - anything the posting wanted that the master does not yet cover;
    - any requirement the résumé genuinely cannot meet;
    - the output path and page count;
    - "press `g` on the local site to take it from the gift shop."

## What this never does

- Edit `src/content/cv/base.en.md` or `base.pt.md`.
- Edit `src/content/cv/full.en.md` or `full.pt.md` as part of a tailoring run.
  The master changes when Nicoly's career changes, in a deliberate conversation
  with her — never as a side effect of fitting one posting. Report the gap and
  let her decide.
- Render, generate, or send a `full` file, or move one into `tailored/`.
- Run `npm run cv:base`. That regenerates the two committed PDFs the public
  site serves, and it is a deliberate, separately reviewed act.
- Commit anything.

# Deploys

Every push to `main` goes to production. That is on purpose. The point of what
follows is not to slow it down but to make a bad push cheap: an outage is a when,
not an if, so the effort goes into catching it fast and undoing it fast rather
than into pretending it can be prevented.

## What guards what

| Guard | Runs | Catches |
| --- | --- | --- |
| `.githooks/pre-push` | before the push leaves the machine, ~5s | type errors, lint errors |
| `.github/workflows/ci.yml` | every push and pull request | the same, plus a real `next build` |
| Vercel's own build | every push to `main` | anything that fails `next build` — the deploy never promotes and the last good one stays live |
| `.github/workflows/smoke.yml` | when a production deployment reports success | pages that build clean and serve broken |

| `.github/workflows/uptime.yml` | every 30 minutes | the site going down between deploys |

Nothing guards content judgement, copy, or layout. Those are still on you.

## What nothing guards, on purpose

There is no fleet, so there is no one-box, rolling, or regional rollout. There
are no feature flags: the site is prerendered, so a flag would need a redeploy to
flip, which is the opposite of what a flag is for. If a change ever gets big
enough to want a gradual rollout, Vercel Rolling Releases is the tool — it needs
Pro, and the traffic here is too low for the numbers to mean much.

## How you find out it broke

- the **uptime workflow goes red** and GitHub emails you, within 30 minutes.
  Issues are off on this repo, so the alarm is the failing run and the mail it
  sends. A sustained outage will mail every half hour rather than collecting
  itself into one thread — that is the cost of not opening a public issue
  tracker on a portfolio repo, and it is the right trade until an outage lasts
  long enough to be annoying.
- the **smoke workflow goes red** on the Actions tab, within a couple of minutes
  of the deploy
- you look at the site

## Rolling back

Rolling back is always the first move. Diagnose after the site is up.

**Dashboard** — Vercel project → Deployments → the last deployment that was good
→ ⋯ → **Instant Rollback**. Takes seconds, no rebuild.

**Terminal** — the Vercel CLI is not installed here, so:

```
npx vercel rollback
```

Then fix forward in a normal commit. Do not leave production rolled back and the
repo ahead of it for long — the next push deploys whatever `main` says.

## Bypassing the hook

```
git push --no-verify
```

Legitimate when you already know the check fails and are pushing anyway — a
work-in-progress branch, or a content-only change while an unrelated lint error
is open. Not legitimate on `main` because the hook is slow. If it gets slow
enough to resent, cut what it runs instead of routing around it.

## Adding a page

`scripts/smoke.mts` derives most of its route list rather than hardcoding it:

- posts come from `readPosts()` in `src/lib/writing/meta-source.ts`
- downloads come from `giftShopSections` in `src/content/gift-shop.ts`

So a new post or a new gift shop file is covered the moment it lands. A **new
top-level route** is not — add it to the `visit` calls in `main()`.

Two assertions are invariants rather than routes, and both are meant to fail
loudly if they ever stop holding:

- `/cv` must answer **404** in production. `src/app/(cv)/cv/page.tsx` calls
  `notFound()` outside development; that route is a rendering surface for the PDF
  scripts, not a page.
- an unknown path must answer **404**, which proves 404s are real and not a
  catch-all returning 200.
- `/robots.txt`, `/sitemap.xml` and `/feed.xml` must answer, and the sitemap and
  the feed must list every post the repo has. A silently empty sitemap is the
  kind of regression nobody notices for a month.

## Why smoke checks the domain, not the deployment

Deployment Protection is on, so every `*.vercel.app` deployment URL redirects to
the Vercel login. The smoke workflow therefore checks `adandara.com` — the
alias production traffic actually lands on — rather than the deployment URL
GitHub hands it. That is the better target anyway: it is what a visitor gets.

The cost is that a preview cannot be smoked without a protection bypass token.
If that becomes worth having, the script refuses an auth-walled base with one
clear line instead of failing seventeen checks for the same reason, which is
where to hook the bypass header in.

## Running the checks by hand

```
npm run typecheck
npm run lint
npm run smoke
npm run smoke -- --base https://some-preview.vercel.app
```

`npm run lint:strict` is advisory only. It reports about 46 warnings — deliberate
ones, like long functions in `src/lib/spring-drag.ts` — and is wired into no gate.

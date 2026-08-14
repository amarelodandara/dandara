# 003 — One token for the quick transitions

**Commit:** `ff90f04`
**Severity:** LOW · Cohesion & tokens
**Files:** `src/app/globals.css`, `src/app/(site)/page.tsx`,
`src/components/gift-shop-row.tsx`, `src/components/gift-shop.tsx`,
`src/components/sheet-frame.tsx`

Covers audit findings 4 and 5 together — they are the same missing token.

## Problem

Two gaps left after the motion tokens landed:

**Four link hovers run on Tailwind's defaults.** `page.tsx` lines 59, 85, 226
and 248 use a bare `transition-opacity`, which compiles to:

```css
transition-timing-function: var(--tw-ease, var(--default-transition-timing-function)); /* cubic-bezier(.4, 0, .2, 1) */
transition-duration: var(--tw-duration, var(--default-transition-duration));           /* .15s */
```

That curve is Tailwind's, not the product's, and it has an ease-in component —
it starts slow, which AUDIT.md §2 calls out as the thing that reads sluggish.

**Short durations are still hand-typed.** `duration-150` in
`gift-shop-row.tsx:11,38,188` and `gift-shop.tsx:103,107`, and `duration-200` in
`sheet-frame.tsx:270`, sit beside `--motion-enter` / `--motion-exit` / `--press`.
AUDIT.md §7 treats near-identical hand-typed values as a consolidation finding.

## Target

Add one token next to the existing three in the `@theme` block of `globals.css`:

```css
--motion-quick: 150ms;
```

Then use `duration-(--motion-quick)` and `ease-out-strong` at every site listed
above. `sheet-frame.tsx:270` moves 200ms → 150ms; it is a hover reveal, and
AUDIT.md §1 says hover motion should be reduced rather than stretched.

## Steps

1. Add `--motion-quick: 150ms;` to `@theme inline` in `globals.css`, beside
   `--press`.
2. `page.tsx` lines 59, 85, 226, 248 — the four
   `transition-opacity hover:opacity-50` links: append
   `duration-(--motion-quick) ease-out-strong`.
3. `gift-shop-row.tsx` lines 11, 38, 188 — swap `duration-150` for
   `duration-(--motion-quick)`; line 38 also gains `ease-out-strong`.
4. `gift-shop.tsx` lines 103 and 107 — same swap; line 107 also gains
   `ease-out-strong`.
5. `sheet-frame.tsx` line 270 — `duration-200` becomes
   `duration-(--motion-quick)`.

## Scope

Durations and easing only. Do not change which properties transition, and do not
touch `--motion-enter`, `--motion-exit` or `--press`.

## Verification

- `grep -rn "duration-150\|duration-200" src/` returns nothing.
- The compiled CSS emits `--motion-quick:.15s`.
- `npx tsc --noEmit`, `npx eslint .`, `npm run build` clean, and the
  `better-tailwindcss` rules report no new warnings.
- Feel-check: hover a body link and a gift shop row. Both should feel the same
  as each other, and slightly crisper off the mark than before.

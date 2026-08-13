# 002 — Cancel the FLIP animation before starting the next

**Commit:** `ff90f04`
**Severity:** MEDIUM · Interruptibility
**File:** `src/components/sheet-frame.tsx`

## Problem

The FLIP animation discards its handle:

```tsx
el.animate(
  [ /* … */ ],
  { duration: FLIP_DURATION, easing: EASE_OUT_STRONG },
);
```

`Element.animate()` returns an `Animation` and starts a new one on every call.
Opening and closing a sheet quickly stacks concurrent animations on the same
element, both driving `transform`, with no cancellation. The later one wins by
composite order, so the earlier one's remaining frames fight it.

AUDIT.md §4: motion that is reversible mid-flight must retarget from the current
state rather than restart alongside itself.

## Target

Hold the handle in a ref and cancel before each new run.

## Steps

1. Add a ref beside the other refs in the component:
   ```tsx
   const flip = useRef<Animation | null>(null);
   ```
2. In the layout effect, cancel any in-flight animation before starting:
   ```tsx
   flip.current?.cancel();
   flip.current = el.animate(
     [ /* unchanged keyframes */ ],
     { duration: FLIP_DURATION, easing: EASE_OUT_STRONG },
   );
   ```

## Scope

Do not change the keyframes, the duration, the easing, or the reduced-motion
early return. Cancellation only.

## Verification

- `npx tsc --noEmit`, `npx eslint .`, `npm run build` clean.
- Feel-check: open a sheet and close it before the 280ms finishes, several times
  in a row. The card must never jump or double-animate; each toggle should pick
  up from wherever the card currently is.

# 001 — Drag writes transform directly, not a custom property

**Commit:** `ff90f04`
**Severity:** HIGH · Performance
**File:** `src/components/sheet-frame.tsx`

## Problem

Dragging a sheet writes two CSS custom properties on the frame:

```tsx
el.style.setProperty("--sheet-dx", `${drag.current.x}px`);
el.style.setProperty("--sheet-dy", `${drag.current.y}px`);
```

consumed by the frame's own class:

```
md:translate-x-[calc(-50%+var(--sheet-dx,0px))] md:translate-y-[var(--sheet-dy,0px)]
```

Custom properties inherit. Setting one on the frame invalidates style for every
descendant — the sheet card, its prose, and the images and videos inside it —
on every `pointermove`. Seven sheets carry six media elements between them.

This is the anti-pattern named in AUDIT.md §5: *"Don't drive child transforms via
a CSS variable on the parent — it recalcs styles for all children. Set transform
directly on the element."*

## Target

Write the composed value straight onto the element:

```tsx
el.style.translate = `calc(-50% + ${drag.current.x}px) ${drag.current.y}px`;
```

An inline `translate` overrides Tailwind's `translate: var(--tw-translate-x) var(--tw-translate-y)`,
so the `-50%` centring must be carried in the inline value, and the class keeps
`md:-translate-x-1/2` for the resting state.

## Steps

1. Replace the two `setProperty` calls in `handlePointerMove` with the single
   `el.style.translate` assignment above.
2. In `frameClass`, replace
   `"md:translate-x-[calc(-50%+var(--sheet-dx,0px))] md:translate-y-[var(--sheet-dy,0px)]"`
   with `"md:-translate-x-1/2"`.
3. Add a media-query effect. The old custom property was only read inside a
   `md:` utility, so below 768px it had no effect. An inline `translate` is not
   media-gated and would leave a desktop-dragged sheet displaced on mobile.
   Listen to `(min-width: 768px)` and clear or reapply:

   ```tsx
   useEffect(() => {
     const list = window.matchMedia(DRAGGABLE);
     const sync = () => {
       const el = frameRef.current;
       if (!el) return;
       el.style.translate = list.matches
         ? `calc(-50% + ${drag.current.x}px) ${drag.current.y}px`
         : "";
     };
     list.addEventListener("change", sync);
     return () => list.removeEventListener("change", sync);
   }, []);
   ```

## Scope

Only the drag write path and that one class. Do not touch the FLIP effect, the
zoom-to-fit effect, or `--sheet-x` / `--sheet-y` / `--sheet-r` / `--sheet-w`,
which are set once from server-rendered placement and are not written during
interaction.

## Verification

- `--sheet-dx` and `--sheet-dy` appear nowhere in `src/` afterwards.
- `npx tsc --noEmit`, `npx eslint .`, `npm run build` all clean.
- Feel-check: drag a sheet on desktop — it must track the pointer exactly as
  before. Then narrow the window below 768px: the sheet must return to its
  stacked flow position, not sit displaced.
- Performance check: DevTools Performance, record a drag. Recalculate Style
  entries should no longer list the sheet's descendants.

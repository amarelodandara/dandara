# Animation plans

From the `improve-animations` audit at `ff90f04`. Findings were vetted at their
`file:line` before being written up.

| # | Plan | Severity | Status |
| --- | --- | --- | --- |
| 001 | [Drag writes transform directly](001-drag-writes-transform-directly.md) | HIGH · Performance | **DONE** |
| 002 | [Cancel the FLIP before restarting](002-cancel-flip-before-restarting.md) | MEDIUM · Interruptibility | **DONE** |
| 003 | [One token for the quick transitions](003-quick-duration-token.md) | LOW · Cohesion | **DONE** |

Execution order was 001 → 002 → 003. 001 and 002 both touch
`src/components/sheet-frame.tsx` and 001 changes the drag write path, so it went
first; 003 is independent.

## Considered and rejected

- **Blur cost on focus.** `globals.css:80-91` transitions `filter: blur(6px)` on
  up to eight elements at once when a sheet takes focus, which the audit raised
  as a possible dropped-frame risk. Checked on the machine this is built on and
  it does not jank. It is inside the 20px budget from AUDIT.md §5 and the blur is
  the effect rather than decoration, so nothing changes. Worth re-checking only
  if the pile grows well past seven sheets, or on hardware slower than a recent
  Mac — one machine is one data point.

Recorded so they are not re-audited later.

- **Stagger on the gift shop rows.** AUDIT.md §7 wants 30–80ms on group
  entrances, but the panel arrives as one physical object; staggering its
  contents risks reading as the panel disagreeing with itself.
- **Momentum on drag release.** Sheets stop dead. For paper on a desk that is
  correct — paper does not glide.
- **Animation on the `g` shortcut.** On the escalation list, but that rule
  targets actions repeated hundreds of times a day. This drawer opens about once
  a visit.
- **Ungated hover motion.** Tailwind v4 already wraps every hover utility in
  `@media (hover: hover)`; confirmed against all four compiled rules.

# Fonts

Inter 4.1 variable, `web/` build from https://github.com/rsms/inter/releases.

- `InterVariable.woff2` — upright, weight axis 100–900
- `InterVariable-Italic.woff2` — italic, same axis
- `LICENSE.txt` — SIL Open Font License 1.1

Wired via `next/font/local` in `src/app/layout.tsx`, exposed as `--font-inter`.
`--font-sans` in `globals.css` consumes it, so Tailwind's `font-sans` and the
`body` default both resolve to Inter.

To upgrade: download a new release, replace both `.woff2` files and
`LICENSE.txt` from the `web/` folder. No code change needed.

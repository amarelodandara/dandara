# Fonts

Drop the latest Inter files here from https://github.com/rsms/inter/releases:

- `InterVariable.woff2`
- `InterVariable-Italic.woff2`

Then wire them up in `src/app/layout.tsx`:

```ts
import localFont from "next/font/local";

const inter = localFont({
  src: [
    { path: "../fonts/InterVariable.woff2", style: "normal" },
    { path: "../fonts/InterVariable-Italic.woff2", style: "italic" },
  ],
  variable: "--font-inter",
  display: "swap",
});
```

and add `inter.variable` to the `<html>` className. `--font-sans` in
`globals.css` already consumes `--font-inter`.

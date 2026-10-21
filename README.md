# dandara

<img width="540" height="352" alt="image" src="https://github.com/user-attachments/assets/99bb7c8a-898a-4d88-8dd4-251c5700d610" />

My personal website, which is built like a small museum exhibition. The landing is the wall you face at the entrance, the work hangs in rooms, signposts point you from one to the next, and we even have a gift shop me-themed, take what you need. Live at [adandara.com](https://adandara.com).

## Features

- **The exhibition.** Every piece of work hangs on one still wall at `/work`, captioned with its name, its date and a link when it's live. Point at a piece and everything from the same project, and the article about it, stays sharp while the rest of the wall blurs. Two smaller rooms sit beside it: a **Sketchbook** and **Photography**.

- **Signposts.** The signs between rooms are printed on paper. The cursor wipes the grain away where it rests, a click wipes the whole sign before the page changes, and the arrows hang crooked until you look at them. Even the 404 page is a wall of them.

- **Exit through the gift shop**. One plaque, one door, on every device, or press `G`. The interaction is still inspired by the Arc Browser side menu. Its shelves change with the page: on an article it becomes the References, where the footnotes open without taking the text away.

- **Take what you need**. Every non-sexy thing a personal website needs lives at the gift shop: the CV in English and Portuguese, a vCard, bios and photos for press, and a swatch of the yellow named after me, which you can tug on. A fun way of doing bureaucracy.

- **Article badges.** Every article gets a badge: a blob shaped from its slug, sized by its word count and coloured by its tags, with the title running round the inside of the edge. It breathes, follows the pointer over the writing lists, and ends up as stickers on the post's share card.

- **Worlds.** A post can bring its own look. [The color of water](https://adandara.com/writing/the-color-of-water) has its own palettes, font, components and motion, scoped so nothing leaks into the rest of the site.

- **Small sounds.** Links, the gift shop, copying and the swatch make small sounds. One button in the navigation turns them off, and the site remembers.

- **A changelog.** What changed on the site, week by week, at [/changelog](https://adandara.com/changelog).

- **The hidden pipeline**. A skill that only runs in development tailors my CV to a job posting with actual data from my portfolio, then checks that an applicant tracking system can read it. It never touches the files on the real gift shop, but gets to use the whole experience designed for it.

## Setup

- Next.js App Router with TypeScript and MDX, deployed on Vercel
- Tailwind and self-hosted Inter for the whole interface
- One type scale and one space scale. Font sizes live in `src/lib/type.ts` only, and lint rejects any space step off the scale
- ESLint (`eslint-config-next` plus `sonarjs`, `unicorn`, `security` and
  `better-tailwindcss`), run with the typecheck before every push
- Playwright scripts bake the badges and share cards on every build, render the CV PDFs and smoke-test a deploy

## What the future awaits

Some possible roadmap items for the future. Will be implemented as necessity arise.

- **Floor Plan**. Now that the exhibition has rooms, a little floor plan to find your way between them, like the best museums do.
- **The Archive**. Curation means there is something not being shown. Let people dig the archives.
- **Visitor Book**. Let people know you have been here. Send a message.
- **Ticket desk**. Remember this exhibition forever. Don't we all miss when we used to have proper tickets for events?
- **Temporary exhibition**. A frame of whatever is being made right now, maybe gets an specific tweet of mine sharing work in public.
- **A Museum for AI agents**. See [tweet](https://x.com/zenorocha/status/2087547759083901252?s=20)

## Acknowledgements

Amazing open source that makes this possible:

- **[Inter](https://rsms.me/inter/)** by **Rasmus Andersson**
- **[Base UI](https://base-ui.com)** for the menus and dialogs
- **[cuelume](https://www.npmjs.com/package/cuelume)** for the sounds
- **[mdxcn](https://mdx-graphs.kshv.me/docs)** for the graphs and the changelog card
- **[Fira Code](https://github.com/tonsky/FiraCode)** in The color of water
- **[Agentation](https://www.npmjs.com/package/agentation)**

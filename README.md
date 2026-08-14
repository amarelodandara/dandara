# dandara

<img width="540" height="352" alt="image" src="https://github.com/user-attachments/assets/99bb7c8a-898a-4d88-8dd4-251c5700d610" />

My personal website, which is built like a small museum exhibition. The landing is the wall you face at the entrance, work hangs loose on a wall you can move around (*it's art, please touch*) and get closer to and we even have a gift shop me-themed, take what you need.

## Features

- **Wall of work.** Looks random, but isn't. The sheets of work are placed by a seeded grid, each sheet has a column and a row and wanders inside it on mount. They also take a shuffled vertical position on the stack — varying z-index — to force user interaction. Without dragging-and-dropping at least a couple of them, you will never read all of it.

- **Take a better look**. You can open a card and this zooms it in and blurs the background. Animation is very tricky, the Web Animations API makes it easier. The animations are cancellable and the zoomed-in cards are interpreted as aria modals, you interact with one at a time, double clicking doesn't start animation on top of others and the background remains inert.

- **Exit through the gift shop**. Click the button or enter through a keyboard shortcut — that knows when to act up and when to stay down. The whole interaction is inspired by the Arc Browser side menu and knows when to capture the user attention by watching if they have left the landing section yet.

- **Take what you need**. Every non-sexy thing a personal website needs lives at the gift shop. A fun way of doing bureaucracy.

- **The hidden pipeline**. I have implemented a skill that only rolls on development environment to make it easier to generate proper resumes and other sort of documents with actual data from my portfolio. It never affects the files on the actual gift shop, but benefit of the whole experience designed for it.

## Setup

- Next.js App Router with TypeScript deployed on Vercel
- Tailwind and self-hosted Inter for the whole interface
- ESLint (`eslint-config-next` plus `sonarjs`, `unicorn`, `security` and
  `better-tailwindcss`).

## What the future awaits

Some possible roadmap items for the future. Will be implemented as necessity arise.

- **Floor Plan**. Once the exhibition gets too big to navigate maybe we can split it into sections and offer a little floor plan, like the best museums do. This can also be a metaphor applied in gallery walls for blog posts and study cases.
- **The Archive**. Curation means there is something not being shown. Let people dig the archives.
- **Visitor Book**. Let people know you have been here. Send a message.
- **Ticket desk**. Remember this exhibition forever. Don't we all miss when we used to have proper tickets for events?
- **Temporary exhibition**. A frame of whatever is being made right now, maybe gets an specific tweet of mine sharing work in public.
- **Closed for maintenance**. A 404 that admits the room is shut.

## Acknowledgements

Amazing open source that makes this possible:

- **[Inter](https://rsms.me/inter/)** by **Rasmus Andersson**
- **[Agentation](https://www.npmjs.com/package/agentation)**

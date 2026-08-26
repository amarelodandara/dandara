# Full CV — the source pool, not a document

**This file is never rendered, never generated, never sent.** It is the
superset: every true thing about Nicoly's career, written in résumé-ready
language, so that tailoring is an act of *selection* rather than invention.

`src/lib/cv/load.ts` only ever resolves `base.<lang>.md` at this root or
`tailored/<slug>.<lang>.md` below it. A file named `full.en.md` here cannot be
reached by the `/cv` route or by `npm run cv:pdf`. That is deliberate. Keep it
that way — never move this file into `tailored/`, and never add a `full`
variant.

**How the `tailor-cv` skill uses it:** read this file first, then `base.<lang>.md`.
The base is one already-tuned selection from this pool, useful as a shape and as
canonical wording. This file is the pool itself. Pick the bullets whose angle
matches the posting, keep the numbers exactly as written in *Fixed facts*, and
never write a line that is not derivable from something below.

---

## Fixed facts — never alter these

Anything in this section is load-bearing. Tailoring may reword the prose around
a fact; it may never change the fact.

**Identity**
- Nicoly Dandara. Product Designer.
- nicolydndr@gmail.com · adandara.com · linkedin.com/in/nicolydandara · github.com/amarelodandara
- Brazil. Remote. Available in Americas and European time zones.
- Portuguese — native. English — professional working proficiency (writes and
  ships in English; this site, its README, and its documentation are hers).

**Employment**
- Stone Co. — Product Designer — Remote, Brazil — 06/2022 – 03/2026.
- QuintoAndar — Product Designer — Remote, Brazil — 12/2021 – 04/2022.
- 03/2026 – Present — self-directed. See *The current period* below for the
  three ways it can honestly be written.

**Education**
- Universidade Estadual de Minas Gerais — Bachelor's in Graphic Design —
  05/2021 – Present. **Not yet graduated.** Thesis in progress; field research
  runs 09/2026 – 10/2026, defence after that.
- Centro Federal de Educação Tecnológica de Minas Gerais — Technical Degree in
  Computing — 05/2017 – 03/2021. Conclusion project: Serase, a mobile personal
  finance app for low-income users.

**Numbers that may be cited, exactly as stated**
- 22+ Android device models her Stone work ran across.
- 4.5M+ active payment terminals running it.
- 2 zero-to-one product launches at Stone, across 3 platforms and 4 organizations.
- 14 named apps in the Stone terminal suite she worked across: Activation Flow,
  Cancelation, Closing, News, Paper Roll Orders, Payment, Pix and Pix NFC,
  Pre-Authorization, Receipts, Sales Reports, Sales Simulation, Store, System
  Launcher, Tickets.
- QuintoAndar is Brazil's largest rental platform.
- 200+ vetted venues in the Belo Rolê directory.
- 5+ years designing overall (her own public phrasing on adandara.com);
  ~4 years 4 months of it in full-time product design roles. Use whichever is
  accurate to the claim being made, and never round either upward.
- Research figures belonging to *In Service of Museums*, not to her: Brazil has
  4,105 museums; Belo Horizonte has 223, 87% free admission, 62% running
  educational activities; Instituto Oi Futuro with Consumoteca (2019) found 52%
  of occasional museum-goers describe museums as monotonous. These are cited
  findings — attribute them to the research, never to her impact.

**URLs**
- adandara.com
- servico-museu.vercel.app · github.com/amarelodandara/servico-museu
- linksamarelos.com · nydndr.substack.com
- open.spotify.com/show/043Gs7eyY2KOlotEWSTSxB
- nydndr.notion.site/belo-role

---

## Summaries — pick one, then adjust

Each carries a different centre of gravity. Take the one nearest the posting and
bend it toward the posting's own vocabulary; do not stack two together.

### Product design emphasis
Product Designer, T-shaped across UX, UI, and code, designing software in-house
at consumer scale. Owns problems end to end — framing, exploration, validation,
ship, iterate — and defines the success criteria the work is judged by. Runs
lightweight research and usability experiments, reads qualitative and
quantitative signal together, and uses AI tooling daily from discovery through
production. Distils ambiguous problems and feedback into clear, focused
solutions, and communicates them in writing.

### Design engineering emphasis
Product Designer who works in the codebase. Designed payment terminal software
running across 22+ device models and 4.5M+ active payment terminals, and ships
her own products in TypeScript, React, and Next.js
— including an accessible animation system built on the Web Animations API and
a document pipeline that generates and verifies PDFs from source. Prototypes to
a production standard with semantic markup and accessibility handled, partners
with engineers as a peer rather than handing work off, and builds the internal
tooling that keeps design and engineering in step.

### Consumer-scale product emphasis
Product Designer who has shipped in-house software at national consumer scale.
Designed payment terminal software running across 22+ device models and 4.5M+
active payment terminals, working with Stone's Android
design system across a 14-app terminal suite, using its components where they
covered the surface and designing the screens and flows they did not. Works from
the shipped product backwards, and pairs directly with engineering so that what
ships matches what was intended.

### Research and service design emphasis
Product Designer with a service design practice, working from continuous
discovery through production. Runs usability experiments and customer
conversations, instruments her own work, and reads qualitative and quantitative
data together to decide direction. Author of an academic service design
framework for museum user experience, published as a public research site rather
than a PDF, and applied to a field study of educational museums in Belo
Horizonte.

### AI-native emphasis
Product Designer who uses LLMs as a daily instrument, not a demo. Prototypes,
drafts, and ships with Claude Code from discovery through production, and has
built working software with it — a personal site with its own document pipeline,
and a published research site — while keeping the judgement calls, the
accessibility, and the craft her own. Leverages AI without relying on it.

---

## Skills pool

Draw from these; rewrite them in the posting's terminology rather than pasting
the whole list. Anything here is defensible in an interview.

**Design**
Figma · prototyping · working within a design system · components ·
mockups and high-fidelity visuals · screens and flows · interaction design ·
motion and animation · typography · visual identity and logo design ·
information architecture · taxonomy · design critique and feedback ·
service design · service blueprints · accessibility

**Code and craft**
TypeScript · React · Next.js (App Router) · HTML and semantic markup · CSS ·
Tailwind CSS · Web Animations API · MDX · Playwright · ESLint · Git and
GitHub · Vercel · Android (design side, in-codebase) · APIs and integrations ·
prototyping in code to production standard

**AI**
Claude Code daily, discovery through production · LLM-assisted prototyping ·
skills and agent tooling · building internal tools on top of models

**Research and process**
Usability testing and experiments · continuous discovery · qualitative and
quantitative analysis · customer conversations · defining success criteria and
metrics · scoping and prioritisation · async written communication ·
documentation · public speaking

**Domain**
Payments and fintech · point-of-sale and terminal hardware · Pix · marketplaces
and rentals · consumer scale · museology and cultural institutions ·
publishing and editorial

---

## Professional Experience

### Stone Co. — Product Designer
Remote, Brazil | 06/2022 - 03/2026

Stone is one of Brazil's largest payments companies. Nicoly designed the
software running on its credit card machines — an in-house consumer product at
national scale, on constrained hardware, where a bad screen costs a merchant a
sale.

**Scale, and working with the design system**
- Designed payment terminal software running across 22+ device models and 4.5M+
  active payment terminals, delivering consistent, high-quality payment UX
  nationwide.
- Worked with Stone's Android design system across a 14-app terminal suite —
  payment, Pix and Pix NFC, receipts, closing, reports, pre-authorization,
  cancelation, the app store and the system launcher — using its components
  wherever they covered the surface she was designing for.
- Designed against hardware constraints — small screens, wide device
  fragmentation, thermal-printed receipts — where a screen had to hold up on the
  oldest terminal in the fleet, not the newest.

**Do not write, per Nicoly, 2026-08-26:** that she built, maintained, or owned
Stone's design system; that she held design-to-code parity; that she worked
inside the component code or reviewed its implementation in PRs. She was a
consumer of the system, it did not fully cover her area of the company, and
these were an earlier draft's inference rather than her account.

**Ownership, zero-to-one, and scope**
- Led 2 zero-to-one product launches across 3 platforms and 4 organizations,
  scoping and proposing the work, distilling ambiguous problems into focused
  solutions, and aligning cross-functional stakeholders.
- Proposed work that was not assigned to her, carried it through approval, and
  saw it into production — the launches began as her framing of a problem, not
  as a brief handed down.
- Coordinated across four separate organizations inside the company to ship a
  single product, negotiating scope and sequencing between teams that did not
  share a roadmap.

**Craft under time pressure**
- Refined key screens and flows for a new payment technology as sole designer,
  defining success criteria and delivering production-ready specs under a
  compressed timeline, combining speed with craft.
- Was the only designer on that surface: framing, exploration, interaction
  detail, spec, and hand-through to engineering all sat with her.
- Held quality on details a rushed process usually drops — states, edge cases,
  error copy, and what the terminal does when the network does not.

**Research, data, and success criteria**
- Defined the success criteria her own work was measured against, rather than
  inheriting them, and adjusted direction on what the numbers showed after
  release.
- Used qualitative and quantitative signal together — support themes, field
  feedback from merchants, and product analytics — to choose between options.

**Communication and influence**
- Communicated design decisions in writing to an async, cross-functional
  audience, and used that writing as the mechanism of alignment rather than
  meeting attendance.
- Presented the Stone Terminal Store on stage, explaining the product and its
  design rationale to an audience outside her own team.
- Gave and took design critique as routine practice, and made review a place
  where work improved rather than a gate it passed.

### Independent — Design and Engineering
Remote, Brazil | 03/2026 - Present

See *The current period* below before writing this into a résumé — the framing
depends on the posting, and one of the three options is to leave it out.

- Designed and shipped two production websites end to end — concept, visual
  identity, interaction design, front-end implementation, accessibility, and
  deployment — working alone in the codebase from empty repository to live URL.
- Built adandara.com, a personal portfolio designed as a museum exhibition,
  including an interruptible Web Animations API zoom system, an accessible modal
  layer, and a local document pipeline that generates and verifies ATS-readable
  PDFs from markdown source.
- Built and shipped servico-museu.vercel.app, publishing an in-progress academic
  service design research project as a reading experience rather than a PDF,
  including a searchable index of the institutions inside the study's scope.
- Ran the field-research design for the museum study: recruitment materials, the
  participation ask, and the qualifying instrument museums use to check whether
  they fall inside the sample.
- Used Claude Code as the daily working environment across both products, from
  first sketch to production deploy.

### QuintoAndar — Product Designer
Remote, Brazil | 12/2021 - 04/2022

QuintoAndar is Brazil's largest rental platform.

- Designed and iterated on mockups, high-fidelity prototypes and production
  features for Brazil's largest rental platform, pairing with engineering and
  product through continuous discovery and delivery, running usability
  experiments and using qualitative and quantitative data and user feedback to
  drive decisions.
- Worked in continuous discovery and continuous delivery in parallel, so
  research fed the next iteration rather than a future project.
- Ran usability experiments on live flows and used the results to settle
  direction between competing options.
- Paired directly with engineers and product managers inside a squad rather than
  delivering finished files to it.

---

## The current period — 03/2026 to now

Nicoly left Stone in 03/2026 and has been on a deliberate sabbatical since. It
is real, it is chosen, and it is not idle: two shipped products and an active
academic thesis came out of it. There are three honest ways to present it, and
the right one depends on the posting.

1. **As an experience entry** — *Independent — Design and Engineering,
   03/2026 – Present*, as written above. Best for design engineering and
   generalist roles, where the shipped code is the strongest evidence in the
   whole résumé. It also removes the gap without a word of explanation.
   **This is the default. Nicoly chose it on 2026-08-26, and `base.en.md` and
   `base.pt.md` now carry it.** Depart from it only when the posting gives a
   reason, and say so in the report.
2. **As projects only** — leave the experience section ending at Stone and let
   adandara.com and *In Service of Museums* carry the period from the Projects
   section. Best for conservative product design postings that read an
   employment section literally.
3. **Named plainly** — *Sabbatical, 03/2026 – Present*, with a single line on
   what shipped during it. Best where the culture rewards directness and where a
   cover letter or screen will raise it anyway.

Never disguise it, never stretch the Stone end date, and never describe the
period as freelance or contract work — no client work was sold.

---

## Education

### Universidade Estadual de Minas Gerais — Bachelor's in Graphic Design
05/2021 - Present

- Thesis: Service Design Framework for Museum User Experience — a framework for
  the museo-educational institution, at the intersection of museology, service
  design, and information design. Co-authored with Letícia França under the
  advisorship of Simone Souza. Field research 09/2026 – 10/2026; defence after.
- Trained across the physical craft of graphic design — typography, print,
  materials, visual systems — alongside the digital practice.
- **Not yet graduated.** Write "expected" only if the posting asks for a date,
  and never assert completion.

### Centro Federal de Educação Tecnológica de Minas Gerais — Technical Degree in Computing
05/2017 - 03/2021

- Conclusion project: Serase, a mobile application for personal finances for
  low-income users.
- A four-year technical degree in computing taken alongside secondary education
  — the source of the code fluency that predates the design career. Worth
  surfacing for any design engineering role; usually cuttable for pure product
  design ones.

---

## Projects

Ordered by how much weight they can carry on a résumé, not by date.

### adandara.com — personal site and document pipeline
Design, front-end, and infrastructure, 2026. https://adandara.com

The strongest single artefact for a design engineering role: a designed product
that she also engineered, with real constraints solved in real code.

- Designed and built a personal site as a museum exhibition — the landing is the
  entrance wall, work hangs on a wall the visitor can move around and get closer
  to, and the gift shop holds everything a personal site bureaucratically needs.
- Built a wall of work laid out by a seeded grid: each sheet holds a column and
  a row, wanders inside its cell on mount, and takes a shuffled position in the
  stack, so reading everything requires dragging sheets aside — interaction is
  the mechanism, not the decoration.
- Implemented an interruptible zoom-and-blur interaction on the Web Animations
  API: animations are cancellable mid-flight, zoomed sheets are exposed as ARIA
  modals one at a time, the background is made inert, and a double click cannot
  start a second animation on top of the first.
- Built a dev-only document pipeline behind the gift shop: markdown résumé
  sources parsed by a hand-written grammar that fails with a file and line
  number, rendered through the site's own type system, printed to PDF with
  Playwright, then scored for ATS keyword coverage and verified for
  text-layer readability against the finished PDF's own text — so the reported
  number can never drift from the document.
- Wrote the parser, the scorer, the verifier, the OG image generator, and the
  agent skill that drives them, and kept the whole pipeline out of production by
  construction rather than by configuration.
- Next.js App Router, TypeScript, Tailwind CSS, self-hosted Inter, deployed on
  Vercel, linted with ESLint plus the sonarjs, unicorn, security, and
  better-tailwindcss plugins.

### In Service of Museums — a serviço do museu
Research, design, front-end, and identity, 2026. https://servico-museu.vercel.app

Her academic thesis, published as a website instead of a PDF — the site is part
of the argument, not just its container.

- Co-authored an academic service design and information design framework for
  the museo-educational institution, aimed at the gap between what policy
  documents tell a museum to do and how a museum team is meant to do and measure
  it.
- Designed and built the research site in Next.js, TypeScript, MDX, and
  Tailwind: sidenotes that sit beside the paragraph instead of at the foot of
  the page, an inline glossary so no museology term costs the reader a tab,
  light and dark themes resolved before first paint, and a shader-driven hero.
- Gave every figure its own page and its own share card, so passing a figure
  along passes the figure rather than the homepage, and added PNG export so a
  figure can leave the site as an image.
- Built a fuzzy search over the Belo Horizonte institutions inside the study's
  scope, so a museum worker can type their institution's name and find out in
  one field whether the research is asking anything of them.
- Designed the recruitment path end to end: the qualifying instrument, the
  explanation of what participation costs, and three contact channels chosen
  because museum staff do not all live in the same inbox.
- Designed the project's identity and logo — a wave shader for a city named
  after horizons, framed like a hanging work.
- Shipped a 500-word digest and the 7,000-word academic version as downloads,
  plus JSON-LD research metadata, sitemap, robots, and a PWA manifest with the
  whole icon set generated from one master file by a Python tool.
- Written and shipped in pt-BR only, deliberately — no language negotiation, so
  the copy layer stays a plain synchronous file.

### crayola — asset generation tool
Design and front-end. Personal tool.

- Built a Remotion-based tool for producing yellow assets, turning a repeated
  manual production task into something programmatic.
- Small, but the cleanest example of the instinct DuckDuckGo's posting names
  directly: building tools that accelerate a design workflow.

### links amarelos — newsletter
Writing, editorial, and design. https://linksamarelos.com · https://nydndr.substack.com

- Self-published monthly newsletter of curated link roundups and original essays
  on media and internet culture, written and shipped async.
- Four years of a shipping cadence held alone, which is the evidence behind any
  claim about written communication.

### ondas amarelas — podcast
Production, sound design, and cover art. https://open.spotify.com/show/043Gs7eyY2KOlotEWSTSxB

- Self-produced podcast of long-form audio essays on media and culture, with
  original sound design and original cover art for the show and each episode.

### hyperlinks amarelos — essay podcast
Writing and production.

- A second, essay-form podcast. Mention only when the posting rewards a body of
  published work; otherwise it competes with ondas amarelas for the same line.

### Belo Rolê — public directory
Information architecture. https://nydndr.notion.site/belo-role

- Public Notion directory of 200+ vetted venues in Belo Horizonte, structured
  with a custom taxonomy and information architecture.
- The taxonomy is the work: the entries are only useful because the structure
  makes them findable.

### Belo Museu, em números — data visualization
Data visualization.

- Dashboard built on open-source Brazilian museum datasets, and the quantitative
  groundwork the museum thesis later stood on.

---

## Speaking and public work

- Presented the Stone Terminal Store on stage, to an audience beyond her team.
- Publishes work in progress in public — the museum site's development was
  shared as it was built.
- Writes and ships two publications on a self-imposed schedule.

---

## What Nicoly cannot claim

Read this before writing a bullet that flatters a requirement. If a posting asks
for something here, the honest move is to say so in the report and lead with the
strengths that are real.

- **Not 7+ years of product design.** ~4 years 4 months in full-time product
  design roles (12/2021 – 03/2026), and 5+ years designing overall counting
  independent and pre-professional work. Nothing above that.
- **Never held a Senior title.** Both roles were Product Designer. Seniority can
  be argued from scope — sole designer on a payment technology, self-scoped
  zero-to-one launches — but the title cannot be written down.
- **Stone is national, not global.** Massive consumer scale inside Brazil.
  Do not write "global brand."
- **No management or direct reports.** Led projects and aligned stakeholders;
  never led people.
- **No iOS or Apple platform work.** The native experience is Android.
- **Not yet graduated.** The degree is in progress.
- **No agency or client-services background**, and no freelance client work
  during the sabbatical.
- **No formal accessibility certification.** The practice is real — ARIA modals,
  inert backgrounds, semantic markup — the credential is not.
- **The museum research figures are cited, not achieved.** They belong to the
  study; they are not her outcomes.
- **She did not build or own Stone's design system.** She used it where it
  covered her area, and it did not cover all of it. No design-token authorship,
  no design-to-code parity ownership, no PR-review participation on component
  code. Design system depth is a gap for design engineering postings that ask
  for token layering or primitive-vs-semantic naming — say so plainly.
- **Most Stone impact numbers are scale, not lift.** She can say 4.5M+ terminals
  and 22+ device models because those are the surface she owned. She does not
  have a public conversion or revenue delta to attach to a specific change, and
  one must never be invented to fill the shape of a metrics bullet.

---

## Angle notes for the two reference postings

Kept as worked examples of how to select from this file. They are not the only
two shapes, and they should be updated when better reference postings arrive.

### Resend — Product Designer (product design track)
Wants: end-to-end ownership, lightweight self-serve research, talking to
customers, shipping improvements that move key metrics, prototyping with AI
tools, removing complexity, craftsmanship and small details, clear intentional
communication, a developer-facing product.

Lead with: the product design summary; Stone's sole-designer payment technology
work and the self-scoped zero-to-one launches; defining her own success
criteria; QuintoAndar's continuous discovery and usability experiments; Claude
Code as a daily instrument. adandara.com belongs here too — a developer-facing
company will read a designer who ships her own code as craft, not as a
distraction.

Watch: the posting asks for metric movement. She has scale, not lift. Write
ownership and success-criteria language honestly and do not manufacture a
percentage.

### DuckDuckGo — Senior Product Design Engineer (design engineering track)
Wants: 7+ years including 2+ senior at global consumer brands, prototyping in
code to production standard, semantic markup and accessibility, design systems
beyond component inventory — token layering, primitive vs semantic naming,
design-to-code parity — reasoning with engineers in PR reviews, motion
variables, qual and quant research with self-instrumentation, building tools
that accelerate design and engineering workflows, AI leveraged not relied on.

Lead with: the design engineering summary; adandara.com's animation system,
ARIA modal layer, and document pipeline; the Stone terminal work as consumer
scale on constrained hardware; the museum site's theming,
figure pages, and accessibility; crayola and the CV pipeline as workflow tools;
the CEFET computing degree.

Watch: four requirements cannot be met — the 7+ years, the senior title,
"global" consumer brand, and the design system depth they describe (token
layering, primitive vs semantic naming). Her systems experience is use, not
authorship. Say all three plainly in the report. The counterweight
is that almost every *capability* in the list has direct evidence, which is a
strong application at a stretch level, not a dishonest one.

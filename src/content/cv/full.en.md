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

Pick from the *Accomplishments bank (STAR)* first. Its rule governs every
tailored line: never change the meaning of the words, never diminish or
enlarge a feat, but play with the target words to hit the ATS.

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
- Stone Co. — Product Designer — Remote, Brazil — 06/2022 – 03/2026. Joined as
  Junior; promoted to Mid-level (Pleno in Portuguese) in 04/2024.
- QuintoAndar — Junior Product Designer (Product Designer Júnior) — Remote,
  Brazil — 12/2021 – 04/2022.
- TeamHub — Front End Developer, intern — 02/2021 – 11/2021. HR tech
  platform; React front end.
- 03/2026 – Present — self-directed. See *The current period* below for the
  three ways it can honestly be written.

**Education**
- Universidade Estadual de Minas Gerais — Bachelor's in Graphic Design —
  05/2021 – Present. **Not yet graduated.** Thesis in progress; field research
  runs 09/2026 – 10/2026; defence scheduled for the end of 11/2026.
- Centro Federal de Educação Tecnológica de Minas Gerais — Technical Degree in
  Computing — 05/2017 – 03/2021. Conclusion project: Serase, a mobile personal
  finance app for low-income users.

**Numbers that may be cited, exactly as stated**
- 22+ Android device models her Stone work ran across.
- 4.5M+ active payment terminals running it.
- 2 zero-to-one product launches at Stone, across 3 platforms and 4 organizations.
  One of them is the Stone Terminal Store, still live as of 2026-09.
- 40% of Stone's ~212 partners (about 85) had fully moved to the Stone
  Terminal Store within 6 months of launch (per the bank, 2026-10-14; earlier
  drafts said 40%+ and attached it to Pix NFC — both superseded). Her one lift
  number. It was a team result on a product she led: write it as the Store's
  adoption, never as her personal achievement, and never round it up. Never
  attach it to Pix NFC or any other flow.
- 14 named apps in the Stone terminal suite she worked across: Activation Flow,
  Cancelation, Closing, News, Paper Roll Orders, Payment, Pix and Pix NFC,
  Pre-Authorization, Receipts, Sales Reports, Sales Simulation, Store, System
  Launcher, Tickets.
- R$ 9,590,793.58 (R$ 9.6M) monthly TPV processed by the full Store partner
  base through merchants' partner apps. The base's size, not her result.
- 7 users in the Store's usability tests.
- Ticketing app: 8th most downloaded and accessed of 33 apps on the terminal
  App Store.
- News automation: four teams down to one (marketing); about a week of
  cross-team sign-off removed per campaign; 2 typefaces and 3 images per issue.
- Pix NFC: live on day one of the Central Bank mandate (2025-02-28) after a
  3-month pilot (testing from 11/2024); Stone and Ton brands.
- Stone Stage talk: audience of about 100.
- 3-person design team (at its peak); 10 designers in the tribe.
- QuintoAndar: 8 buyer interviews, run with a senior designer.
- TeamHub: 50+ client companies, including one major statewide hospital
  network.
- In Service of Museums: 8 interviews with museum professionals (2 to 12 years
  of experience) in two weeks.
- Links Amarelos and Ondas Amarelas: monthly since 09/2025; 5-star rating on
  Spotify. No audience numbers, ever.
- Serase: 6-student team; full marks in every evaluation.
- #1 Junior UI/UX Designer, UI/UX Junior 15-day design challenge, late 2021.
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
- medium.com/design-bootcamp/the-designer-archetype-b3027b2ec995
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
metrics · scoping and prioritisation · workshop facilitation (discovery and
Design Thinking, journey mapping, kickoff and alignment, co-creation and
critique) · user journey mapping · writing user stories · Jira and Confluence ·
agile squad rituals · async written communication · documentation ·
public speaking

**Domain**
Payments and fintech · point-of-sale and terminal hardware · Pix · marketplaces
and rentals · consumer scale · museology and cultural institutions ·
publishing and editorial

---

## Accomplishments bank (STAR) — the canonical bullets

Written by Nicoly, 2026-10-14, and imported here from her *STAR
Accomplishments Bank*. **Where this bank and anything older in this file
disagree, the bank wins.** It is the first place to pick bullets from; the
*Professional Experience* section below is the older pool and still holds
wording the bank does not cover.

**The tailoring rule, in Nicoly's words:** never change the meaning of the
words, never diminish or enlarge the feat, but play with the target words to
hit the ATS. In practice:

- Pick items by matching their **Tags** to the posting.
- Start from the item's **Resumé bullet**. Swap vocabulary for the posting's
  own terms where they mean the same thing (*cross-functional* for
  *multidisciplinary*, *self-serve* for *self-service*, *tap to pay* for
  *NFC*), shorten by cutting clauses, and reorder clauses so the posting's
  keyword lands early.
- Never change who did it (sole designer, with a senior designer, as the junior
  designer, as an intern), the scope (partner side, not the whole Store), a
  number, or a result. Never turn a team result into a personal one, a
  contribution into ownership, or a qualitative result into a metric.
- The **STAR** lines are for interviews and longer LinkedIn entries. A tailored
  bullet may draw a detail from them, as long as the detail is stated there.
- Each **Note** is load-bearing. Read it before using its item.
- Bracketed *[optional: …]* lines are open slots Nicoly has not filled. Never
  fill them by guessing.

### Stone Co. — App Store for payment terminals

**1. Replaced an in-person sales process with a self-serve partner app store**
- Resumé bullet: Led service and product design for the partner side of Stone's
  App Store for payment terminals, replacing an in-person, manually unlocked
  distribution process; within 6 months of launch, 40% of Stone's ~212 partners
  had fully moved to the new self-serve flow.
- Alt. bullet (with TPV): Designed the partner experience of Stone's App Store
  for payment terminals; in 6 months, 40% of a ~212-partner base processing R$
  9.6M in monthly TPV through their apps committed fully to the store.
- S: Merchants could only get partner apps through a commercial agent who
  pitched them in-store, then filed a manual request to unlock that app on that
  merchant's specific device.
- T: Design the internal workings of a new App Store: how partners submit and
  manage apps, and the service behind it.
- A: Designed the partner submission and management flows and the end-to-end
  service, working with a senior designer who owned the merchant-facing side,
  two cross-functional squads (PMs, front-end and back-end engineers), QA, Data
  and Content. Launched with two first-party Stone apps as showcases, ran
  usability tests with 7 users, and followed the new system closely with
  internal teams after launch.
- R: Within the first 6 months, 40% of the ~212 partners (about 85) were fully
  committed to the new flow and live on the store. The full partner base
  processes R$ 9,590,793.58 in monthly TPV through merchants' partner apps.
- Tags: service design, multi-sided marketplace, partner / developer
  experience, adoption, measurable outcomes, end-to-end ownership, usability
  testing, cross-functional collaboration, fintech, payments, POS
- Note: the TPV is the size of the partner base, not something the Store
  produced. Write it as the base's volume, never as revenue she generated. The
  merchant-facing side was a senior designer's; hers is the partner side.

**2. Created the partner quality rules that kept the store scalable**
- Resumé bullet: Pushed for and wrote the App Store's partner requirements
  (data use, brand use, differentiation from Stone's own apps) against team
  pressure to focus on screens, preventing a QA bottleneck that would have
  stalled the launch.
- S: The team wanted to spend design time on screens, not on a written rule
  system for what partner apps must and must not do.
- T: Make sure the store could scale without flooding QA with reviews or
  confusing merchants.
- A: Argued the case and defined the quality bar: what apps must include, what
  they must not do, and how far partners could use Stone's brand without
  merchants mistaking them for Stone products.
- R: The store launched without rolling back and grew to about 85 partners (40%
  of the base) in its first 6 months under these rules.
- Tags: platform policy, design leadership, stakeholder influence, systems
  thinking, trust and safety, brand governance, ambiguity

**3. Designed around hard device and support constraints**
- Resumé bullet: Designed app distribution within a strict mobile-data budget
  on payment terminals and kept partner apps visibly distinct from Stone's own,
  so partner problems didn't land on Stone's customer support.
- S: Terminals ran on a very limited data budget, and merchants called Stone's
  support for any problem on the device, including partner offers.
- T: Let merchants install partner apps without blowing the data budget or
  overloading support.
- A: Designed distribution so merchants could not download apps freely,
  protecting the data budget, and defined how partner apps had to differ from
  Stone apps in brand and content.
- R: Partner apps reached merchants within the terminals' data limits and with
  a clear line between Stone's offer and partners' offers.
- Tags: constraints, edge cases, service design, support deflection, hardware /
  embedded UI, payments

**4. Presented the App Store to Stone's design and management teams**
- Resumé bullet: Presented the App Store's design and service model on Stone
  Stage, an internal event for the design and management teams, to an audience
  of about 100 people.
- S: Stone Stage is an internal showcase where teams present work to the design
  and management organization.
- T: Explain the App Store's design and the service behind it to designers and
  managers outside the project.
- A: Prepared and delivered the talk, presenting the terminal App Store on
  stage.
- R: Shared the work with roughly 100 people in the auditorium. *[optional: any
  follow-up, e.g. other teams adopting the rules or reaching out]*
- Tags: communication, storytelling, presenting to leadership, design advocacy

### Stone Co. — Pix NFC payment flow

**5. Shipped Pix by NFC across 22+ terminal models, ahead of competitors**
- Resumé bullet: Took over as sole designer and shipped Pix by NFC (tap to pay)
  for the whole Stone Co. group, across 22+ terminal models of its Stone and Ton
  brands, live on day one of the Central Bank mandate after a 3-month pilot;
  competitors copied the flow and press coverage used Stone's interface as the
  reference example.
- S: Pix was already Brazil's main digital payment method, and NFC was about to
  become a new way to pay with it. Stone learned early and wanted to launch
  before competitors.
- T: Inherited the project when the previous designer left the team, and had to
  ship it across Stone's whole terminal fleet on a tight timeline.
- A: Designed the flow for the whole Stone Co. group, covering both terminal
  brands (Stone and Ton) across more than 22 device models with different
  sizes, orientations, physical keys and color rendering, working with Product
  Managers and a core engineer. Handled the regulatory side too, including
  retiring devices that could no longer support NFC payments under the new
  rules.
- R: Stone was one of the first to market. Competitors visibly copied the
  design, and media coverage of Pix NFC used Stone's interface as its example,
  giving the company earned marketing.
- Tags: first to market, speed, multi-device design, design systems across
  hardware, regulatory constraints, ownership, payments, Pix, NFC, fintech, POS
- Note: adoption of Pix NFC stayed low across the whole market, so lead with
  speed and influence, never volume. The Store's 40% is not this flow's number.
- Proof: cover images showing a Stone terminal running the flow —
  https://www.serasaexperian.com.br/conteudos/pix-por-aproximacao/ (Serasa
  Experian, 2025-02-28, a major Brazilian credit bureau) and
  https://www.iugu.com/blog/pix-por-aproximacao (iugu, first published 2025-06,
  updated 2026-06, a competing payments company).
- Timeline proof:
  https://braziljournal.com/brands/como-a-stone-transformou-o-pix-em-uma-oportunidade-de-ganhos-para-os-mpmes
  (Brazil Journal, 2025-01-09): Stone began testing Pix NFC in 11/2024, about
  three months before it went live nationally on 2025-02-28. It runs in the
  Brands section as Stone-sponsored content — cite it for dates, never as
  independent praise.
- Partnership context:
  https://agenciabrasil.ebc.com.br/economia/noticia/2025-02/entenda-como-funcionara-pix-por-aproximacao
  (Agência Brasil, 2025-02-27) lists Stone among the 12 terminal brands that
  partnered with Google on tap-to-pay for Pix. **The Google partnership was
  coordinated by engineering and the C-level, not by Nicoly. Never claim it as
  her work.**
- Launch proof:
  https://www.cnnbrasil.com.br/economia/money/macroeconomia/stone-informa-que-pix-por-aproximacao-ja-esta-disponivel-em-maquininhas-stone-e-ton/
  (CNN Brasil via Estadão Conteúdo, 2025-02-28): Stone enabled Pix by NFC on
  both Stone and Ton terminals the day it became mandatory, for most merchants
  already accepting Pix, after a testing phase.

**6. Chose market validation over up-front research to hit the launch window**
- Resumé bullet: Made the case to build on users' existing tap-to-pay habits
  instead of running lengthy up-front research, validating in the market to hit
  the launch window, and pushed support and marketing to teach merchants and
  consumers the new payment option.
- S: Being first to market mattered more than a perfect first version, and NFC
  card payments were already familiar to merchants and consumers.
- T: Decide how much research was needed before shipping, and make sure people
  would understand a new way to pay.
- A: Argued that the team could rely on the existing tap-to-pay mental model and
  learn faster from market testing than from extensive research. Also made the
  case that support and marketing needed to educate merchants and consumers,
  since most were not following Pix NFC closely.
- R: Stone shipped among the first, and the launch was supported by customer
  education from support and marketing. *[optional: any support ticket or
  onboarding data after launch]*
- Tags: product judgment, research strategy, risk tradeoffs, speed vs
  certainty, cross-functional influence, customer education, go-to-market

### Stone Co. — Ticketing app

**7. Designed and owned a ticketing app that became the store's 8th most downloaded**
- Resumé bullet: As sole designer, owned Stone's ticketing app for events end to
  end (UX, interface, roadmap and user feedback), giving merchants a free
  in-terminal alternative to bloated subscription apps; it became the 8th most
  downloaded and accessed of 33 apps on the terminal App Store, ahead of
  established partner apps.
- S: At events like fairs, customers buy tickets first and redeem them later,
  for food for example. Merchants who ran events only part of the time (about
  20% of their activity, not their main revenue) relied on bloated,
  subscription-based partner apps, and smaller ones used paper.
- T: Give these merchants a simple ticketing tool that runs entirely on the
  payment terminal.
- A: Sole designer, owning interface design, user experience, the roadmap of
  future additions, and monitoring and collecting user feedback. Designed setup
  and catalog management to happen directly on the terminal, with no other
  device needed.
- R: Became the 8th most downloaded and accessed app out of 33 on the store,
  counting Stone's own apps and established partner apps.
- Tags: 0-to-1, end-to-end ownership, product strategy, roadmap, user feedback
  loops, POS, embedded UI, events, small business

**8. Shipped a deliberately minimal first version to learn from real use**
- Resumé bullet: Shipped the ticketing app's first version as a deliberately
  simple, CRUD-like tool to test demand, then used the flood of user feedback to
  learn how merchants actually ran their events and shape the roadmap.
- S: The team didn't yet know how merchants would really use an in-terminal
  ticketing app.
- T: Decide how much to build before learning from real users.
- A: Chose to release a first version as close to a plain
  create-read-update-delete tool as possible, with no extra features, and set up
  feedback collection from users.
- R: The feedback showed the first tickets were too easy to counterfeit. The
  next version added cheap, visual ways to authenticate them: QR codes, a
  prominent establishment name, and unique public data on each ticket.
- Tags: MVP, product judgment, iterative design, hypothesis-driven, user
  feedback, scope control, speed to learn

### Stone Co. — In-terminal news automation

**9. Turned a four-team campaign pipeline into a self-serve tool for marketing**
- Resumé bullet: Redesigned how in-terminal news campaigns reach merchants,
  replacing a hand-off across marketing, content design, product design and
  engineering with a self-serve portal where marketing publishes campaigns in
  markdown, cutting about a week of cross-team sign-off from every campaign and
  removing design and engineering from the process entirely.
- S: Stone's terminals show merchants short news issues (new technologies,
  promotions) through an in-device app. Each campaign needed marketing to write
  and document it, content design to review it, product design to assemble it
  in Figma, and developers to send it to devices as an image.
- T: Remove the bottleneck so campaigns could ship without design and
  engineering work every time.
- A: Audited every past news campaign and built an inventory of the elements
  they needed, documenting the constraints that keep them working on every
  device. Worked with the network team to keep it within the data budget, and
  with the front-end team to build a portal where marketing uploads campaigns
  themselves in markdown.
- R: Went from four teams involved in every campaign to marketing running
  campaigns on its own. Since launch, campaign work stopped showing up in
  design, engineering and PM reviews. Designing a campaign used to take
  minutes, but getting sign-off from everyone involved took about a week; that
  approval loop is gone.
- Tags: service design, process automation, self-serve tooling, internal tools,
  operational efficiency, design systems, cross-functional collaboration,
  content operations
- Note: the portal was built by the front-end team. She designed the system and
  the service; never write that she built the portal.

**10. Designed a constraint system that renders reliably on every terminal**
- Resumé bullet: Defined a content system for news on 22+ low-end terminal
  models with different screens, color rendering and file support, limiting each
  issue to 2 typefaces and 3 images so any campaign displays correctly without
  design review.
- S: Terminals have small screens and low-end hardware, colors look different
  from device to device, and not all of them accept the same file formats.
- T: Make sure any campaign marketing publishes looks right on every device,
  with no designer checking it.
- A: Worked closely with development to assess every device and the
  technologies each one supports, then set hard limits: at most 2 typefaces and
  3 images per news issue, since anything more could not be controlled on
  screens that size.
- R: Campaigns published by marketing render consistently across the fleet
  without design or engineering involvement.
- Tags: design systems, constraints, multi-device design, hardware limits,
  accessibility of content, scalability, embedded UI
- Note: this content system is hers. It is not Stone's Android design system,
  which she used and did not build (see *What Nicoly cannot claim*). Never let
  the *design systems* tag on #9, #10 or #5 read as authorship of that one.

### Stone Co. — Core payment flows

**11. Maintained and improved core payment flows across the whole terminal fleet**
- Resumé bullet: Shipped ongoing improvements to core payment flows
  (pre-authorization, terminal activation, sale cancelation) across 22+
  terminal models of the Stone and Ton brands, working across many product
  contexts at once.
- S: Beyond larger launches, Stone's terminals needed a steady stream of small
  features and fixes in the flows merchants use every day.
- T: Keep those flows working and improving on every device in the fleet.
- A: Designed small features and improvements to pre-authorization, activation
  and sale cancelation, adapting each to the screens, keys and constraints of
  every terminal model.
- R: Kept core flows consistent across the fleet while covering a wide range of
  product areas at the same time.
- Tags: breadth, context switching, core flows, maintenance and iteration,
  multi-device design, payments, POS
- Note: a supporting bullet to show range. Pair it with a flagship story (#1,
  #5, #7 or #9); never lead with it.

### Stone Co. — Team practices

**12. Started the team's weekly critique and documentation rituals**
- Resumé bullet: Started a weekly critique and live-help ritual for my 3-person
  design team, then led a tribe-wide initiative with 10 designers to define
  shared documentation patterns in Confluence and Figma.
- S: The team had no regular moment to share work in progress or ask each other
  for help, and documentation across the tribe followed no common pattern.
- T: Improve collaboration and make the team's work easier to find and reuse.
- A: Created a weekly show-and-tell with time set aside for live help requests
  in my team, then led a second, tribe-wide ritual to agree on documentation
  patterns for Confluence and Figma.
- R: The weekly ritual ran with the full team (3 designers at its peak), and the
  documentation patterns were adopted across the tribe's 10 designers.
- Tags: design culture, collaboration, critique, documentation, design
  operations, initiative, leadership without authority
- Note: "my 3-person design team" is the team she sat in, not one she managed.
  On a résumé write "my 3-person design team" or "a 3-person design team",
  never "led a team of 3".

### QuintoAndar — Junior Product Designer (12/2021 – 04/2022)

Context: closing team for property sales, at the moment buyers sign the
purchase contract. The team mainly owned the internal system analysts use to
check that the people and the property in a sale are in order.

**13. Redesigned the due-diligence report buyers receive before signing**
- Resumé bullet: Redesigned QuintoAndar's due-diligence report for home buyers
  (a PDF covering the sellers and registry findings), turning a document buyers
  called confusing and stern into a clear one, based on 8 interviews run with a
  senior designer.
- S: Before signing, buyers received a PDF with everything known about the
  sellers and what registries had found. Buyers said it was confusing and
  stern, at one of the most stressful moments of their lives.
- T: Redesign the document so buyers understand what matters at a tense moment.
- A: As the junior designer, paired with a senior designer to run 8 interviews
  with buyers to learn what they actually needed to know at that point, then
  redesigned the document around it.
- R: Shipped the redesigned document. (Left the company before post-launch data
  was available.)
- Tags: user research, interviews, information design, content design, trust,
  high-stakes moments, proptech, real estate, document design
- Note: no post-launch data exists. Never write an outcome beyond "shipped".

**14. Introduced a risk scale and aligned it with Legal**
- Resumé bullet: Designed a scale showing buyers how safe or risky a purchase
  was based on registry findings, and worked with Legal to define how
  QuintoAndar could say it without taking on liability.
- S: Buyers struggled to judge what the findings in their report meant for their
  purchase.
- T: Give buyers a quick read on risk without exposing the company legally.
- A: Proposed a scale from safe to risky based on what checks found, and amended
  the wording with Legal so it informed buyers without creating liability for
  the company.
- R: Buyers responded positively to the scale in user interviews.
- Tags: product judgment, legal and compliance collaboration, risk
  communication, trust, data visualization, stakeholder alignment

**15. Sped up analysts' work in the internal closing dashboard**
- Resumé bullet: Improved the internal dashboard analysts use to review each
  property sale, making case data easier to read and adding in-panel
  calculation tools so analysts could check figures without leaving the screen.
- S: Analysts reviewed each sale in an internal dashboard that was hard to read,
  and had to leave it to verify numbers.
- T: Help analysts review cases faster and with fewer interruptions.
- A: Fixed typography and layout to make each case easier to scan, and added
  quick calculation tools inside the panel.
- R: Analysts could verify figures without leaving the panel, removing a step
  from every case review.
- Tags: internal tools, B2B / back-office, operational efficiency, information
  hierarchy, typography, dashboards, small iterative improvements

### TeamHub — Front End Developer, intern (02/2021 – 11/2021)

Context: HR tech platform covering hiring, performance and team engagement.
Small team: one full-time back-end developer, one full-time full-stack
developer, and Nicoly as front-end intern. All-JavaScript stack, React on the
front end.

**16. Built an anonymous team-satisfaction survey tool in React**
- Resumé bullet: As a front-end intern, built TeamHub's anonymous pulse-survey
  feature in React, used by 50+ client companies, from small businesses to a
  major statewide hospital network, to check in on team satisfaction, company
  sentiment and employee wellbeing.
- S: TeamHub's HR platform needed a way for companies to regularly check how
  their teams felt.
- T: Build the front end of a periodic, anonymous survey tool.
- A: Implemented the survey experience in React, with questions about the team,
  the company and employees' wellbeing, working with a back-end and a
  full-stack developer.
- R: Shipped to TeamHub's 50+ client companies, mostly small businesses plus one
  major statewide hospital network.
- Tags: front-end development, React, JavaScript, HR tech, surveys, anonymity
  and trust, shipping production code

**17. Spotted that users answered on their phones and adapted the design**
- Resumé bullet: Learned in client meetings that most employees answered
  surveys on their phones while commuting, though the product had only been
  designed for desktop, and designed and built a mobile-friendly version,
  joining client meetings and working in Figma to shape it.
- S: The company only had desktop designs, but most employees filled in surveys
  on their phones on the way to or from work.
- T: Make the survey work for how people actually used it.
- A: Joined client meetings to gather context and user needs, which is where the
  mobile pattern surfaced, designed the mobile experience in Figma, and
  implemented it in React.
- R: Shipped a survey that fit how employees actually answered it, on their
  phones, across 50+ client companies.
- Tags: design engineering, mobile-first, responsive design, user needs, client
  research, Figma, React, bridging design and code
- Note: this is the first recorded place for *responsive design*. It may sit
  in a TeamHub bullet.

### Personal projects — Links Amarelos and Ondas Amarelas

**18. Created and run a curated newsletter and podcast end to end**
- Resumé bullet: Have published Links Amarelos, a monthly curated newsletter,
  and its podcast version Ondas Amarelas every month since September 2025,
  handling curation, writing, recording, production, editing and distribution
  alone; the podcast holds a 5-star rating on Spotify.
- S: Since 2018, Nicoly has kept a personal Obsidian knowledge vault of links,
  references and notes.
- T: Turn that collection into regular public content people want to follow.
- A: Curates every edition from the vault, then writes the newsletter and
  records, produces and edits the podcast herself, managing the whole project
  solo. Designed and built the project's site, linksamarelos.com, in Next.js
  with AI-assisted coding.
- R: A monthly publishing streak unbroken since September 2025 and a 5-star
  rating on Spotify.
- Tags: content creation, curation, writing, audio production, editorial
  design, knowledge management, Obsidian, consistency, solo ownership, Next.js
- Note: Nicoly deliberately doesn't track audience metrics, so never add
  subscriber or listener numbers. Lead with consistency and end-to-end
  ownership. "AI-assisted coding" counts toward the two-mentions cap on AI in
  *The current period*.

### Personal projects — In Service of Museums (Graphic Design thesis, UEMG)

**19. Applied service design to the museum-going experience**
- Resumé bullet: Co-leading a Graphic Design thesis that applies service design
  to museum visits, a gap the research found unexplored, as the project's lead
  museology researcher; defense scheduled for November 2026.
- S: Service design thinking had not been applied to the museum-going
  experience. Visitors don't know what's on, can't tell who to contact to book
  group visits, never hear from the museum again after leaving, and often find
  exhibitions boring.
- T: Research where the museum experience breaks down and design a solution,
  combining museology and service design.
- A: Led the museology research in the first phase; now co-designing the
  solution artifact with a project partner as service and information
  designers.
- R: Solution artifact in progress, with the thesis defense scheduled for the
  end of November 2026. *[update after the defense: grade, feedback, any museum
  interest]*
- Tags: service design, research, museology, information design, cultural
  sector, journey mapping, academic research, collaboration

**20. Used a public research site to recruit 8 expert interviews in two weeks**
- Resumé bullet: Designed, wrote and built a public website (Next.js, Tailwind
  CSS, Paper Shaders) explaining the thesis research to recruit participants,
  securing 8 interviews with museum professionals (2 to 12 years of experience)
  in two weeks, online and in person.
- S: The research needed interviews with museum professionals, who are hard to
  reach without connections.
- T: Make the research visible and credible enough that professionals would
  volunteer their time.
- A: Designed the site in Paper, wrote all its content and built it in Next.js
  with Tailwind CSS and Paper Shaders (servico-museu.vercel.app), then shared
  it online and through personal networks.
- R: 8 interviews in two weeks with professionals ranging from 2 to 12 years of
  experience in the field, online and in person.
- Tags: research recruitment, user interviews, qualitative research, outreach,
  web design, front-end development, Next.js, Tailwind CSS, Paper, design and
  code, communication, initiative

### Writing

**21. Pitched and published a design essay in Bootcamp (UX Collective)**
- Resumé bullet: Wrote and pitched "The Designer Archetype", accepted and
  published by Bootcamp, the UX Collective publication on Medium (September
  2026). https://medium.com/design-bootcamp/the-designer-archetype-b3027b2ec995
- S: Nicoly writes about design on Medium and shares her posts on LinkedIn and
  X.
- T: Get her thinking in front of a wider design audience than her own channels
  reach.
- A: Wrote the essay and pitched it to Bootcamp herself. *[optional: the essay's
  main argument in one line]*
- R: Accepted and published by Bootcamp. Also writes on her own site, including
  "How I Obsidian" and "Museums and websites".
- Tags: writing, design thinking, communication, thought leadership,
  self-initiative
- Note: readership is still small, so lead with the editorial acceptance, never
  with reach.

Not yet in the bank: The color of water, Routiny, the teaser studio and the
Emicida dataviz. Add them once they ship.

### Education, competitions and recognition

**22. Led a 6-person team building a personal finance app for low-income users (CEFET-MG)**
- Resumé bullet: Led a 6-student team building Serase, a personal finance app
  for low-income people, as team lead, designer and front-end developer (React
  Native, with a Python/Django back end); earned full marks in every
  evaluation.
- S: Final project of the Computing Technician program at CEFET-MG, completed in
  early 2021.
- T: Build a working app with a team of 6 students, for an audience usually
  ignored by finance products.
- A: Led the team, designed the app in Figma and built its front end in React
  Native, with a Python/Django back end.
- R: Full marks in every evaluation.
- Tags: leadership, design and code, React Native, Figma, fintech, financial
  inclusion, teamwork
- Note: a student team, not direct reports. It does not change *No management*
  below.

**23. Won #1 Junior UI/UX Designer in a 15-day design challenge**
- Resumé bullet: Ranked #1 Junior UI/UX Designer in a 15-day design challenge
  run by the UI/UX Junior design community (late 2021), designing the
  onboarding flow for Fin, a personal finance app, from interviews with
  participants recruited on Twitter, and presented the case at the online
  awards ceremony.
- S: A 15-day design challenge run in late 2021 by UI/UX Junior, a design
  community still active today, asking participants to design a personal
  finance app's onboarding.
- T: Design an onboarding flow for Fin grounded in real user needs.
- A: Revisited lessons from Serase, recruited interview participants on
  Twitter, ran the interviews and designed the onboarding flow from what they
  revealed.
- R: Awarded #1 Junior UI/UX Designer and invited to present the case at the
  online ceremony.
- Tags: award, onboarding, user research, recruiting participants, fintech,
  presentation, speed

No courses, certifications or language credentials to list. Never add any.

---

## Professional Experience

### Stone Co. — Product Designer
Remote, Brazil | 06/2022 - 03/2026 | Promoted from Junior to Mid-level, 04/2024

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
- Led 2 zero-to-one product launches, including the Stone Terminal Store, still
  live, across 3 platforms and 4 organizations,
  scoping and proposing the work, distilling ambiguous problems into focused
  solutions, and aligning cross-functional stakeholders.
- Proposed work that was not assigned to her, carried it through approval, and
  saw it into production — the launches began as her framing of a problem, not
  as a brief handed down.
- Coordinated across four separate organizations inside the company to ship a
  single product, negotiating scope and sequencing between teams that did not
  share a roadmap.

**Craft under time pressure**
- Designed the Pix NFC payment flow as sole designer, defining its success
  criteria and delivering production-ready specs under a compressed timeline;
  40%+ of the partner base adopted it within 6 months.
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

**Facilitation and squad process**
- Facilitated discovery and Design Thinking workshops, journey-mapping sessions,
  kickoff and alignment sessions across teams, and co-creation and critique
  sessions with product and engineering.
- Wrote user stories and product documentation in Jira and Confluence, and
  followed the work through the squad's tickets from refinement to delivery.

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

### QuintoAndar — Junior Product Designer
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
- Facilitated discovery and journey-mapping workshops with product and
  engineering, and wrote the user stories and documentation the squad worked
  from in Jira and Confluence.

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
   Retired as the default on 2026-09-29: outside feedback read it as filler
   covering a gap, since it starts the month Stone ends and its two "production
   websites" are a portfolio and a thesis site.
2. **As projects only** — leave the experience section ending at Stone and let
   adandara.com and *In Service of Museums* carry the period from the Projects
   section. Best for conservative product design postings that read an
   employment section literally.
3. **Named plainly** — *Sabbatical, 03/2026 – Present*, with a single line on
   what shipped during it. Best where the culture rewards directness and where a
   cover letter or screen will raise it anyway.
   **This is the default. Nicoly chose it on 2026-09-29, and `base.en.md` and
   `base.pt.md` now carry it:** a *Sabbatical* entry with one line, and
   adandara.com and *In Service of Museums* moved into Projects as `###`
   entries that keep their technical bullets. Depart from it only when the
   posting gives a reason, and say so in the report.

Whichever framing is used, **AI tooling is named twice at most**, in the
summary and the skills. Outside feedback (2026-09-29) found that a third
mention made it read as a large share of her identity and discounted the solo
engineering work.

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
- A monthly shipping cadence held alone since 09/2025, which is the evidence
  behind any claim about written communication. (Corrected 2026-10-14: an
  earlier draft said "four years"; the bank dates it to 09/2025.)

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
- **Never held a Senior title.** Junior at QuintoAndar, Junior then Mid-level
  (Pleno) at Stone, promoted 04/2024. The promotion is worth showing; the
  highest title she can write is Mid-level. Seniority can
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
- **No courses, certifications or language credentials.** Never add any.
- **Never claim the Google tap-to-pay partnership.** Engineering and the
  C-level coordinated it.
- **No post-launch data for QuintoAndar.** She left before it existed.
- **No audience numbers for the newsletter, podcast or essays.** She does not
  track them, by choice.
- **The museum research figures are cited, not achieved.** They belong to the
  study; they are not her outcomes.
- **She did not build or own Stone's design system.** She used it where it
  covered her area, and it did not cover all of it. No design-token authorship,
  no design-to-code parity ownership, no PR-review participation on component
  code. Design system depth is a gap for design engineering postings that ask
  for token layering or primitive-vs-semantic naming — say so plainly.
- **Most Stone impact numbers are scale, not lift.** She can say 4.5M+ terminals
  and 22+ device models because those are the surface she owned. The one lift
  number is Stone Terminal Store adoption (40% of ~212 partners in 6 months);
  the bank adds outcome-shaped results (8th of 33 apps, a week of sign-off
  removed, four teams down to one) that may be cited as written. She has no
  conversion or revenue delta, and one must never be invented to fill the
  shape of a metrics bullet.

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

Watch: the posting asks for metric movement. Lead with the Pix NFC adoption
number, the one lift figure she has, and do not manufacture another.

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

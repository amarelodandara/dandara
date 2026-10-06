# Changelog

What changed on the site, newest first. Internal work (refactors, tooling, deploys) is left out.

Every entry starts with the area it affects: `[Home]`, `[Work]`, `[Blog]`, `[Gift shop]` or `[Site-wide]`.

## Week of October 5, 2026

### New
- [Home] **Links to Writing and Changelog** added at the bottom of the home page, as rounded panels in each area's colour. They lift with a small shadow on hover, and the arrow in each one turns from a random angle to point right.
- [Site-wide] **Changelog** at `/changelog` is now public: linked from the home page, listed in the sitemap and open to search engines.

### Improved
- [Home] **Footer panel** now lines up with the links above it: same width (30rem) and corner radius, and 12px below them instead of 6% of the screen height.

## Week of September 28, 2026

### New
- [Blog] **Writing index** added at `/writing`, listing every post grouped by year. The home page now shows only the newest three, with an "All writing" link.
- [Gift shop] **RSS feed** added to the gift shop on `/writing`, as a link you can copy. The shop's contents now change per page.
- [Home] **"Open for work" tag** added beside the "Find me" heading. It sits outside the heading, so screen readers still announce "Find me".
- [Home] **Source code link** added to the footer, pointing to the public GitHub repository.

### Improved
- [Site-wide] **Text selection** is now on brand instead of the browser's default blue. A light yellow is set through the CSS `::selection` pseudo-element, with a paler tint inside the yellow gift shop.

## Week of September 21, 2026

### New
- [Blog] **"How I Obsidian"** published, a post about my note-taking setup, illustrated with a folder tree, a tag list and a properties table.
- [Blog] **Posts on other sites** now appear in the writing lists, sorted by date, with the publication's name beside the title.
- [Home] **Experience section** added above Writing, one line per company with years and role. On narrow screens the years hide first so nothing wraps.
- [Work] **Two new projects** from "The color of water": the bio plates and the copy-palette interaction, both linking to the post.
- [Work] **Expanded project view** redesigned. The image now shows at full size, with close, visit and credits in a narrow column beside it.

### Improved
- [Blog] **Footnote markers** are now solid yellow squares centred on the line, instead of outlined boxes raised like superscript.
- [Work] **Project titles** are the same in the grid and the expanded view. Before, each project had two different labels.
- [Work] **Phones** no longer open the expanded view for image projects, since the image is already full width. The project link shows without hover.
- [Home] **Footer panel** keeps a fixed 2:1 shape instead of resizing with its text. On phones it fills the width.

### Fixed
- [Blog] **"Copy palette" button** no longer jumps sideways when its label changes to "Copied". Both labels are now centred in the same space.
- [Blog] **Search engine previews** for `/writing` and posts used the home page's URL and title, so `/writing` read as a duplicate of the home page. Each page now declares its own.

## Week of September 14, 2026

### New
- [Blog] **"The color of water"** published: six fish, each with a photo, a colour palette, and a carousel of interface samples (code, diagram, profile bar) styled in that palette. Palettes can be copied as hex, HSL or CSS.

### Improved
- [Site-wide] **Colour system** reduced from 19 separate colours to two 10-step scales, grey and yellow, so every shade on the site comes from one of them.

## Week of September 7, 2026

### Improved
- [Home] **Page load** now fades the four header blocks in 80 ms apart, each rising 6 px out of a slight blur, instead of showing everything at once.

## Week of August 31, 2026

### New
- [Blog] **Blog** added, with the first post, "Museums and websites". Footnotes open in a side panel, so you never leave the text.
- [Blog] **Blog navigation** added: a Home link and the site's logo, whose sun follows the cursor.
- [Blog] **Post share images**: each post has its own preview image when shared on social media or in chat apps.
- [Home] **Latest posts** listed on the home page as titles only, in the right column under the introduction.
- [Home] **Structured data** added to the home page: a schema.org `Person` in JSON-LD, so search engines and AI agents can read who the site belongs to.
- [Work] **Image viewer**: opening an image project shows the image on its own with a label beside it, instead of inside a padded card.
- [Gift shop] **Header** now runs edge to edge with a stamp-sheet texture, and the close button looks cut through the panel.
- [Site-wide] **404 page** explains what happened and links to the pages that exist, replacing Next.js's default page.

### Improved
- [Work] **Phones** show projects only as the grid. The stacked view and its toggle are hidden below tablet width.
- [Work] **Image viewer** opens larger: up to 78% of the window height on desktop, and edge to edge on phones.
- [Home] **Header layout**: both columns now line up at the top and the bottom.
- [Gift shop] **Download confirmation**: the "Download" label crossfades into a tick instead of switching instantly, and the row no longer changes width.
- [Site-wide] **Performance on phones**: opening a project fades the rest of the page instead of blurring it, which was slow on phones.

### Fixed
- [Gift shop] **Gift shop button on phones** moved to the bottom of the screen, where it no longer covers the text.
- [Work] **Project grid** no longer reshuffles when a project is opened. Its space is held until it closes.
- [Site-wide] **Hover effects** only apply on devices that can hover. On touch screens they used to stay stuck after a tap.
- [Site-wide] **Keyboard access**: a "Skip to content" link added, footnote markers given a 24×24 px tap area, and article headings given link anchors.
- [Site-wide] **Heading order**: the gift shop's heading no longer comes before the page's main heading in the document, which confused screen readers and search engines.
- [Blog] **Quotes** start in line with the text instead of a margin above it.

## Week of August 24, 2026

### New
- [Work] **Grid view**: projects now open as a masonry grid, with the draggable stack one click away. Cards animate between the two views.
- [Work] **"In service of museums"** now links to the live site, with a new video.

### Fixed
- [Work] **Project videos** re-encoded at higher resolution, so they stay sharp when a project is enlarged on high-density screens.
- [Gift shop] **Copy and download feedback**: a blocked copy now says "Not copied" instead of nothing, and file rows no longer say "Saved" before anything is saved.
- [Site-wide] **Smaller fixes**: 13 other issues found in a full review of the site.

## Week of August 17, 2026

### New
- [Work] **Stacked view on all screens**: cards stay scattered at every width and can be dragged on touch screens. Sideways swipes move a card; vertical swipes still scroll.
- [Gift shop] **Keyboard shortcut**: press G to open or close the gift shop. A key badge shows the shortcut.
- [Gift shop] **Colour swatch** can be pulled and springs back when let go, instead of being a copy button.

### Improved
- [Gift shop] **Gift shop button** appears only after you scroll past the top of the home page.
- [Work] **Stack order**: professional projects always sit above personal ones, so they never get buried.
- [Work] **Project videos** replaced with new recordings, compressed from up to 13.5 MB to under 2 MB each.
- [Gift shop] **Portrait** in the press kit replaced with a new photo.

### Fixed
- [Home] **Social links** to LinkedIn, Twitter and Bluesky now work. They were placeholders.

## Week of August 10, 2026 (launch)

### New
- [Home] **Home page** launched: name, role, personal projects and contact links in two columns.
- [Work] **Projects** shown as a scattered stack of cards you can drag. Opening one zooms it in and blurs the rest.
- [Gift shop] **Gift shop**: a side panel with résumé PDFs, a contact card, a portrait and bios to copy.
- [Site-wide] **Link previews**: shared links show a title, description, preview image and site icon. Before, they showed as bare URLs.

### Improved
- [Work] **Dragging** no longer re-renders the page on every pointer move, so cards follow the cursor smoothly.
- [Site-wide] **Page weight**: a development-only toolbar was shipping to visitors. Removing it cut the site's JavaScript from 268 KB to 177 KB (compressed).

### Fixed
- [Site-wide] **Phones**: controls that only appeared on hover or on wide screens now work on touch screens.

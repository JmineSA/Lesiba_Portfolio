# Lesiba James Kganyago — Portfolio

A single-page data-science portfolio: a live canvas regression demo, animated stats, a
scroll-charged timeline, tilt/glare project cards, an AI chatbot, ambient background
music, and three real project case studies — all plain HTML/CSS/JS, no build step.

## Quick start

**Just open it.** Double-click `index.html`. Everything works, though a couple of
browsers restrict `fetch`/module-style loading from `file://` — if fonts, canvases, or
the chatbot look off, serve it instead:

```bash
cd lesiba-portfolio
python3 -m http.server 8080
# then open http://localhost:8080
```

## Deploying

Fully static — push the folder as-is to any static host:

- **GitHub Pages**: push to a repo (e.g. `JmineSA/portfolio`), enable Pages on the
  `main` branch, root folder.
- **Netlify / Vercel**: drag-and-drop the folder, or connect the repo — no build command.
- **Any web server**: copy `index.html`, `css/`, `js/`, and `assets/` to the document root.

---

## Project structure

```
lesiba-portfolio/
├── index.html
├── css/
│   ├── base/            tokens, preloader, custom cursor
│   ├── layout/          nav/starfield, hero, shared section furniture
│   ├── components/      theme toggle, reading progress, language selector, case studies
│   ├── features/        github feed, analytics dashboard, chatbot, music player, data game
│   └── responsive.css   breakpoint overrides — always loaded last
├── js/
│   ├── core/            dom helpers, scroll/reveal, interactions, cursor, boot
│   ├── components/      theme toggle, command palette, work filters, github badges...
│   └── features/        clock, terminal, figures, i18n, chatbot, music player, data game...
├── assets/
│   ├── Lesiba_Kganyago_CV.pdf
│   ├── audio/deep-healing-ambient.mp3
│   └── img/grain.png
└── README.md
```

Everything loads as plain `<link>`/`<script>` tags in `index.html` — **no bundler, no
build step.** The load order in `index.html` matters: later files rely on globals
(`$`, `$$`, `FINE`, `REDUCED`, etc.) set up by earlier ones, so keep the existing script
order if you add new files, and add new files *after* `js/core/dom-helpers.js`.

---

## File-by-file documentation

### Root

| File | Contents |
|---|---|
| `index.html` | All page markup: nav, hero, "Selected Work" case studies, skills, contact, chatbot markup, music player markup, cursor markup. Loads every CSS file (in cascade order) and every JS file (in dependency order). |
| `.gitignore` | Ignores OS/editor cruft (`.DS_Store`, `.vscode/`, etc.) — nothing project-specific to ignore since there's no build output. |

### `css/base/` — foundational styles, loaded first

| File | Contents |
|---|---|
| `tokens.css` | All design tokens as CSS custom properties on `:root`: colors (`--bg`, `--text`, `--accent`, etc.), fonts (`--sans`, `--mono`), radius, a few chart-specific colors, and the base `.reveal`/`.h-rev`/chip-stagger entrance-animation rules. Change the whole palette from here. |
| `preloader.css` | The boot/loading screen: spinner, progress bar, and the theatre-curtain reveal (two panels that sweep apart to unveil the page — see "Cinematic effects" below). |
| `cursor.css` | The custom round dot + ring cursor: base sizes, the `.big` (hover), `.down` (click), and `.label` (pill mode) states, the slow-spinning dashed "HUD" ring accent, the two faint comet-trail dots, the hover label pill, and the click-ripple animation. |
| `atmosphere.css` | The fixed vignette + animated film-grain overlay that sits above every section — see "Cinematic effects" below. |

### `css/layout/`

| File | Contents |
|---|---|
| `nav.css` | Fixed starfield backdrop, top scroll-progress bar, the nav bar itself, and the side dots/HUD indicator. |
| `hero.css` | The hero section: headline, role-cycler, hero stats, hero buttons, the depth layers used for scroll parallax (`.aurora`, `.gridlines`, `.net`), and the figure-panel focus-pull effect (`.panel` blur-to-sharp transition). |
| `sections.css` | Shared "furniture" reused across every section below the hero: section headings, the project/case-study cards (`.case`, `.tilt`), tag chips, stat blocks. This is the largest layout file since most of the visual language lives here. |

### `css/components/`

| File | Contents |
|---|---|
| `theme-toggle.css` | The light/dark toggle button plus every light-mode color override (`html[data-theme="light"] ...`). |
| `reading-progress.css` | The thin reading-progress bar and the "back to top" circular button. |
| `language-selector.css` | The language-switcher dropdown used by the i18n feature. |
| `case-study.css` | Expand/collapse styling for the detailed write-up inside each project card. |

### `css/features/`

| File | Contents |
|---|---|
| `github-feed.css` | The live GitHub activity feed panel. |
| `analytics-dashboard.css` | The on-page visitor/analytics dashboard widget. |
| `chatbot.css` | The full embedded AI chatbot widget: launcher button, chat window, message bubbles, suggestion chips. |
| `music-player.css` | The floating music-player pill: play/pause button, volume slider, "now playing" label. |
| `data-game.css` | The interactive data-guessing mini-game. |

### `css/responsive.css`

Breakpoint overrides for tablet/mobile. **Must stay the last stylesheet loaded** so it
can override anything above it.

---

### `js/core/` — shared plumbing, loaded first

| File | Contents |
|---|---|
| `dom-helpers.js` | The `$`/`$$` query shortcuts, `REDUCED`/`FINE` feature-detection flags (reduced-motion and fine-pointer/mouse detection), and small utilities (`debounce`, `easeOutCubic`, `mulberry32` seeded RNG, `fitCanvas`, `visGate`). Every other file depends on this loading first. |
| `scroll-reveal.js` | The top scroll-progress bar, the scroll-linked parallax on the hero's depth layers, "reveal on scroll" animations, the chip-cascade stagger, the figure focus-pull observer, the text-scramble effect on headings, and the `IntersectionObserver` that tracks which section is active for the side nav dots. |
| `interactions.js` | Mobile hamburger menu, the hero role-cycler, spotlight hover glow on tiles, magnetic-pull buttons (`.mag` — the button itself glides toward the pointer), and the 3D tilt effect on project cards (`.tilt`). |
| `cursor.js` | The custom cursor — see "The cursor" below for the full behaviour rundown. |
| `boot.js` | Runs the preloader sequence once on page load, then triggers the curtain reveal and shows the page. |

### `js/components/`

| File | Contents |
|---|---|
| `theme-toggle.js` | Reads/writes the saved theme preference (`localStorage`), toggles `data-theme="light"` on `<html>`, and updates the mobile browser-chrome color (`<meta theme-color>`). |
| `command-palette.js` | The Cmd/Ctrl+K command palette (quick navigation/search overlay). |
| `work-filters.js` | Tag-based filtering for the "Selected Work" project cards. |
| `github-badges.js` | Fetches and renders live stat badges (stars, last-updated, etc.) on each project card from the GitHub API. |
| `back-to-top.js` | Shows/hides and wires up the "back to top" button based on scroll position. |
| `reading-progress.js` | Drives the thin progress bar at the top of the page as you scroll. |
| `scroll-animations.js` | Extra scroll-triggered animation helpers layered on top of `core/scroll-reveal.js`. |
| `case-study-details.js` | Expand/collapse behaviour for the detailed write-up inside each project card (pairs with `css/components/case-study.css`). |

### `js/features/`

| File | Contents |
|---|---|
| `clock.js` | The live Pretoria (SAST) clock shown in the header. |
| `terminal.js` | The animated `whoami`-style terminal typewriter effect in the hero panel. |
| `contact-copy.js` | The "copy email to clipboard" button and its toast notification. |
| `figures.js` | The two canvas data-viz demos: Fig. 01 (live, draggable OLS regression) and Fig. 04 (histogram). Both are gated by `IntersectionObserver` so they pause off-screen. |
| `background-canvas.js` | The ambient canvas backgrounds: the starfield and the neural-network constellation effect. |
| `i18n.js` | Multi-language support — the translation dictionary and the language-switcher logic. |
| `github-activity.js` | Fetches and caches a live GitHub activity feed for display in the sidebar panel. |
| `analytics-dashboard.js` | Drives the lightweight on-page analytics dashboard widget. |
| `chatbot.js` | The embedded AI chatbot: canned Q&A about the projects/skills, suggestion chips, message rendering. |
| `music-player.js` | Plays a single looping ambient track and autoplays it — see "The music" below. |
| `data-game.js` | The interactive "guess the metric" data mini-game. |
| `particle-network.js` | The subtle ambient particle-network background effect. |

---

## The music

`assets/audio/deep-healing-ambient.mp3` is a **90-second, seamlessly-looping ambient
pad** (soft layered tones over a gentle airy noise bed), generated specifically for
this site so there's no licensing/attribution to worry about. It loops via the `loop`
attribute on the `<audio>` tag, so it repeats without a gap.

**Autoplay**, handled in `music-player.js`: every major browser blocks audio *with
sound* from autoplaying until the visitor interacts with the page — that's a browser
security rule no website can turn off. What browsers *do* always allow is **muted**
autoplay. So the track starts muted the instant the page loads, and a moment later the
script unmutes it and fades the volume in — browsers permit changing volume/mute on
media that's already playing without requiring a fresh click, so in practice it plays
audibly right away. If a browser is locked down enough to block even that, it falls
back to starting on the visitor's very first click, keypress, or scroll instead.

- Default volume: **10%** (the slider default; changing it is remembered via `localStorage`).
- The floating pill's play/pause button and volume slider always work as manual overrides.

To swap in a different track later: drop the new file in `assets/audio/` and update the
`<source src="...">` in `index.html`'s `<audio id="bgMusic">` tag — no JS changes needed.

## Cinematic effects

Five effects work together to give the site a "produced" feel rather than a flat UI:

- **Scroll parallax** — the hero's background layers (aurora glow, gridlines, neural-net
  canvas) move at different speeds as you scroll past them, and the fixed starfield
  drifts slowly across the whole page. Slower layers read as further away. Driven by
  `onScroll()` in `scroll-reveal.js`; disabled under `prefers-reduced-motion`.
- **Staggered/cascading reveals** — chips inside skill and project tag groups fade in
  one after another rather than all at once, via `initChipStagger()` (a per-child `--i`
  index) plus the matching CSS in `tokens.css`. The three project cards also carry a
  slight stagger of their own.
- **Focus-pull on data figures** — every figure panel (`.panel` — the live regression
  demo, histogram, bar charts) starts blurred and desaturated, then racks into sharp
  focus as it scrolls into view, like a camera pulling focus. Handled by
  `initFocusPull()` in `scroll-reveal.js` + the `.panel`/`.panel.in-focus` rules in
  `hero.css`.
- **Film grain + vignette** — `css/base/atmosphere.css` layers a soft radial vignette
  and a subtly animated grain texture (`assets/img/grain.png`) above every section.
  Both are `pointer-events:none` so nothing underneath is ever blocked.
- **Cinematic preloader** — instead of a plain fade, the preloader now finishes with
  two curtain panels sweeping apart to reveal the page (`.loader-curtain` in
  `preloader.css`, choreographed from `boot.js`).

All five respect `prefers-reduced-motion` and degrade to instant/static states for
visitors who have that setting on.

## The cursor

`css/base/cursor.css` + `js/core/cursor.js` implement a cinematic round cursor:

- **Dot + ring**: the small dot tracks the pointer exactly; the larger ring glides
  after it with a light, snappy ease (kept deliberately simple — no per-frame
  rotation/scale math — so it tracks smoothly instead of feeling heavy or laggy).
- **Comet trail**: two faint, shrinking dots chase the ring for a sense of motion.
- **Magnetic snap**: hovering a `.mag` element (the same class used for the magnetic
  buttons elsewhere on the site) gently pulls the ring toward that element's center,
  so the button and the cursor both glide toward each other.
- **Spinning HUD ring**: a thin dashed ring slowly rotates around the cursor at all
  times — a pure-CSS animation, so it costs nothing extra per frame.
- **Hover states**: links/buttons/cards enlarge the ring with a soft elastic
  (overshoot) transition; anything tagged `data-cursor="Some label"` morphs the cursor
  into a small labelled pill instead.
- **Click**: a quick ring squeeze plus an expanding ripple burst.
- **Theme-adaptive color**: uses `mix-blend-mode: difference`, so the same accent color
  automatically reads clearly against both light and dark backgrounds — no separate
  light/dark assets needed.
- Automatically falls back to the native OS cursor on touch devices and whenever the
  visitor has `prefers-reduced-motion` enabled.

## Customizing

- **Colors / theme**: edit `css/base/tokens.css` (`:root` custom properties).
- **Copy, stats, project text**: edit directly in `index.html` — every number that
  animates in has a `data-count` attribute; every scramble-in heading has a
  `data-text` attribute holding the real text.
- **Adding a project**: copy one `<article class="case tilt reveal">…</article>` block
  in `index.html`, update its `case-idx`, tags, `<h3>` (including the `.repo-link`),
  bullet list, stats, and chips.
- **Cursor hover labels**: add `data-cursor="Your label"` to any element to have the
  cursor morph into a labelled pill when hovering it.
- **Cursor magnetism**: add the `.mag` class to any small interactive element to have
  both the element and the cursor glide toward each other on hover.
- **Background music**: see "The music" above.
- **Cinematic effects**: dial grain/vignette strength in `atmosphere.css`
  (`#cineGrain{opacity:...}`), parallax speed in `scroll-reveal.js`'s `onScroll()`
  (the `sy * .05` / `.09` / `.13` factors), or the focus-pull blur amount in
  `hero.css` (`.panel{filter:blur(9px)...}`).
- **Swapping the generated charts for real screenshots**: drop images into `assets/`
  and replace the relevant `.panel` contents (`#olsCanvas`, `#histCanvas`,
  `#teleErrChart`, etc.) with `<img>` tags — the surrounding `.panel-head` /
  `.panel-foot` chrome can stay as-is.

## Linked projects

| Project | Repo |
|---|---|
| Mobile Data Consumption Intelligence System | https://github.com/JmineSA/telecom-consumption-intelligence |
| UbuntuCare — Wait-Time Prediction System | https://github.com/JmineSA/UbuntuCare-QueueOptimizer |
| Intelligent Fraud Detection in Banking | https://github.com/JmineSA/Financial-Fraud-Modeling-for-LOL-Bank |

## Accessibility & performance notes

- Respects `prefers-reduced-motion`: disables the preloader animation, canvas loops,
  parallax, custom cursor, and scroll reveals, showing static content immediately instead.
- Canvas-based animations (regression demo, histogram, starfield, neural network) are
  gated with `IntersectionObserver` so they pause when off-screen.
- Custom cursor only activates on fine-pointer (mouse) devices; touch devices get the
  native cursor and no hover-only interactions are required to use the site.
- Background audio respects the browser's autoplay policy rather than fighting it (see
  "The music" above), and always leaves manual play/pause/volume controls available.

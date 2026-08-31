# Noor & Zayn — five wedding invitation sites

Five independent Pakistani wedding invitation sites for the same event:
**Noor & Zayn, 17 October 2026, The Courtyard, Beach Luxury Hotel, Karachi.**
Each site is a self-contained Vite build with its own world; they share only
the motif kit.

| Site | Path | Build base | Git |
|---|---|---|---|
| Heritage Garden (Mughal miniature) | repo root | `--base=/Invitation/` | yes |
| Vibrant Mehendi (truck-art folk) | `projects/vibrant-mehendi-celebration` | `--base=./` | yes |
| Minimal Ivory Nikkah (photographic) | `projects/minimal-ivory-gold-nikkah` | `--base=./` | yes |
| Sindhi Ajrak (block print) | `projects/sindhi-ajrak-invitation` | `--base=./` | **no repo yet** |
| Contemporary Editorial | `projects/contemporary-pakistani-editorial` | `--base=./` | yes |

The root site's base is `/Invitation/`, not `./`. Serving its `dist/` at a
server root gives an unstyled page **with no console errors** — every asset
404s silently. If styles look absent, check the base before anything else.

## Hard constraints

- **No face or couple photographs.** Photography is fine for artwork, candid
  hands, details and venues. Anything with a face, portrait, group shot, or
  the couple must be illustration instead. Illustrated artwork *containing*
  figures is fine. Two couple photos were generated early and are permanently
  parked in `art-masters/` as `sindhi-*-unused-couple-photo.webp` — do not
  wire them in.
- **Image generation costs real credits.** Talk through a brief and get
  explicit approval before generating. Check `art-masters/` and the existing
  `public/assets/` first — work has been paid for and left unwired before.
- **Generated art arrives by hand.** This environment cannot fetch the
  generation CDN. The flow is: generate → user saves the PNG into the site's
  `public/assets/` → convert to webp → wire → move the PNG master to
  `art-masters/` so it stops shipping in `dist/`.

## The recurring architectural bug

Hit three times on three sites, same shape every time:

> **Things that aren't inside the panels don't leave with the panels.**

The opener is a two-panel gate that slides apart (`xPercent: ±102`). Anything
that is a *direct child of `.opener`* — a scrim, a ground veil, a garland, or
`.opener`'s own `background` — does **not** travel with the panels. It hangs
over the revealed hero until the opener is hidden, which reads as a hard cut.
Every such element must be explicitly faded in the GSAP timeline.

Two related traps:

- `.opener__panel` **must** have `overflow: hidden`. Without it both panels
  paint the full 100vw gate image; closed they coincide so it looks perfect,
  and parting them swaps the halves instead of opening.
- Gate art is two `100vw × 100%` cover boxes, one per panel, offset
  `left: 0` / `right: 0`. Both resolve to identical screen rects, so the
  split always lands exactly on the seam the painting was composed around.

## Verification discipline

Assume nothing renders correctly because the code looks right.

- Verify in a real browser with Playwright at
  `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`, at both 390×844 and
  1440×900, and check `reducedMotion: 'reduce'` separately.
- **Measure, don't eyeball.** Two real bugs were caught only by reading
  computed values: a `background: var(--paper)` shorthand silently resetting
  `background-size` to `auto`, and a border band whose rule lines were being
  cropped by `preserveAspectRatio="slice"`.
- Screenshots cost 200–400 ms. A `waitForTimeout(delta)` + screenshot loop
  drifts badly and makes correct animations look broken — sample against an
  absolute `Date.now()` baseline or the video clock.
- Headless Chromium has **no H.264**. `canPlayType('video/mp4; codecs="avc1.42E01E"')`
  returns `""`. Ship an extra VP9/WebM copy for testing; this is a test-harness
  limitation, not a site bug.

## The motif kit

`src/motifs/index.js` is **shared and kept byte-identical across all five
sites.** Edit it in one site, then copy it to the other four. Every mark is
monoline SVG driven by CSS custom properties so the same geometry re-skins per
site: `--motif-stroke`, `--motif-weight`, `--motif-accent`, `--motif-resist`.
Paths tagged `data-draw` animate on via `stroke-dashoffset`.

Sizing rule for band motifs (garlands, the ajrak pallav): the host's **height**
sets the motif size and the **width** decides how many units you see. Make the
viewBox far wider than any viewport and use `preserveAspectRatio="xMinYMid slice"`
so the height governs the scale and it crops horizontally — otherwise `slice`
shaves the top and bottom off the design.

Ajrak specifically uses the real block-print grammar: eight-pointed **sitara**
stars on a half-drop grid, **kakar** stepped crosses on the edge midpoints,
undyed **resist dots**, and the **pallav** border band (`ajrakBorder`).

## Per-site state

- **Heritage** — most complete. Opening film ends dark; landing retimed to 1.25s.
- **Mehendi** — gate, hero and story plates painted. Done.
- **Nikkah** — gate still + a 5s opening film that ends on flat white, handed
  off to a white veil so there is no bright-to-dark cut. The film plays on
  **portrait viewports only**; the source is 9:16 at 716px wide and a
  cover-crop on desktop would throw the doors out of frame. Desktop keeps the
  parting-panel gate. A 16:9 render is the open item.
  Known cosmetic: on mobile the line "request the honour of your presence at
  their nikkah" clips the gold door handles slightly.
  Section 02 is titled "The venue" and section 06 is "The place" — the venue
  is named twice; renaming 06 to "The setting" is the pending fix.
- **Ajrak** — gate painting wired; opener background bug fixed; motif kit
  rewritten authentically; pallav bands added. Hero and story plate are still
  plain, and `rooftopSkyline` on the story section has no ajrak in it at all.
- **Editorial** — 8 images already, structurally different from the other four
  (no `section-kicker` / `opener__` markup). Not yet audited.

## Assets

- Masters (full-size PNG/JPG) live in `art-masters/` at the repo root, never in
  a site's `public/`, or they ship in `dist/`.
- Shipped art is webp. Quality 82 is the norm; dense block print resists
  compression, so the ajrak gate is downscaled to 1240px wide instead.
- Video ships as H.264 CRF 26 plus a WebM copy.

## Installed skills

- `.claude/skills/design-dna/` — plain project skill, loads automatically.
- `.claude/plugin-sources/` holds two plugin **marketplaces** (scroll-craft and
  taste-skill). They are not loose skills; register them with
  `/plugin marketplace add .claude/plugin-sources/<name>` then `/plugin install`.

## Further reading

`.claude/DECISIONS.md` — why things are the way they are: what was tried,
what broke, what was rejected, and the open items list.

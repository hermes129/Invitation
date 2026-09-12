# Seven wedding invitation sites

Seven independent Pakistani wedding invitation sites. The first six share one event:
**Noor & Zayn, 17 October 2026, The Courtyard, Beach Luxury Hotel, Karachi.**
Each site is a self-contained Vite build with its own world; they share only
the motif kit.

| Site | Path | Build base | Git |
|---|---|---|---|
| Heritage Garden (Mughal miniature) | repo root | `--base=/Invitation/` | yes |
| Vibrant Mehendi (truck-art folk) | `projects/vibrant-mehendi-celebration` | `--base=./` | yes |
| Minimal Ivory Nikkah (photographic) | `projects/minimal-ivory-gold-nikkah` | `--base=./` | yes |
| Sindhi Ajrak (block print) | `projects/sindhi-ajrak-invitation` | `--base=./` | yes |
| Contemporary Editorial | `projects/contemporary-pakistani-editorial` | `--base=./` | yes |
| Karachi Deco (1930s Saddar) | `projects/karachi-deco-wedding` | `--base=./` | yes |
| Nastaliq (Lahore calligraphy) | `projects/nastaliq-lahore-wedding` | `--base=./` | local only |

**Site seven onward gets its own couple**, not Noor & Zayn, and the set should
mix Pakistani names with international ones. The six above keep the shared
couple; the instruction is forward-looking. Vary the venue and date to suit
each world too.

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
- **Generated art can be fetched end to end.** The Higgsfield CDN *is*
  reachable with curl, so the old hand-off through the user is no longer
  needed. The flow is: generate → curl the PNG → convert to webp → wire →
  copy the PNG master to `art-masters/` so it stops shipping in `dist/`.
  There is no encoder on this box by default: no cwebp, no ffmpeg, no
  ImageMagick. Install what you need per site and do not save it:
  `npm install --no-save sharp` for images, `npm install --no-save ffmpeg-static`
  for video, which drops a real ffmpeg.exe into node_modules and transcodes fine —
  or did: see the EFTYPE note under Audio.
  **Do not run `convert`.** It resolves to `C:/Windows/system32/convert.exe`,
  the FAT-to-NTFS filesystem utility, not ImageMagick. Also note node on this
  box does not resolve Git Bash's `/tmp`; pass it the real Windows path.

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

`src/motifs/index.js` is **shared and kept byte-identical across all seven
sites.** Edit it in one site, then copy it to the other six. Every mark is
monoline SVG driven by CSS custom properties so the same geometry re-skins per
site: `--motif-stroke`, `--motif-weight`, `--motif-accent`, `--motif-resist`.
Paths tagged `data-draw` animate on via `stroke-dashoffset`.

All six are in sync at **26 marks** as of 10 September 2026, when `decoFan`
and `decoRule` were copied out of Karachi Deco. Verified by serving all six
builds in real Chrome, not by diffing: every `[data-motif]` host renders an
`<svg>`, none come back empty, console clean on all six.

A host rule the kit depends on and does not carry itself: an injected `<svg>`
has a viewBox and no width or height, so unless the site's CSS says
`.motif { width: 100%; height: 100% }` the browser gives it width 100% and an
auto height from its own aspect ratio. For a band motif at 160:1 that renders
the whole design about 8px tall inside a 30px host, silently defeating the
slice sizing rule below.

The marigold garland was stepping its heads 21 apart at radius ~9, so every
head cleared the next by about 3px and the swag read as beads on a wire rather
than the rope its own comment describes. Heads now step 15.5 so they overlap,
on a five-radius cycle so the sizes do not fall into step with the swag, and
the pin lost the closed loop that made it read as an antenna. Used by heritage
and mehendi only.

Sizing rule for band motifs (garlands, the ajrak pallav): the host's **height**
sets the motif size and the **width** decides how many units you see. Make the
viewBox far wider than any viewport and use `preserveAspectRatio="xMinYMid slice"`
so the height governs the scale and it crops horizontally — otherwise `slice`
shaves the top and bottom off the design.

Ajrak specifically uses the real block-print grammar: eight-pointed **sitara**
stars on a half-drop grid, **kakar** stepped crosses on the edge midpoints,
undyed **resist dots**, and the **pallav** border band (`ajrakBorder`).

## Per-site state

- **Heritage** — most complete, and the most animated: 10 scrollTrigger blocks
  and 4 timelines. Opening film ends dark; landing retimed to 1.25s, and it now
  ships a VP9/WebM sibling ahead of the mp4 (1152 KB against 1346 KB, VP9 CRF 38).
  Eyebrows cut from 6 section-level to 3, unnumbered; em-dashes to zero. Note the
  dress section's own h2 is `sr-only`, so its eyebrow is the only visible label
  and must stay. Three contrast failures fixed with **scoped** overrides, not token
  changes, because `--gold` and `--gold-light` also drive motif accents in every
  section: story card numbers 2.67 to 5.3, hero date separators 4.38 to 4.78, and
  the date-scratch separators 3.48 to about 7.5.
  Its markup uses `.eyebrow` and `<br>`, not `.section-kicker` and `<br />`, so
  greps written for the other four silently report it as clean.
  **Mobile type was the real defect**: 17 of 27 text elements rendered under
  14px at 390, bottoming at 8px, including the venue address and the programme
  times at 10px and the RSVP button at 10px. Raised by tier in the 720px block
  (prose 15, controls 14, dates 13, mono labels 12); desktop untouched. The
  smallest text on the page is now 12px. The date reveal is a dateline like the
  other two, captioned "October 2026 / Karachi" and deliberately not repeating
  the weekday, since `.reveal__details` beneath already says "Saturday arrival".
  The story head's flourish was outranking its own lead on mobile, 30px of
  decoration over a 14px paragraph; the lead is now 16px and the flourish sits
  right at 22px.
- **Mehendi** — gate, hero and story plates painted. Kickers cut from 8 to 3
  and unnumbered, em-dashes to zero, and 1.3 MB parked: three face photos, an
  illustration superseded by its own v3, and four standalone SVGs superseded
  one-for-one by shared-kit motifs of the same names. Motion is good and was
  left alone; the counter-rotating chakris are already its signature move.
  **Its palette does not clear AA**: cream on fuchsia is 3.93:1 and the
  marigold heading accent is 2.87 on leaf green and 2.43 on fuchsia. Unfixed,
  because every fix moves a brand colour. See `.claude/DECISIONS.md`.
- **Nikkah** — gate still + a 5s opening film that ends on flat white, handed
  off to a white veil so there is no bright-to-dark cut. The film plays on
  **portrait viewports only**; the source is 9:16 at 716px wide and a
  cover-crop on desktop would throw the doors out of frame. Desktop keeps the
  parting-panel gate. A 16:9 render is the open item.
  The venue was named twice and renaming section 06's kicker only fixed half
  of it: section 02's heading still read "The venue." while 06 was "The
  Courtyard.". Section 02 is the ceremony detail block, so it is now "The
  ceremony" / "The nikkah.". Kickers dropped from 7 to 3 and lost their
  numbering, which had run 02, 03, 05, 06, 07, 08 with no 01 and no 04.
  A colonnade photograph replaced the hero's olive radial gradient and a
  garment study fills the attire section, which had only a swatch row.
  On narrow screens the venue arch now takes nikkah-venue.webp: the arch is
  ratio 0.82, and that tall crop keeps 24.07 of its 24.23 detail energy there
  where the 1.50 landscape keeps only 21.1 of 27.54.
  The mobile occasion line clears the gold door handles: the 20px of lift
  comes off `.opener__monogram`'s bottom margin so the name travels up with
  it — lifting the line on its own puts the descender of "Zayn" straight
  through the text. See `.claude/DECISIONS.md`.
- **Ajrak** - gate painting wired; opener background bug fixed; motif kit
  rewritten authentically; pallav bands added. Four craft photographs now
  carry the hero, story, invitation and attire. The wrong-province Lahore
  rooftop is gone. Fraunces is still the display serif and is the open item.
- **Editorial** — structurally different from the other four (no
  `section-kicker` / `opener__` markup). Audited and rebuilt: six unused face
  photographs parked, four still lifes generated, the page rebuilt as one
  continuous Karachi evening with an hour-aware accent, and the date reveal
  reset as a printed dateline.
- **Karachi Deco** — the sixth, built from nothing on 8 September 2026, and the
  only **sans-led** site in the set: Jost (the Futura lineage the era actually
  drew with) against DM Mono, where the other five are serif worlds. Its
  signature move is **bilateral convergence** — paired blocks entering from
  opposite edges to meet on the centre line, because Deco is symmetry before
  it is anything else. Transform only, so a trigger that never updates leaves
  content un-offset rather than invisible.
  Four photographs, none with a face: gate doors, the curved corner facade, a
  terrazzo lobby floor, dinner jacket with emerald silk. The gate art is
  ratio 0.56, so `object-position: center 40%` keeps the band from the top
  rail through the handles on landscape viewports; centring lands on the blank
  lower panels. It ships black `#0b0c0b`, champagne `#c8a35a`, emerald
  `#0d4f3c`, bone `#e9e2d2`, and 1.5 MB of `dist/`.
  Three bugs worth remembering, all caught by measuring rather than looking:
  the hero photograph never painted (see the negative-z-index note below);
  `.motif` had no width or height rule, so every injected SVG fell back to its
  own aspect ratio and the band motifs rendered 8px tall inside a 30px host;
  and champagne on the emerald venue panel is 4.02:1, fixed scoped to `.venue`
  with `--champagne-lt` at 5.43:1 rather than by moving a brand token.
  Music is Arthur Schutt's "Bluin' the Black Keys", 1926, public domain via
  Wikimedia and credited in the footer. It ships **Ogg/Opus first and AAC
  behind it**, so it plays on Safari and iOS where the other five sites are
  silent — they are Ogg-only, which is worth fixing when one of them is next
  touched. `preload="none"`, started by the gate click.
  The cornice band does not crop: `fitBands()` in `main.js` measures the host,
  takes the repeat count nearest the motif's natural 4:1, and divides the
  visible span by it, so the viewBox measures exactly what is on screen and
  the band begins and ends on a whole ziggurat at any width. Verified drawn
  width equals host width to the pixel at both 1440 and 390.
  **Live** at `https://hermes129.github.io/karachi-deco-wedding/`. The two
  motifs it added to the kit have still not been copied to the other five.

- **Nastaliq** — the seventh, built 11 September 2026, and the first with its
  own couple: **Hira & Daniyal**, baraat Saturday 19 December 2026 at Haveli
  Barood Khana in Lahore's Walled City, mehndi on the 17th, walima on the 20th.
  Here the script *is* the image. Every word of Urdu is set in **Gulzar**, an
  open-licence Nastaliq drawn for Urdu (204 KB woff2 for the Arabic subset,
  which declares all of U+0600–06FF, so the Urdu digits, heh-goal and
  superscript alif are covered); Spectral carries the English, deliberately
  the smaller voice. Signature move **rule, then write**: each panel's jadval
  — a gold band, then lapis and oxblood hairlines — draws on anticlockwise
  from the top right, then each Nastaliq line inks in right to left behind a
  soft-edged mask, then the English gloss settles in. It is
  IntersectionObserver plus CSS transitions, not GSAP, and the hidden state
  exists only on `.is-armed`, which script strips when a panel finishes — so
  no script, reduced motion or no mask support all show every panel whole.
  Verified mid-reveal: 456 ink pixels in the line's right half, 0 in its left.
  The photographs show instruments only. Image models write fake
  Arabic-looking script, which any Urdu reader would catch, so every prompt
  banned letters and every real word on the page comes from the font.
  Worth knowing before touching it: Nastaliq ink reaches outside its line box
  and a mask clips to the border box, so `.ink` carries 0.3em/0.25em padding
  — measured at zero ink pixels outside the box on all seven lines at both
  widths. The haveli generation came back stitched (rows 256–267 spiked to
  6.8× the median row difference) and is cropped at row 280. The zar-afshan
  is generated torn-leaf flecks on 520px and 347px tiles; radial-gradient dots
  read as a lattice. The venue card sits on its own night panel, because text
  over the lit arcade measured 1.65–2.17:1 and thickening the veil would have
  put the lamps out. `--gold-ink` #7a5a1f is the gold that can carry glyphs.
  There is **no `html` background**, on purpose, so the negative z-index trap
  below cannot happen here.
  Music is Raag Jhinjhoti by Ustad Abdul Karim Khan: public domain in India
  (he died in 1937); the US status rests on the Commons tag, and the file page
  gives no recording year. MP3 first, original Vorbis behind it, both 44.1 kHz,
  shipped unfaded because ffmpeg would not run. **Not deployed.**

### The negative z-index trap

`html` carries a `background` on several of these sites. That stops `body`'s
background propagating to the canvas, so `body` paints as an ordinary element
— and any child sitting at a negative z-index inside a section that is not its
own stacking context falls **behind** it. On Karachi Deco this rendered the
hero as a flat black panel, photograph, scrim, keyline and all, with no
console error and correct computed styles on every element. `isolation:
isolate` on the section fixes it. Suspect this whenever a full-bleed
background image measures correctly and does not appear.

## Assets

- Masters (full-size PNG/JPG) live in `art-masters/` at the repo root, never in
  a site's `public/`, or they ship in `dist/`.
- Shipped art is webp. Quality 82 is the norm; dense block print resists
  compression, so the ajrak gate is downscaled to 1240px wide instead.
- Video ships as H.264 CRF 26 plus a WebM copy.

### Audio

**Never ship a single Ogg source.** Safari only added native Ogg Vorbis in
18.4; 14.1 to 18.3 was partial and depended on system components, and below
that — including iOS up to 17.3 — it plays nothing. Every site now pairs its
Ogg with an MP3, and Karachi Deco pairs its Opus with AAC. `preload="none"`
on all six: the music only starts on the gate click, so a connection at page
load spends data for nothing.

Commons will hand you the MP3 itself, so no transcoding is needed. The path
is derived from the md5 of the filename with underscores:

    https://upload.wikimedia.org/wikipedia/commons/transcoded/<h[0]>/<h[0:2]>/<File_Name.ogg>/<File_Name.ogg>.mp3

`commons.wikimedia.org` is blocked from this box but `upload.wikimedia.org`
is reachable, so that md5 trick is the only way in. Expect 429s when pulling
several files; retry rather than assuming a 404.

**ffmpeg-static stopped executing on this box** in September 2026: Windows
returns `EFTYPE` for the binary even though its PE header is intact, from Git
Bash and from Node's execFileSync alike. The Nastaliq audio shipped without its
fades as a result. Reinstall it, and test it, before planning around it.

Check the sample rate before trusting a Commons Ogg. `raga-kaushi-kanra.ogg`
is 11 kHz stereo Vorbis at 57 kbps, and Chrome rejects it outright with
`MEDIA_ERR_SRC_NOT_SUPPORTED` on most loads. Nikkah and editorial therefore
list the 44.1 kHz MP3 **first** and keep the Ogg as the fallback; heritage
and mehendi keep their Ogg in front, being 44.1 kHz at 192 and 80 kbps.

Verify by loading each file on its own — the browser picks one source and
never touches the other, so a page that plays proves nothing about the
fallback. Detach the page's own `<audio>` first: two elements contending for
one large media file make Chrome fail one of them, which reads exactly like a
broken file. `.test-tools/playwright/audio-check.mjs` does all of this.

## Installed skills

- `.claude/skills/design-dna/` — plain project skill, loads automatically.
- `.claude/plugin-sources/` holds two plugin **marketplaces** (scroll-craft and
  taste-skill). They are not loose skills; register them with
  `/plugin marketplace add .claude/plugin-sources/<name>` then `/plugin install`.

## Further reading

`.claude/DECISIONS.md` — why things are the way they are: what was tried,
what broke, what was rejected, and the open items list.

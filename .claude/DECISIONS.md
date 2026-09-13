# Decision log

Why things are the way they are. `CLAUDE.md` says *what* the rules are; this
says *what was tried, what broke, and what was rejected*, so the same ground
isn't re-litigated. Newest last.

## Style direction

- **Each site keeps its own world.** Heritage = Mughal miniature. Mehendi =
  truck-art folk. Nikkah = *photographic* — chosen deliberately because its
  existing imagery is photographs and a flat painting would have clashed.
  Ajrak = Sindhi block print. Editorial = not yet characterised.
- **Style locking across generations**: passing a previous generation's
  `job_id` as an image reference reproduces palette and characters exactly.
  This is how the mehendi plates stayed consistent with each other.
- **One image serving two frames**: briefing the subject into the middle third
  with deliberately empty margins lets a single 16:9 file survive a portrait
  crop. Used on the nikkah still life (780×358 desktop, 335×547 mobile) and
  again on the ajrak gate, whose centre third is a calm indigo panel purely so
  the type stays legible over it.

## Rejected / superseded

- **The two Sindhi couple photographs** (`sindhi-hero`, `sindhi-story`) were
  generated early, then never wired in — they show faces, which the no-faces
  rule forbids. They sat unused in `public/` shipping ~470 KB of dead weight in
  `dist/` until they were moved to `art-masters/`. Do not resurrect them.
- **A front-facing peacock motif** dissolved into its own tail and was
  recomposed to profile (OX=78, OY=170, N=9, −10°→+95°).
- **The original `ajrakTile`** was thin monoline lattice — pretty, but not
  ajrak. Real ajrak is a resist print, so it was rebuilt from the actual
  vocabulary (sitara, kakar, resist dots) and the pallav border was added.
- **The nikkah hero** was nearly repainted before an audit caught that this
  site puts photographs in as *CSS backgrounds*, not `<img>` tags — the hero
  already worked. The spend went to the portrait-story plate instead. Lesson:
  grep for `url(` and `background-image`, not just `<img`.

## The nikkah opening film

The brief went through three rounds before anything was generated. Rejected:
an 18-second film with text and titles; a green-screen composite. Settled on a
~5s clip, camera pushing at the doors, doors swinging **inward away from the
viewer**, white light flooding through and blooming to fill frame.

Kling got the hard part right first try — the doors do hinge away — but the
clip **did not end white**: at 4.9s the arch, floor and jasmine were still
plainly visible (luminance floor 15). Rather than re-roll 7.5 credits, the
bloom was graded in with ffmpeg: exposure lift from 2.6s, wash to white
finishing at 4.8s. The last frame now measures `rgb(255,255,255)`, which is
what makes the veil handoff invisible.

It renders at 720×1280 and plays on portrait viewports only. A 16:9 version
for desktop is unbuilt and would cost ~7.5 credits.

## The nikkah opener has no vertical slack

Section 06 was renamed "The place" → "The setting" so the venue isn't named
twice (02 is "The venue").

The ~20px lift for the occasion line was **not** a margin tweak on the line
itself. Measured at 390×844, the descender of the *y* in "Zayn" already
reached to within **1px** of that line's first-line ink — the gap under the
name is entirely consumed by the descender. Lifting the line alone by 20px
therefore drove the tail 21px *through* the words "presence at their": it
traded a slight clip of the door handles for the couple's own name striking
out the sentence. Measure `actualBoundingBoxDescent` against the next line's
ink top before moving anything in this stack; the box gap lies.

What ships instead lifts the **name and the line together** — 20px comes off
`.opener__monogram`'s bottom margin, and `.opener__occasion`'s bottom margin
grows by the same 20px so the seal button and date do not move. Verified at
390×844: line up 20px, name→line clearance unchanged at −1px, monogram→name
still clear at 12.7px, button and date pinned at 516.3 / 594.7. Positive
clearance at 360px. Desktop is untouched — the whole change sits inside
`@media (max-width: 760px)`.

One trap while verifying: Vite's HMR served a **half-updated stylesheet** —
the new monogram rule with the stale occasion rule — so the measurements
disagreed with the file on disk. Restart the dev server before trusting a
measurement after a CSS edit.

## Costs so far

Heritage 18.25 · Mehendi ~10 · Nikkah 4 + 7.5 film · Ajrak 2.
Balance was ~497 at last check. The ajrak gate landed first try.

## Nothing RAF-driven can be verified in the Claude browser pane

The pane reports `document.hidden === true` permanently, and fronting the tab
does not change it. `requestAnimationFrame` does not run in a hidden document,
and GSAP's ticker, ScrollTrigger's scroll processing and the compositor all
sit on RAF. So in that pane a scroll-driven page shows: no ground change, every
scrubbed tween pinned at progress 0, `ScrollTrigger.getScrollFunc(window)()`
returning 0 while `window.scrollY` is correct, blank screenshots that
nonetheless carry the right background colour, and screenshot timeouts.

All of it looks exactly like broken scroll code. None of it was. Hours went
into "fixing" a correct page: an overflow-x rule was moved off body on a wrong
hypothesis and had to be reverted, and the ground was rewritten onto
`gsap.ticker` before it became clear the ticker is RAF too and equally dead.

Also note `window.scrollTo()` in that pane dispatches **no scroll event**, so
even in a visible document it will not drive ScrollTrigger. `ScrollTrigger.update()`
called by hand does work and is the way to step a scroll page there.

What is still verifiable in the pane: computed styles, geometry, contrast,
overflow, DOM structure, and anything applied synchronously. What is not:
motion, scrub, pinning, and screenshots of any of it. Use Playwright in a
headed context for those, and take a real browser as the final word.

Two measurement traps found the same day, both of which produced false passes:
`getComputedStyle(child).opacity` is 1 even when an ancestor is at 0.001, so
an opacity filter has to multiply up the ancestor chain; and contrast has to
be measured against the nearest *opaque* ancestor background, not `body`,
or every element sitting on a card is scored against the wrong colour.

## The editorial pilot

Piloted the design-skill pass on Contemporary Editorial because it was the
least finished of the five and had never been audited, so it risked the least
finished work. Chosen by the user: peak on the date reveal, one unbroken
Karachi evening rather than cut chapters, premium-minimal register, signature
move is the invitation folding open. Brief is in the site's `BRIEF.md`.

Six photographs in that site's `public/assets/` were **face photographs of the
couple and their friends**, unreferenced anywhere. They were not forgotten
work: they are barred by the no-faces rule, and the motifs with
"standing in for" alt text are their replacements. They were still shipping
about 920 KB into `dist/`. Parked in `art-masters/` as
`editorial-*-unused-face-photo.webp`; `dist/` went from roughly 2.4 MB to 1.5 MB.
Check for this pattern on the other four sites.

The evening ground does **not** ramp linearly across the page. A linear ramp
spends real scroll distance in the mid-tones, where neither ink nor paper text
clears 4.5:1. Each act holds a settled ground while its text is read and the
change happens in the act's leading padding. Oxblood also fails on the night
ground at 2.3:1, so the accent is now hour-aware: oxblood while there is
daylight, gold once the lamps are on. Same ink, lit for the hour.

The fold animates transform only, never opacity. Fading leaves up from 0.001
makes the animation load-bearing for legibility, and anything that stops the
trigger updating leaves the whole invitation blank. It has to fail readable.

## Editorial's photography

The four monoline motif frames (chai, rooftop, kurta, garland) read as clunky
next to the one real photograph on the page, and the mix of the two was most
of why the story row looked weak. Replaced with four generated stills, 2
credits each on `nano_banana_pro`, 8 total.

The style preamble came off `nikkah-details.webp`, which was already working:
it is *not* black and white. It is near-black wood, ivory, henna brown, and
exactly one saturated oxblood accent, which is the site palette. Reusing that
one preamble verbatim across all four prompts is what makes them read as a
single shoot. Each frame carries the oxblood somewhere: a bowl, a velvet
throw, silk on a stool, a ribbon through the garland.

The sherwani prompt **failed** on the first attempt with a stack of negatives
("no people, no faces, no bodies, no mannequin"). Rewriting it positively, as
"an empty black sherwani hangs alone on a wooden hanger", went through first
try. Prefer describing the empty scene over listing what must not appear.

They are mounted as plates, inset in a paper mat, rather than bled to the
frame edge. That is structural, not decorative: the back half of the evening
is nearly black, and a dark photograph bled to the edge has no boundary
against the ground. The mat keeps a lit surface under every image so a frame
still reads at 9pm. Frame 03 was remounted to match.
## The ajrak pass

Nine sections, and before this only two of them carried any visual at all.
That, not the typography, was why the site read as plain: the type was already
good and the gate was already beautiful, but seven sections were pure text.

`rooftopSkyline` on the story plate was not merely "missing ajrak" as the old
note said. It is a Lahore rooftop with kites, which is Punjab, on a Sindhi
site. Wrong province, not just wrong texture. Replaced with a photograph of
carved wooden printing blocks, which is also what the story copy is actually
about ("like an ajrak block returning to cloth").

Four photographs generated, 2 credits each. Same method as Editorial: one
style preamble reused verbatim, drawn off the two images the site already had.
Unlike Editorial the palette here is **saturated**, because ajrak is indigo and
madder and that is the point. Hands appear in the vat frame, which the
no-faces rule allows and which craft photography wants.

The hero photograph broke the hero text and the measurement caught it. The
frame has a bright hazy sky, the hero scrim was only 28% opaque at centre, and
sampling the composited pixels under each text block gave 2.77:1 for the
headline against the 3:1 it needs. Fixed by darkening the photograph to 75%
brightness at encode time **and** taking the scrim to 45%: 6.39:1. Darkening
the source was the better half of that fix, because more indigo scrim flattens
the cloth's colour while darkening keeps the madder-to-indigo relationship.

Method note: a photographic background cannot be checked by reading
`backgroundColor`. Draw the image to a canvas, apply the same cover and
position mapping the CSS uses, sample the pixels under each text rect, then
composite the scrim alphas over them by hand. Use the *least* protective alpha
in each band, because the worst pixel is the one that fails.

The RSVP ampersand was `--madder-bright` on indigo at 2.1:1. Madder is a cloth
dye and has nowhere to go against indigo; ochre is already the palette's warm
note on dark grounds and clears 4.9:1. Same shape as the Editorial accent
problem, same answer.

Two false positives worth remembering, both from the sweep's own filter:
rejecting any background under 0.9 alpha made `.venue__card` (a real
`rgba(8,26,49,0.82)` scrim with a backdrop blur) invisible to it, so the venue
text looked like a 1.05:1 failure when the true worst case is about 10.9:1.
Accept a scrim at 0.75 and up, and composite it rather than skipping it.

## Two ways an image audit lies to you

Both cost real credits on the nikkah pass.

**Grepping for `<img>` under-counts.** The audit reported "zero photographs
wired" on a site that had three, because they are CSS backgrounds
(`url('/assets/...')`) rather than markup. The same miss then produced a brief
for "Our beginning", a section that already carried `nikkah-stilllife.webp`
through `.portrait-story__image`. Two credits bought a near-duplicate of a
better existing photograph. Check computed `background-image` as well as
`<img>` before declaring a frame empty.

**"Generous negative space" and "empty margins" are read literally.** Asking
for a subject in the middle third with quiet margins produced a letterboxed
portrait: flat dead bands with hard vertical seams down both sides of a 16:9
frame. Describe the scene filling the frame instead ("continuous architecture
edge to edge, no flat borders") and let the composition centre itself.

## Contrast against a photograph is solvable, not guessable

The method that has now worked on three sites: draw the photograph to a canvas
at the element's real cover geometry, walk the pixels under each text block,
composite the scrim and veil alphas at that y, and take the worst ratio. Then
solve, rather than nudging values and hoping.

On the nikkah hero that turned a failing frame (champagne eyebrow 3.46, meta
2.94, both needing 4.5) into a passing one by testing four scrim-and-brightness
combinations and picking the one with the lightest top scrim: 0.40/0.50/0.72
with the photograph re-encoded at 75% brightness. Final worst case 5.05.

**Darkening the photograph beats thickening the scrim** when the palette has a
name to protect. A heavy olive scrim turns ivory marble grey-green; dropping
the source to 75% keeps it ivory, only dimmer. Same on the ajrak hero.

## Choosing between two crops of the same scene

The nikkah venue arch is ratio 0.82 on mobile and 1.16 on desktop, so neither
the 1.50 landscape nor the 0.47 portrait fits it. Percentage-discarded is a
useless tie-breaker: 45% of width against 43% of height.

What settles it is how much of the picture's own detail survives the crop.
Render each source into the frame, then measure mean absolute luminance
gradient. The portrait keeps 24.07 of its 24.23; the landscape keeps 21.1 of
27.54. The portrait's composition survives the arch almost intact, so it wins
on narrow screens while the landscape stays on desktop.

## Porting the dateline to nikkah

Same rebuild as the editorial date reveal, and the same two faults underneath
it: `justify-content: space-between` on a full-width flex row, which pushes the
numerals to the panel edges and strands the separators in the gaps, and a
single hairline rectangle that reads as an input field rather than as print.

Two things did not port, and both are worth checking before copying this
pattern to the remaining sites.

**The card was already double-ruled.** `.ceremony__card` carries a gold border
plus an inset outline, so the stage's own border made a third concentric
rectangle. It was dropped entirely: the ivory fill against the paper card
already separates the scratch panel, and tone does the job an outline was
doing badly.

**Gold on ivory is 3.07:1.** That clears the 3:1 bar for the numerals, which
are display type, and nothing else. The caption had to be charcoal at 13.63:1,
and the separators are pinned to `clamp(1.6rem, 2.1vw, 2rem)` rather than an em
fraction of the numerals, because an em fraction drops them under 24px on a
narrow screen and the 4.5:1 bar starts applying to a colour that cannot meet
it. Measured 26px at 390 and 30px at 1440.

The mobile numerals were also filling only 67% of the panel, leaving the same
hole the editorial version had at first. 19vw takes it to 81%.

## The mehendi pass, and two audit counts that were wrong

Both errors were the same shape as the nikkah `<img>` miss: grepping for one
spelling of a thing and reporting the count as fact.

**"Least motion of the five" was wrong.** Counting the literal string
`ScrollTrigger` catches the import, the plugin registration and the refresh
call, but every actual animation configures the lowercase `scrollTrigger:`
property, which the grep missed. Counted properly, mehendi has 6 scrollTrigger
blocks, 2 timelines and 16 tweens, second only to heritage's 10 / 4 / 16. It
did not need more motion; the motion it has is good, bails cleanly on
`prefers-reduced-motion`, uses directional per-element reveals with
`once: true` and `clearProps`, and its counter-rotating chakris are already a
signature move in the scrollcraft sense. A chakri is a pinwheel; spinning it on
scroll is motivated.

**"Zero contrast failures" was wrong, and wrong in the dangerous direction.**
The sweep skipped every element whose effective opacity was under 0.5, and
GSAP holds all `.reveal` elements at opacity 0 until their trigger fires, which
it never does in a pane with no RAF. So the audit silently excluded most of the
page and reported a pass. Clearing the from-states first surfaced eight real
failures. **Any contrast sweep on a site with scroll-reveal animation has to
neutralise the animation first**, or it grades only the handful of elements
that happen to be visible.

The same trick separates real overflow from animation artefacts: 10 elements
looked like they overflowed at 390, but 9 of them were sitting at their
`x: -56` reveal start. Clearing transforms left exactly one real defect.

## Mehendi's palette does not clear AA

Measured, not guessed, and pre-existing:

- Cream on fuchsia is **3.93:1** where 4.5 is needed. It recurs on the
  "Scratch the date" hint, the "Open map" button, the dress-code body copy and
  a swatch label.
- Marigold as the heading accent is **2.87:1** on leaf green and **2.43:1** on
  fuchsia, both needing 3.
- The decorative burst is 2.78:1, but it is `aria-hidden` ornament.

Every fix touches a brand colour, so none were applied. Darkening the fuchsia
from `#df2d71` to roughly `#cf2467` clears all four cream cases at 4.65. The
marigold accent needs to go paler still to clear fuchsia, or become cream on
the saturated grounds, where it passes as large text at 3.93.

## A second way to get an unstyled page

CLAUDE.md warns that serving heritage's `dist/` at a server root gives an
unstyled page because the base is `/Invitation/`. There is a second route to
the same symptom, and it bit on the dev server rather than the build.

`@fontsource/cormorant-garamond`, `dm-mono` and `inter` were declared in the
root `package.json` but were not in `node_modules`. `main.css` opens with
`@import '@fontsource/...'`, so postcss failed, the whole stylesheet 500'd, and
the page rendered with **`document.styleSheets.length === 0`**. Everything
measured wrong in a way that looks like real bugs: 631px of horizontal
overflow, `.opener` reporting `position: static` and `overflow: visible`, the
gate art at its natural 2048px. None of it was true. Plain `npm install` fixed
all of it, and the opener architecture turned out to match the documented
design exactly.

Unlike the base-path version, this one *does* leave a trace: a 500 in the
console and a postcss ENOENT in the dev-server log. **Check
`document.styleSheets.length` before trusting any measurement.** A contrast
sweep run against that page returned a clean pass, which was meaningless.

## Greps that under-report, three times now

Every site names the same things differently, and a grep written for one site
silently returns zero on another. This has now produced three wrong statements
to the user:

- `<img src="./assets/` missed nikkah's photographs, which are CSS
  `url('/assets/...')` backgrounds. Reported "zero photographs wired" on a site
  with three, and then paid to regenerate one that already existed.
- `ScrollTrigger` (capitalised) missed mehendi's animations, which configure
  the lowercase `scrollTrigger:` property. Reported "least motion of the five"
  about the second-most animated site.
- `.section-kicker` and `<br />` missed heritage entirely, which uses
  `.eyebrow` and `<br>`. Reported it as already clean of house-style issues
  when it had six numbered eyebrows and five formula headings.

Search for the *concept* across spellings, or confirm a zero before reporting
it as a fact.

## The date separators fail on every site that has them

Third occurrence, same shape: a small separator glyph coloured as a neutral
speck rather than as part of the date. Editorial's were `--muted` grey at
2.98:1, nikkah's were olive, heritage's were `#8f7760` taupe at 3.48:1. The fix
is the same each time: give the separator the same ink as the numerals and
quieten it by size instead of by colour.

The one exception is where that ink is itself marginal. Nikkah's gold is
3.07:1 on ivory, which only clears the large-text bar, so there the separator
has to be pinned above 24px with a clamp rather than set as an em fraction.
Heritage's madder is about 7.5:1, so it passes at any size and needs no pin.

## Karachi Deco, the sixth site

Built from nothing on 8 September 2026, chosen first out of the eight original
concepts. Four images, eight credits, all four usable on the first pass.

**Why it is the only sans-led site.** The other five are serif worlds and a
sixth would have read as a variant of one of them. Deco was drawn with
geometric sans — Futura and its cousins — so Jost against DM Mono is the
historically right choice *and* the one that separates it from the family.
Nothing else in the set is allowed to go sans; that is the whole point.

**The signature move: bilateral convergence.** Every facade, grille and fan in
this vocabulary folds down its own centre line, so the page assembles that way
too. Paired blocks enter from opposite edges and meet on the axis instead of
rising from below, which is what all five siblings do. The tweens carry
transform only — never opacity — so a ScrollTrigger that fails to update
leaves a block un-offset rather than invisible. Same rule as Editorial's fold,
same reason: an invitation has to fail readable.

**The gate crop was a measurement, not a taste call.** The doors are ratio
0.56. Cover-cropping that into any landscape viewport throws most of the frame
away, and centring lands on the blank lower door panels. `object-position:
center 40%` keeps the band from the top rail through the handles, which is the
part that reads as a gate. On portrait viewports the height governs and the
value does nothing, so the fan lunette shows in full.

**What the drawn motifs cost the gate.** The first version overlaid a `decoFan`
grille and a champagne `.opener__seam` on the photograph. The photograph
already has a fan lunette and a brass mullion dead centre; the drawn versions
sat on top of the real ones and read as a printing fault. Both were cut. When
the art already contains the motif, the motif is not additive.

**Three bugs, all invisible to inspection.**

1. *The hero photograph never painted.* `html` carries a background, which
   stops `body`'s background propagating to the canvas — so `body` paints as
   an ordinary element and `.hero`'s art, scrim and keyline, all at negative
   z-index, fell behind it. Every computed style was correct and the console
   was clean; the section simply rendered flat black. `isolation: isolate` on
   `.hero` fixes it.
2. *Every injected SVG was the wrong size.* The stylesheet had no `.motif`
   rule, so each `<svg>` fell back to width 100% and an auto height from its
   own aspect ratio. For `decoRule` at 160:1 that meant the entire band
   rendered about 8px tall inside a 30px host, which quietly defeated the
   slice sizing rule the kit documents. The other five sites all carry
   `.motif { width: 100%; height: 100% }`; this one was written without it.
3. *`decoRule` did not obey its own docstring.* It shipped
   `preserveAspectRatio="xMidYMid slice"` on a 960-wide viewBox, so the width
   governed the scale, the band was drawn 1.35x too large, and `slice` shaved
   its top and bottom rules clean off — the exact failure the kit notes warn
   about. Now `xMinYMid slice` on a 4800-wide box, which is wider than any
   viewport at a 48px band height, so the height always governs.

**The band was redrawn twice.** A zigzag between two hairlines read as a word
processor border. A ziggurat at a 2:1 repeat read as graph paper — twenty-one
repeats across a desktop. At 4:1 it reads as a cornice. The keystone tick was
also shortened: run to the baseline it floated in the void under the ziggurat
as a stray mark, so it now hangs from the plateau only.

**Contrast.** Champagne on the emerald venue panel is 4.02:1 against the 4.5
small text needs. Fixed scoped to `.venue` with `--champagne-lt` at 5.43:1,
not by moving `--champagne`, which also drives every rule and motif accent on
the black sections where the same pair reads at 7.9:1. Same discipline as
heritage.

The hero needed the scrim solved rather than nudged: at 0.55 / 0.34 / 0.78 the
worst composited pixel under NOOR & ZAYN was 2.92:1 against 3.0, and the
right-hand meta line 4.48 against 4.5 — both near misses caused by the same
handful of lit windows. 0.62 / 0.44 / 0.80 takes them to 3.67 and 5.52. The
alternative, darkening the photograph, was rejected here because the glowing
windows are the reason the shot works; that trade went the other way on
nikkah, where the palette had a name to protect and the photograph did not.

**Verified with real Chrome, not the pane.** The Browser pane reports
`document.hidden === true`, so RAF never runs, GSAP never advances, and after
the first load the screenshots stop repainting entirely — the capture kept
showing an opener that had been removed from the DOM. Everything here was
verified through `.test-tools/playwright/deco-review.mjs`, which drives the
real Chrome at 1440x900 and 390x844 plus a `reducedMotion: 'reduce'` pass:
gate parts and hides, focus lands on `#main`, all six convergence blocks
resolve to x=0, no horizontal overflow at either width, no page or console
errors, and under reduced motion nothing is offset or under 0.9 opacity.


## The audio was Ogg-only on every site, and one file was 11 kHz

Found while looking for something worth doing rather than something new to
build. All five older sites shipped their music as a lone Ogg Vorbis source.

The first version of this claim, told to the user, was too strong: "silent on
Safari and iOS". Checked properly, Safari added native Ogg Vorbis in 18.4,
was partial from 14.1 to 18.3 depending on system components, and played
nothing below that. So a 2025-or-later iPhone was fine and everything older
was not. Still worth fixing for a wedding invitation, where the guest list
spans whatever phones people happen to own — but worth stating accurately.

No transcoding was needed and no credits were spent: Commons generates an
MP3 for every audio file, at `/wikipedia/commons/transcoded/<h0>/<h0:2>/
<Name.ogg>/<Name.ogg>.mp3`, where the directory pair comes from the md5 of
the underscored filename. That md5 trick is the only route in from this box,
because `commons.wikimedia.org` is blocked here while `upload.wikimedia.org`
is not. An ffmpeg-static install was started for the job and abandoned — it
crawled to 22 MB of 80 and was never needed.

**The real find was `raga-kaushi-kanra.ogg`: 11 kHz stereo Vorbis at 57
kbps.** Chrome rejects it with `MEDIA_ERR_SRC_NOT_SUPPORTED` on most loads —
three runs of three on nikkah, one of three on editorial — while every other
track on every other site decoded three out of three. It is also a legacy
rate that sounds muffled. Nikkah and editorial now list the 44.1 kHz MP3
first and keep the Ogg behind it. Heritage and mehendi keep their Ogg in
front: 44.1 kHz at 192 and 80 kbps, better than a 64 kbps MP3, and they never
failed.

**Two traps in verifying this**, both of which produced convincing false
failures before being understood:

1. The browser picks one source and never requests the other, so loading the
   page proves nothing about the fallback. Each file has to be loaded on its
   own.
2. The page's own `<audio>` element requests the same URL as the probe, and
   two elements contending for one large media resource make Chrome fail one
   of them with the same error code a genuinely broken file gives. The tell
   was that Karachi Deco never flaked — it was the only site on
   `preload="none"`. Detaching the page element first made the signal stable,
   and every site is now on `preload="none"` anyway, since the music only
   starts on the gate click.

Before that was understood the failure appeared to wander between sites on
repeated runs, which is the signature of a racy probe rather than a broken
file — and is why it was chased instead of reported.


## Nastaliq, the seventh site

Chosen from the two agreed concepts because it is the one most unlike the
other six: the only site where the script is the image. The first built
under the new rule that each site gets its own couple — Hira & Daniyal,
Pakistani names, since the page is written in their script. The botanical
site is the natural home for an international couple.

**Rule, then write.** A calligrapher rules the jadval before writing inside
it. So each panel draws its frame first (gold band, lapis and oxblood
hairlines, anticlockwise from the top right), then its Nastaliq inks in right
to left — the direction the pen moves — then the English gloss. The reveal is
a mask three times the element's width sliding across it, with a soft leading
edge so it reads as wet ink rather than a wipe. Built on IntersectionObserver
and CSS transitions, so it does not depend on the GSAP ticker running.

**Fail readable, again.** Nothing is hidden by default. The hidden state
exists only on `.is-armed`, which script adds and strips once the panel is
done; with no script, reduced motion, no observer or no mask support, every
panel is simply there. Reduced motion measured zero armed panels, zero masks,
zero faded elements, and all 60 rules drawn.

**No invented script.** Image models produce Arabic-looking gibberish. On a
page whose premise is authentic Nastaliq, one fake word in a photograph would
undo it for any Urdu reader, so the four photographs are of instruments and
paper only, every prompt banned letters outright, and all real Urdu comes
from the font.

**Things measured rather than assumed:**

1. *Ink overflow.* Nastaliq reaches well outside its line box, and a mask
   clips to the border box, so any ink outside would vanish mid-reveal and pop
   in at the end. Each line was isolated and photographed with a margin: zero
   dark pixels outside the box, on all seven lines, at both widths — including
   after the hero's line-height was tightened from 1.75 to 1.45.
2. *Direction.* Sampled mid-reveal against an absolute clock: 456 ink pixels
   in the line's right half, 0 in its left.
3. *A stitched photograph.* The haveli came back with a seam across the top:
   rows 256–267 at 5–7× the median row-to-row difference, against about 2× for
   ordinary architecture. Cropped at row 280; worst row afterwards 2.4×.
4. *Contrast over a photograph.* Text over the lit arcade measured 1.65 to
   2.17:1. Thickening the veil would have put out the lamps, so the venue card
   is mounted on its own night panel instead; worst now 8.2:1.
5. *Gold that cannot carry text.* The `·` separators in `--gold` measured
   2.68 and 2.9. Scoped to `--gold-ink` #7a5a1f at 5.3; the token itself still
   drives the rules, where it only has to be seen.

**Zar-afshan.** The first version was five radial-gradient dots on small
tiles, and in a screenshot it was unmistakably polka dots on a lattice. Gold
leaf is torn, not punched: the flecks are now seeded irregular polygons on two
tiles of 520px and 347px.

**A broken Urdu line.** The invitation line wrapped between «عزت و» and
«مسرت», leaving the و hanging and splitting "honour and joy" across two
lines. The phrase is held together with a nowrap span, and `text-wrap:
balance` evens the two lines.

**The reply buttons were late.** The gloss waited for the ink to finish, so
the RSVP card sat nearly empty for close to three seconds. It now starts when
the last line is 55% written, and the clean-up timer runs from the true end of
the ink so the mask never comes off mid-stroke.

**Music.** Raag Jhinjhoti, Ustad Abdul Karim Khan — public domain in India,
since he died in 1937. The Commons page gives no recording year, so US status
rests on its tag. MP3 first at 44.1 kHz, original Vorbis behind it. It ships
unfaded: ffmpeg-static now returns EFTYPE on this box, from Git Bash and from
Node alike, though its PE header is intact.

## Botanical, the eighth site

The last of the three approved concepts, and the one kept for the
international couple: Amelia & Hamza, an English bride and a Pakistani groom.
The site's premise is theirs — two gardens, one table.

**One stem, two gardens.** Deco converges from the edges and Nastaliq reveals
panel by panel, so this one needed a different shape of motion: a single
continuous line through the whole page. A drawn stem grows down the left
gutter, putting out a flower at each section and alternating between the two
gardens, ending at the damask rose, which both of them grow.

**The tip follows the eye, not the scrollbar.** Tied to scroll percentage, the
drawing would run ahead of the reader at the top of a long page and lag at the
bottom. Instead the stem's drawn length is solved from a lookup of length
against page height, so the tip always sits at 62% of the viewport, where the
eye rests while reading. Measured from the path geometry at every section, at
both widths: 0px of error.

**Decoration, and built to be.** Stem, flowers and labels are aria-hidden and
nothing on the page waits for them. No script means no plant, not a broken
page. Reduced motion measured the full stem drawn and five of five flowers open
before the gate was even clicked.

**Kept out of the shared kit.** Five flower drawings and a vine are this
garden's, and adding them to the kit would have meant a commit and a deploy on
seven live sites. `flora.js` is local, like Nastaliq's jadval.

**No flower on the words.** A margin drawing that clips a heading is worse than
no drawing, so the harness tests every flower box against every line box of
text on the page. Zero intersections at 1440 and at 390. On phones the left
gutter widens to 38px to make room, and the herbarium labels are dropped.

**Things that looked right and were not:**

1. *The sweet pea read as a tulip* at margin size. A smooth dome is a tulip; a
   sweet pea's standard petal is notched and ruffled. Redrawn with the notch and
   an inner ruffle.
2. *The hero date line measured 4.47:1* against 4.5, over the flat-lay
   photograph's patch of window light. It now uses full ink instead of
   `--ink-soft`.
3. *The walled-garden image shipped at 486 KB.* Dense planting resists
   compression; 1800px at q80 brings it to 367 KB.

**Music, and why the obvious recording was wrong.** Commons had Barbirolli and
the Hallé playing an Enigma variation, tagged public domain. That tag rests on
EU law: performer rights there expire after 70 years. In the US, recordings
published between 1947 and 1956 are protected for 110 years — until 2057 — and
GitHub Pages is a US host. Rejected. What ships is *Salut d'Amour* from an
October 1911 Zonophone disc, via the Internet Archive's Great 78 Project:
published before 1926, so public domain in the US too, and a piece Elgar wrote
as his engagement present. The rule worth keeping: check the publication year
against US law, not just the Commons tag.

## Open items

1. Ajrak: the resist-to-madder-to-indigo dye spine is not built. The section
   colours already exist (verse sand, invitation indigo, attire madder) but
   are not in process order, and reordering them touches the whole page.
2. Ajrak still uses Fraunces as its display serif, which taste-skill bans by
   name as an LLM default. Replacement was approved but not carried out.
3. Mehendi's palette does not clear AA. Cream on fuchsia is 3.93:1 and the
   marigold heading accent is 2.87 on leaf green and 2.43 on fuchsia. Left as
   the couple chose it; darkening the fuchsia to about `#cf2467` would clear
   the four cream cases at 4.65.
4. Nikkah desktop still has no 16:9 opening film (~7.5 credits).
5. No site has been checked on a real phone.
6. No published preview/artifact for any site.
7. Ajrak has no music at all. Every other site has a gate-triggered track
   and a play/pause control; ajrak has neither. It needs a public-domain
   Sindhi or Sufi recording picked before anything can be wired.
8. Nastaliq is live at https://hermes129.github.io/nastaliq-lahore-wedding/.
9. Botanical is built, verified and committed locally, but not deployed.
   With it, all three approved concepts are built.
10. ffmpeg-static no longer executes here (EFTYPE). The Nastaliq track would
    benefit from a fade at its loop point once it does.

Closed: all five sites have now had the design pass. Ajrak is a git repo with
an initial commit. The nikkah venue is no longer named twice, at the heading as
well as the kicker, and its occasion line clears the door handles. Editorial
was audited and rebuilt as one continuous evening. Ajrak was photographed and
de-Punjabi'd. Nikkah was photographed, its face photos parked and its mobile
venue arch given the crop that survives it. Mehendi lost 1.3 MB of superseded
assets and face photographs, and gained the global `.sr-only` it never had.
Heritage gained its WebM fallback and three scoped contrast fixes.

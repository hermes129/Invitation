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

## Costs so far

Heritage 18.25 · Mehendi ~10 · Nikkah 4 + 7.5 film · Ajrak 2.
Balance was ~497 at last check. The ajrak gate landed first try.

## Open items

1. `projects/sindhi-ajrak-invitation` **is not a git repo** while the other
   four are. All ajrak work is uncommitted.
2. Nikkah section 06 "The place" duplicates section 02 "The venue" — rename
   06 to "The setting".
3. Nikkah mobile: "request the honour of your presence at their nikkah"
   clips the gold door handles. Needs ~20px of lift.
4. Ajrak hero and story plate are still plain; `rooftopSkyline` on the story
   section contains no ajrak at all.
5. Contemporary Editorial has never been audited.
6. No published preview/artifact for nikkah or ajrak.

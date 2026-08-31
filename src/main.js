import './styles/main.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';

import { initMotifs, initDraw } from './utils/draw.js';
import { initCursor, initMagnetic } from './utils/ui.js';
import { initOpener } from './animations/opener.js';
import { initHero } from './animations/hero.js';
import { initStory } from './animations/story.js';
import { initVenue } from './animations/venue.js';
import { initDress } from './animations/dress.js';
import { initTimeline } from './animations/timeline.js';
import { initRsvp } from './animations/rsvp.js';
import { initDateScratch } from './date-scratch.js';

gsap.registerPlugin(ScrollTrigger);

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── Music ─────────────────────────────────────────────────────────────── */
const music = document.querySelector('#site-music');
const musicToggle = document.querySelector('#music-toggle');
const musicLabel = musicToggle?.querySelector('.music-toggle__label');

if (music) music.volume = 0.28;

function syncMusicControl() {
  if (!music || !musicToggle) return;
  const isPlaying = !music.paused;
  musicToggle.setAttribute('aria-pressed', String(isPlaying));
  musicToggle.setAttribute('aria-label', isPlaying ? 'Pause background music' : 'Play background music');
  if (musicLabel) musicLabel.textContent = isPlaying ? 'Pause music' : 'Play music';
}

async function setMusicPlaying(shouldPlay) {
  if (!music) return;
  if (!shouldPlay) { music.pause(); syncMusicControl(); return; }
  try {
    await music.play();
  } catch {
    // The control stays available if the browser declines autoplay.
  }
  syncMusicControl();
}

document.querySelector('.opener__trigger')?.addEventListener('click', () => {
  if (musicToggle) musicToggle.hidden = false;
  setMusicPlaying(true);
});

musicToggle?.addEventListener('click', () => setMusicPlaying(music?.paused ?? true));
music?.addEventListener('play', syncMusicControl);
music?.addEventListener('pause', syncMusicControl);

/* ── Smooth scroll (desktop pointers only) ─────────────────────────────── */
if (!reducedMotion && window.matchMedia('(min-width: 1025px) and (pointer: fine)').matches) {
  const lenis = new Lenis({ lerp: 0.085, smoothWheel: true, wheelMultiplier: 0.85 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

/* ── Boot ──────────────────────────────────────────────────────────────── */
// Motifs are injected before anything measures the DOM, so initDraw() can
// find the paths it needs to dash out.
initMotifs();

initCursor(reducedMotion);
initMagnetic(reducedMotion);
initHero(reducedMotion);
initStory(reducedMotion);
initVenue(reducedMotion);
initDress(reducedMotion);
initTimeline(reducedMotion);
initRsvp(reducedMotion);
initDateScratch();
initDraw(reducedMotion);

ScrollTrigger.refresh();

initOpener(reducedMotion).then(() => {
  ScrollTrigger.refresh();
});

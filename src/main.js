import './styles/main.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';
import Lenis from '@studio-freight/lenis';
import { initHero } from './animations/hero.js';
import { initStory } from './animations/story.js';
import { initVenue } from './animations/venue.js';
import { initDress } from './animations/dress.js';
import { initTimeline } from './animations/timeline.js';
import { initGallery } from './animations/gallery.js';
import { initRsvp } from './animations/rsvp.js';
import { initCursor, initMagnetic, initLazyImages } from './utils/ui.js';
import { initOpener } from './animations/opener.js';

gsap.registerPlugin(ScrollTrigger, Flip);
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reducedMotion && !window.matchMedia('(pointer: coarse)').matches) {
  const lenis = new Lenis({ lerp: 0.085, smoothWheel: true, wheelMultiplier: 0.85 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

initLazyImages();
initCursor(reducedMotion);
initMagnetic(reducedMotion);
initHero(reducedMotion);
initStory(reducedMotion);
initVenue(reducedMotion);
initDress(reducedMotion);
initTimeline(reducedMotion);
initGallery(reducedMotion);
initRsvp(reducedMotion);
ScrollTrigger.refresh();

initOpener(reducedMotion).then(() => {
  ScrollTrigger.refresh();
});

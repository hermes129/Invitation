import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initTimeline(reduced) {
  if (reduced) return;
  gsap.from('.timeline__list', {
    '--line-progress': 0, ease: 'none',
    scrollTrigger: { trigger: '.timeline__list', start: 'top 78%', end: 'bottom 72%', scrub: 1 },
  });
  gsap.from('.timeline__list li', {
    x: 42, autoAlpha: 0, stagger: .2, duration: .8,
    scrollTrigger: { trigger: '.timeline__list', start: 'top 74%', once: true },
  });
}

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initVenue(reduced) {
  if (reduced) return;
  gsap.to('.venue__art', {
    yPercent: -12, ease: 'none',
    scrollTrigger: { trigger: '.venue', start: 'top bottom', end: 'bottom top', scrub: true },
  });
  gsap.from('.venue__card', {
    xPercent: -14, autoAlpha: 0, duration: 1,
    scrollTrigger: { trigger: '.venue', start: 'top 68%', once: true },
  });
}

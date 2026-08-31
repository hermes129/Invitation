import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initHero(reduced) {
  const hero = document.querySelector('.hero');
  if (!hero || reduced) return;

  gsap.timeline()
    .from('.hero__meta, .scroll-cue', { autoAlpha: 0, y: 18, stagger: .12, duration: .75 })
    .from('.hero__date', { autoAlpha: 0, y: 12, duration: .6 }, '-=.5')
    .from('.hero__title span', { yPercent: 112, stagger: .12, duration: 1.25, ease: 'power4.out' }, '-=.7')
    .from('.hero__arch', { autoAlpha: 0, scale: .94, duration: 1.4, ease: 'power3.out' }, '-=1.2');

  gsap.timeline({ scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 1 } })
    .to('.hero__title span:first-child', { xPercent: -18 })
    .to('.hero__title span:last-child', { xPercent: 16 }, 0)
    .to('.hero__arch', { scale: 1.06, autoAlpha: .4 }, 0)
    .to('.hero__date, .hero__meta', { autoAlpha: 0, y: -35 }, 0);
}

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initDress(reduced) {
  if (reduced) return;
  gsap.from('.dress__type span', {
    yPercent: 115, stagger: .13, duration: 1.25, ease: 'power4.out',
    scrollTrigger: { trigger: '.dress', start: 'top 70%', once: true },
  });
  gsap.from('.swatches li', {
    autoAlpha: 0, y: 20, stagger: .07, duration: .6,
    scrollTrigger: { trigger: '.swatches', start: 'top 85%', once: true },
  });
}

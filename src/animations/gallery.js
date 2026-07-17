import { gsap } from 'gsap'; import { ScrollTrigger } from 'gsap/ScrollTrigger';
export function initGallery(reduced) { if (reduced) return; gsap.from('.gallery__item', { clipPath: 'inset(100% 0 0 0)', stagger: .15, duration: 1.2, ease: 'power4.inOut', scrollTrigger: { trigger: '.gallery__grid', start: 'top 70%' } }); }

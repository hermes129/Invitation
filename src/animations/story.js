import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initStory(reduced) {
  const scroller = document.querySelector('.story__stack');
  if (scroller && window.matchMedia('(max-width: 720px)').matches) {
    requestAnimationFrame(() => { scroller.scrollLeft = 0; });
  }
  if (reduced) return;

  const media = gsap.matchMedia();
  media.add('(min-width: 721px)', () => {
    const tween = gsap.from('.story__card', {
      y: 60, autoAlpha: 0, stagger: .14, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: '.story__stack', start: 'top 80%', once: true },
    });
    return () => tween.kill();
  });

  gsap.from('.story__script', {
    autoAlpha: 0, y: 24, duration: 1,
    scrollTrigger: { trigger: '.story__script', start: 'top 88%', once: true },
  });

  ScrollTrigger.refresh();
}

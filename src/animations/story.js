import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initStory(reduced) {
  const scroller = document.querySelector('.story__stack');
  if (scroller && window.matchMedia('(max-width: 1024px)').matches) {
    const resetScroller = () => requestAnimationFrame(() => { scroller.scrollLeft = 0; });
    resetScroller();
    window.addEventListener('pageshow', resetScroller, { once: true });
  }

  if (reduced) return;

  const cards = gsap.utils.toArray('.polaroid');
  const media = gsap.matchMedia();

  media.add('(min-width: 1025px)', () => {
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: '.story',
        start: 'top 72%',
        end: 'bottom 42%',
        scrub: .8,
      },
    });

    timeline
      .fromTo(cards[0], { y: 90, rotate: -4 }, { y: 0, rotate: -1.5, ease: 'none' }, 0)
      .fromTo(cards[1], { y: 145, rotate: 3 }, { y: 35, rotate: 1, ease: 'none' }, 0)
      .fromTo(cards[2], { y: 105, rotate: -2 }, { y: 0, rotate: 1.5, ease: 'none' }, 0)
      .fromTo('.story__script', { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, ease: 'none' }, .55);

    return () => {
      timeline.kill();
      gsap.set(cards, { clearProps: 'transform' });
      gsap.set('.story__script', { clearProps: 'transform,opacity,visibility' });
    };
  });

  ScrollTrigger.refresh();
}

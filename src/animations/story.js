import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initStory(reduced) {
  if (reduced) return;

  const cards = gsap.utils.toArray('.polaroid');
  const media = gsap.matchMedia();

  media.add('(min-width: 721px)', () => {
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: '.story',
        start: 'top top',
        end: '+=110%',
        pin: true,
        scrub: 1,
      },
    });

    timeline
      .to(cards[0], { x: '-45vw', y: '-12vh', rotate: -11, ease: 'none' }, .15)
      .to(cards[1], { y: '20vh', rotate: 7, ease: 'none' }, .1)
      .to(cards[2], { x: '39vw', y: '-11vh', rotate: 10, ease: 'none' }, .15)
      .fromTo('.story__script', { autoAlpha: 0, rotate: -7 }, { autoAlpha: 1, rotate: -7, ease: 'none' }, .4);

    return () => timeline.kill();
  });

  media.add('(max-width: 720px)', () => {
    const reveal = gsap.from(cards, {
      autoAlpha: 0,
      y: 28,
      stagger: .1,
      duration: .7,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.story__stack',
        start: 'top 82%',
        once: true,
      },
    });

    return () => reveal.kill();
  });

  ScrollTrigger.refresh();
}

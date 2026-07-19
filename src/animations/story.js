import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initStory(reduced) {
  if (reduced) return;

  const cards = gsap.utils.toArray('.polaroid');
  const media = gsap.matchMedia();

  media.add('(min-width: 1025px)', () => {
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

  media.add('(max-width: 1024px)', () => {
    gsap.set(cards[0], { xPercent: -50, rotate: -2, zIndex: 3 });
    gsap.set(cards[1], { xPercent: 80, rotate: 1.5, zIndex: 2 });
    gsap.set(cards[2], { xPercent: 210, rotate: -1, zIndex: 1 });

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: '.story__stack',
        start: 'top 12%',
        end: '+=140%',
        pin: true,
        scrub: true,
        anticipatePin: 1,
      },
    });

    timeline
      .to(cards[0], { xPercent: -180, rotate: -4, force3D: true, ease: 'none', duration: 1 }, 0)
      .to(cards[1], { xPercent: -50, rotate: 1, force3D: true, ease: 'none', duration: 1 }, 0)
      .to(cards[1], { xPercent: -180, rotate: 4, force3D: true, ease: 'none', duration: 1 }, 1)
      .to(cards[2], { xPercent: -50, rotate: -1, force3D: true, ease: 'none', duration: 1 }, 1)
      .fromTo('.story__script', { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, ease: 'none', duration: .5 }, 1.45);

    return () => {
      timeline.kill();
      gsap.set(cards, { clearProps: 'transform,zIndex' });
      gsap.set('.story__script', { clearProps: 'transform,opacity,visibility' });
    };
  });

  ScrollTrigger.refresh();
}

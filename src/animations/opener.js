import { gsap } from 'gsap';

const SEEN_KEY = 'nz-gate-seen';

/**
 * The gate opens one of two ways.
 *
 * FILM — a generated clip pushes through the mihrab arch and lands on darkness,
 * which we then cross-fade into the hero. This is the ceremony, and it only
 * plays when the file is genuinely ready to run start-to-finish.
 *
 * PANELS — the two painted halves slide apart. Instant, and the floor under
 * everything: it runs when the film is missing, still buffering, blocked from
 * autoplaying, under prefers-reduced-motion, or on a repeat visit.
 *
 * The rule that matters: a tap NEVER waits on the network. If the film is not
 * ready at the moment the guest taps, they get the panels immediately rather
 * than a spinner.
 */
export function initOpener(reduced) {
  return new Promise((resolve) => {
    const opener = document.querySelector('.opener');
    if (!opener) {
      document.body.classList.remove('intro-active');
      resolve();
      return;
    }

    const button = opener.querySelector('.opener__trigger');
    const leftPanel = opener.querySelector('.opener__panel--left');
    const rightPanel = opener.querySelector('.opener__panel--right');
    const seam = opener.querySelector('.opener__seam');
    const copy = opener.querySelector('.opener__copy');
    const film = opener.querySelector('.opener__film');
    const fade = opener.querySelector('.opener__fade');
    const filmSkip = opener.querySelector('.opener__film-skip');
    const site = document.querySelector('main');
    const skipLink = document.querySelector('.skip-link');
    const heroTitle = document.querySelector('#hero-title');
    const invitationTitle = document.querySelector('#invitation-title');

    let opened = false;
    let filmReady = false;

    // Returning guests have already watched it once; make them sit through it
    // again and the ceremony becomes an obstacle.
    let alreadySeen = false;
    try {
      alreadySeen = window.sessionStorage.getItem(SEEN_KEY) === 'true';
    } catch {
      // Storage unavailable — treat every visit as the first.
    }

    if (film && !reduced && !alreadySeen) {
      // canplaythrough, not canplay: we want the whole clip buffered, otherwise
      // it stalls mid-reveal on a slow connection.
      film.addEventListener('canplaythrough', () => { filmReady = true; }, { once: true });
      film.addEventListener('error', () => { filmReady = false; }, { once: true });
      film.load();
    }

    const finish = ({ skip = false } = {}) => {
      opener.remove();
      document.body.classList.remove('intro-active');
      try {
        window.sessionStorage.setItem(SEEN_KEY, 'true');
      } catch {
        // Not fatal; the guest just sees the film again next time.
      }
      const focusTarget = skip ? invitationTitle : heroTitle;
      focusTarget?.focus({ preventScroll: !skip });
      resolve();
    };

    const openPanels = ({ skip = false } = {}) => {
      if (reduced || skip) { finish({ skip }); return; }
      gsap.timeline({ onComplete: () => finish() })
        .to(copy, { autoAlpha: 0, scale: .985, duration: .28, ease: 'power2.out' })
        .to(seam, { autoAlpha: 0, duration: .4 }, .1)
        .fromTo(site, { scale: 1.025 }, { scale: 1, duration: 1.6, ease: 'power3.out', clearProps: 'transform' }, .08)
        .to(leftPanel, { xPercent: -105, duration: 1.6, ease: 'expo.inOut' }, .1)
        .to(rightPanel, { xPercent: 105, duration: 1.6, ease: 'expo.inOut' }, .1);
    };

    // How long before the clip ends the descent into the arch begins. Must
    // match the transition duration on .opener__fade.
    const LANDING = 1.25;

    const playFilm = () => {
      opener.classList.add('is-filming');
      let settled = false;

      // The generated clip finishes on the lit painting rather than darkness,
      // so the darkening is driven here off the video's own duration — that
      // way it still lands correctly if the clip is ever re-cut.
      const watchForLanding = () => {
        if (!film.duration || Number.isNaN(film.duration)) return;
        if (film.currentTime >= film.duration - LANDING) {
          opener.classList.add('is-landing');
          film.removeEventListener('timeupdate', watchForLanding);
        }
      };
      film.addEventListener('timeupdate', watchForLanding);

      // The clip ends on darkness rather than a hard stop, so the hero is
      // cross-faded in underneath instead of cut to.
      const land = () => {
        if (settled) return;
        settled = true;
        film.pause();
        film.removeEventListener('timeupdate', watchForLanding);
        // Skipping early has no time for the slow descent, so the veil is
        // shortened rather than skipped — the guest still arrives in darkness
        // instead of seeing the bright painting cut against the dark hero.
        const early = !opener.classList.contains('is-landing');
        if (early && fade) fade.style.transition = 'opacity .3s ease-out';
        opener.classList.add('is-landing');

        gsap.timeline({ onComplete: () => finish(), delay: early ? .3 : .12 })
          .to(filmSkip, { autoAlpha: 0, duration: .2 }, 0)
          .to(opener, { autoAlpha: 0, duration: .4, ease: 'power2.inOut' }, 0)
          .fromTo(site, { scale: 1.04 }, { scale: 1, duration: 1.1, ease: 'power3.out', clearProps: 'transform' }, 0);
      };

      film.addEventListener('ended', land, { once: true });
      // Belt and braces: if the clip stalls, don't strand the guest on the gate.
      film.addEventListener('stalled', land, { once: true });

      gsap.to(copy, { autoAlpha: 0, duration: .35, ease: 'power2.out' });
      gsap.to(filmSkip, { autoAlpha: 1, duration: .3, delay: .6 });

      film.play().catch(() => {
        // Autoplay refused even after a user gesture — fall back rather than
        // leaving a frozen first frame on screen.
        opener.classList.remove('is-filming');
        gsap.set(copy, { autoAlpha: 1 });
        openPanels();
      });

      filmSkip?.addEventListener('click', land, { once: true });
    };

    const enter = ({ skip = false } = {}) => {
      if (opened) return;
      opened = true;
      button.disabled = true;
      opener.classList.add('is-opening');

      if (!skip && filmReady && film) { playFilm(); return; }
      openPanels({ skip });
    };

    button.addEventListener('click', () => enter());
    skipLink?.addEventListener('click', (event) => { event.preventDefault(); enter({ skip: true }); });
    opener.addEventListener('keydown', (event) => { if (event.key === 'Escape') enter(); });

    if (!reduced) {
      gsap.fromTo(copy, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: .7, delay: .15, ease: 'power3.out' });
    }
  });
}

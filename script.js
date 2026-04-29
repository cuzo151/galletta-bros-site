// Galletta Bros — entrypoint
// Each section module registers via init functions called at the bottom.
const GB = {
  init() {
    if (window.gsap && window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
    }
    GB.detectHeroVideo();
  },

  detectHeroVideo() {
    const hero = document.querySelector('.hero');
    const video = hero && hero.querySelector('.hero__video');
    if (!hero || !video) return;
    const fail = () => hero.setAttribute('data-no-video', '');
    video.addEventListener('error', fail);
    // If no playable source loads within 2.5s, fall back so the page is never blank.
    setTimeout(() => {
      if (video.readyState < 2) fail();
    }, 2500);
  }
};

document.addEventListener('DOMContentLoaded', () => GB.init());

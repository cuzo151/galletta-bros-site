// Galletta Bros entrypoint
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
    if (video.error) { fail(); return; }
    video.addEventListener('error', fail);
    video.addEventListener('stalled', fail);
    setTimeout(() => { if (video.readyState < 2) fail(); }, 2500);
  }
};

document.addEventListener('DOMContentLoaded', () => GB.init());

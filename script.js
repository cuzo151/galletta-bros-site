// Galletta Bros — entrypoint
// Each section module registers via init functions called at the bottom.
const GB = {
  init() {
    if (window.gsap && window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
    }
    // Section inits are appended here in later tasks.
  }
};

document.addEventListener('DOMContentLoaded', () => GB.init());

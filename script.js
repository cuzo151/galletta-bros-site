// Galletta Bros entrypoint
// Each section module registers via init functions called at the bottom.
const GB = {
  init() {
    if (window.gsap && window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
    }
    GB.detectHeroVideo();
    GB.initWork();
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
  },

  async initWork() {
    const root = document.querySelector('.work');
    const sliderEl = root && root.querySelector('.ba-slider');
    const thumbsEl = root && root.querySelector('[data-work-thumbs]');
    const marqueeTrack = root && root.querySelector('[data-marquee-track]');
    if (!sliderEl || !thumbsEl) return;

    let pairs = [];
    try {
      const res = await fetch('assets/before-after/pairs.json', { cache: 'no-cache' });
      pairs = await res.json();
    } catch (e) {
      console.warn('[work] failed to load pairs.json', e);
      return;
    }
    if (!pairs.length) return;

    const slider = new BeforeAfterSlider(sliderEl);
    let activeIndex = 0;
    let autoTimer = null;
    let userInteracted = false;

    const setActive = (i, fromUser) => {
      activeIndex = (i + pairs.length) % pairs.length;
      const p = pairs[activeIndex];
      slider.setImages(p);
      [...thumbsEl.querySelectorAll('.work__thumb')].forEach((el, idx) => {
        el.setAttribute('aria-current', String(idx === activeIndex));
      });
      if (fromUser) {
        userInteracted = true;
        clearInterval(autoTimer);
      }
    };

    // Build thumbs
    pairs.forEach((p, i) => {
      const li = document.createElement('li');
      const btn = document.createElement('button');
      btn.className = 'work__thumb';
      btn.type = 'button';
      btn.innerHTML = '<span class="work__thumb-dot" aria-hidden="true"></span>' + p.label;
      btn.addEventListener('click', () => setActive(i, true));
      li.appendChild(btn);
      thumbsEl.appendChild(li);
    });

    // Build marquee (each pair duplicated for seamless loop)
    if (marqueeTrack) {
      const html = pairs.concat(pairs).map((p) => (
        '<div class="marquee__pair">' +
          '<img src="' + p.before + '" alt="" loading="lazy" />' +
          '<img src="' + p.after  + '" alt="" loading="lazy" />' +
        '</div>'
      )).join('');
      marqueeTrack.innerHTML = html;
    }

    // Pointer drag on the slider counts as "user interacted" - stop auto-advance
    sliderEl.addEventListener('pointerdown', () => {
      userInteracted = true;
      clearInterval(autoTimer);
    });

    setActive(0, false);
    autoTimer = setInterval(() => {
      if (!userInteracted) setActive(activeIndex + 1, false);
    }, 8000);
  }
};

class BeforeAfterSlider {
  constructor(root) {
    this.root = root;
    this.afterEl = root.querySelector('[data-after]');
    this.handleEl = root.querySelector('[data-handle]');
    this.value = 50; // 0..100, percentage from left where the divider sits
    this._onMove = this._onMove.bind(this);
    this._onUp = this._onUp.bind(this);
    this._bind();
    this._set(this.value);
  }

  _bind() {
    const start = (e) => {
      e.preventDefault();
      this.dragging = true;
      this.root.classList.add('is-dragging');
      window.addEventListener('pointermove', this._onMove);
      window.addEventListener('pointerup', this._onUp);
      this._onMove(e);
    };
    this.handleEl.addEventListener('pointerdown', start);
    this.root.addEventListener('pointerdown', start);
    // Keyboard
    this.root.tabIndex = 0;
    this.root.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft')  { this._set(this.value - 5); e.preventDefault(); }
      if (e.key === 'ArrowRight') { this._set(this.value + 5); e.preventDefault(); }
      if (e.key === 'Home')       { this._set(0);   e.preventDefault(); }
      if (e.key === 'End')        { this._set(100); e.preventDefault(); }
    });
  }

  _onMove(e) {
    if (!this.dragging) return;
    const rect = this.root.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = (x / rect.width) * 100;
    this._set(pct);
  }

  _onUp() {
    this.dragging = false;
    this.root.classList.remove('is-dragging');
    window.removeEventListener('pointermove', this._onMove);
    window.removeEventListener('pointerup', this._onUp);
  }

  _set(pct) {
    pct = Math.max(0, Math.min(100, pct));
    this.value = pct;
    this.afterEl.style.clipPath = `inset(0 0 0 ${pct}%)`;
    this.handleEl.style.left = `${pct}%`;
    this.root.setAttribute('aria-valuenow', String(Math.round(pct)));
  }

  setImages({ before, after, label }) {
    this.root.querySelector('[data-before-img]').src = before;
    this.root.querySelector('[data-after-img]').src = after;
    if (label) this.root.setAttribute('aria-label', `${label}, before and after`);
  }
}

window.BeforeAfterSlider = BeforeAfterSlider;

document.addEventListener('DOMContentLoaded', () => GB.init());

// Galletta Bros entrypoint
// Each section module registers via init functions called at the bottom.
const GB = {
  init() {
    if (window.gsap && window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
    } else {
      // GSAP failed to load - show all [data-anim] elements so the page isn't blank.
      document.querySelectorAll('[data-anim]').forEach((el) => { el.style.opacity = '1'; });
    }
    GB.detectHeroVideo();
    GB.initWork();
    GB.initReviews();
    GB.initAnimations();
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

    // Hardcoded baseline pair so the section never goes blank if pairs.json fails to load.
    const FALLBACK_PAIRS = [{
      slug: 'garage',
      label: 'Garage clearout',
      before: 'assets/before-after/garage/before.jpg',
      after: 'assets/before-after/garage/after.jpg'
    }];
    let pairs = [];
    try {
      const res = await fetch('assets/before-after/pairs.json', { cache: 'no-cache' });
      if (res.ok) pairs = await res.json();
    } catch (e) {
      console.warn('[work] failed to load pairs.json, using fallback', e);
    }
    if (!Array.isArray(pairs) || !pairs.length) pairs = FALLBACK_PAIRS;

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
  },

  initReviews() {
    const root = document.querySelector('[data-reviews]');
    if (!root) return;
    const items = [...root.querySelectorAll('.review')];
    if (!items.length) return;
    const prevBtn = root.querySelector('[data-prev]');
    const nextBtn = root.querySelector('[data-next]');
    let i = items.findIndex((el) => el.hasAttribute('data-active'));
    if (i < 0) i = 0;
    let timer = null;

    const show = (next) => {
      items[i].removeAttribute('data-active');
      i = (next + items.length) % items.length;
      items[i].setAttribute('data-active', '');
    };

    const restart = () => {
      clearInterval(timer);
      timer = setInterval(() => show(i + 1), 6000);
    };

    if (prevBtn) prevBtn.addEventListener('click', () => { show(i - 1); restart(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { show(i + 1); restart(); });

    restart();
  },

  initAnimations() {
    if (!window.gsap) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      // Make sure any [data-anim] starts visible - no entrance, but no missing content.
      document.querySelectorAll('[data-anim]').forEach((el) => { el.style.opacity = '1'; });
      return;
    }

    // Generic fade-up for every [data-anim] element.
    gsap.utils.toArray('[data-anim]').forEach((el) => {
      gsap.fromTo(el,
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    // Hero parallax: media nudges down as the hero scrolls out.
    if (document.querySelector('.hero__media')) {
      gsap.to('.hero__media', {
        yPercent: 10,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });
    }

    // Service-area pin drop: each pin enters from above on scroll-in.
    const pins = gsap.utils.toArray('.areas__pin');
    if (pins.length) {
      gsap.from(pins, {
        y: -24,
        opacity: 0,
        duration: 0.55,
        ease: 'expo.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: '.areas',
          start: 'top 70%',
          toggleActions: 'play none none none'
        }
      });
    }
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

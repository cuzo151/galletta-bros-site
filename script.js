document.addEventListener('DOMContentLoaded', () => {
  const containers = document.querySelectorAll('.before-after');
  
  containers.forEach(container => {
    const afterImg = container.querySelector('.after');
    const divider = container.querySelector('.divider');
    let isDragging = false;
    let containerRect;
    let animationFrameId;

    function updateSlider(clientX) {
      if (!containerRect) containerRect = container.getBoundingClientRect();
      const offsetX = clientX - containerRect.left;
      let percent = (offsetX / containerRect.width) * 100;
      percent = Math.max(0, Math.min(100, percent));
      
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(() => {
        afterImg.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
        divider.style.left = `${percent}%`;
      });
    }

    // Mouse handling
    container.addEventListener('mousedown', (e) => {
      isDragging = true;
      containerRect = container.getBoundingClientRect();
      updateSlider(e.clientX);
    });
    
    window.addEventListener('mouseup', () => { isDragging = false; });
    window.addEventListener('mousemove', (e) => {
      if (isDragging) updateSlider(e.clientX);
    });

    // Touch handling for mobile
    container.addEventListener('touchstart', (e) => {
      isDragging = true;
      containerRect = container.getBoundingClientRect();
      if (e.touches && e.touches.length > 0) {
        updateSlider(e.touches[0].clientX);
      }
    }, {passive: false});
    
    window.addEventListener('touchend', () => { isDragging = false; });
    window.addEventListener('touchmove', (e) => {
      if (isDragging && e.touches && e.touches.length > 0) {
        // e.preventDefault(); // Uncomment if page scrolls during drag natively
        updateSlider(e.touches[0].clientX);
      }
    }, {passive: false});

    // Initialize – show 50% after
    afterImg.style.clipPath = `inset(0 50% 0 0)`;
    divider.style.left = `50%`;
  });
});

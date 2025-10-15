(function () {
  function lockOverlay(el) {
    if (!el) return;
    // compute current on-screen position
    const r = el.getBoundingClientRect();
    // ensure direct child of body to avoid transformed ancestors
    if (el.parentElement !== document.body) document.body.appendChild(el);
    el.style.position = 'fixed';
    el.style.left = r.left + 'px';
    el.style.top = r.top + 'px';
    el.style.transform = 'none';
    el.style.margin = '0';
    el.style.transition = 'none';
    el.style.willChange = 'auto';
    // keep it above page content
    el.style.zIndex = getComputedStyle(document.documentElement).getPropertyValue('--z-bubble') || '12100';
  }

  function lockAll() {
    const p = document.querySelector('.profile');
    const s = document.querySelector('.speech-bubble');
    // lock after a short timeout so images/fonts/layout have settled
    setTimeout(() => {
      lockOverlay(p);
      lockOverlay(s);
    }, 50);
  }

  window.addEventListener('load', lockAll);
  window.addEventListener('resize', lockAll);
})();

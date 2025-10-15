// Clean cursor + ripple + softened, slowing brlp-brlp audio
(function () {
  const body = document.body;
  const cursor = document.querySelector('.cursor');
  const follower = document.querySelector('.cursor-follower');
  const bubble = document.querySelector('.speech-bubble');

  if (!cursor || !follower) return;

  // Cursor state
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let posX = mouseX;
  let posY = mouseY;
  const ease = 0.18;

  // Audio (lazy-initialized)
  const AudioCtor = window.AudioContext || window.webkitAudioContext || null;
  let audioCtx = null;
  function ensureAudio() {
    if (!AudioCtor) return null;
    if (!audioCtx) audioCtx = new AudioCtor();
    return audioCtx;
  }

  const interactiveSelector = 'a, button, input, textarea, select, [role="button"]';
  let isHoveringInteractive = false;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    const el = document.elementFromPoint(e.clientX, e.clientY);
    const matches = el && el.closest ? el.closest(interactiveSelector) : null;
    const should = !!matches;
    if (should !== isHoveringInteractive) {
      isHoveringInteractive = should;
      body.classList.toggle('interactive-hover', should);
    }
  });

  function animate() {
    posX += (mouseX - posX) * ease;
    posY += (mouseY - posY) * ease;
    cursor.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    follower.style.transform = `translate(${posX}px, ${posY}px) translate(-50%, -50%)`;
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);

  window.addEventListener('mousedown', (e) => ripple(e.clientX, e.clientY));

  function ripple(x, y) {
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', '0 0 32 30');
    svg.style.position = 'fixed';
    svg.style.left = x + 'px';
    svg.style.top = y + 'px';
    svg.style.width = '18px';
    svg.style.height = '18px';
    svg.style.transform = 'translate(-50%, -50%)';
    svg.style.pointerEvents = 'none';
    svg.style.zIndex = 9998;
    svg.style.transition = 'width 420ms ease, height 420ms ease, opacity 420ms ease, transform 420ms ease, filter 420ms ease';

    const path = document.createElementNS(ns, 'path');
    path.setAttribute('fill', 'rgba(255,105,180,0.28)');
    path.setAttribute('d', 'M23.6 0c-2.9 0-5.2 1.9-6.6 3.6C15.6 1.9 13.3 0 10.4 0 4.6 0 0 4.7 0 10.5c0 8.3 9.8 14.5 16 19.1 6.2-4.6 16-10.8 16-19.1C32 4.7 27.4 0 21.6 0z');
    svg.appendChild(path);
    document.body.appendChild(svg);

    requestAnimationFrame(() => {
      svg.style.width = '140px';
      svg.style.height = '140px';
      svg.style.opacity = '0';
      svg.style.transform = 'translate(-50%, -50%) scale(1.1)';
      svg.style.filter = 'blur(6px)';
    });

    setTimeout(() => svg.remove(), 520);
  }

  window.addEventListener('mouseleave', () => { cursor.style.opacity = 0; follower.style.opacity = 0; });
  window.addEventListener('mouseenter', () => { cursor.style.opacity = 1; follower.style.opacity = 1; });

  // Play a simple, short 'click' tone
  function playClick() {
    const ctx = ensureAudio();
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, t);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(0.12, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
    osc.connect(g); g.connect(ctx.destination);
    osc.start(t); osc.stop(t + 0.12);
  }

  function triggerClick() {
    if (bubble) bubble.classList.add('clicked');
    playClick();
    if (bubble) setTimeout(() => bubble.classList.remove('clicked'), 120);
  }

  if (bubble) {
    bubble.addEventListener('click', triggerClick);
    bubble.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') { e.preventDefault(); triggerClick(); }
    });
  }

  // Delegate: when any .link-box is clicked, play the same normal click sound
  document.addEventListener('click', function (e) {
    var el = e.target;
    if (!el) return;
    if (el.classList && el.classList.contains('link-box')) {
      playClick();
    }
  }, true);

})();

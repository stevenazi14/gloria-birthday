const canvas = document.querySelector('#confetti');
const ctx = canvas.getContext('2d');
const wishButton = document.querySelector('#wish-button');
const wishResponse = document.querySelector('#wish-response');
let particles = [];
let frame = 0;

function fitCanvas() {
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(window.innerWidth * pixelRatio);
  canvas.height = Math.floor(window.innerHeight * pixelRatio);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
}

function celebrate() {
  const colors = ['#e8c987', '#efa8b5', '#c7b2ef', '#a9d2b4', '#fff0d1'];
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight * .45;
  particles = Array.from({ length: 145 }, () => ({
    x: centerX + (Math.random() - .5) * 120,
    y: centerY + (Math.random() - .5) * 50,
    vx: (Math.random() - .5) * 11,
    vy: -Math.random() * 10 - 2,
    gravity: .16 + Math.random() * .1,
    size: 3 + Math.random() * 5,
    spin: Math.random() * Math.PI,
    spinSpeed: (Math.random() - .5) * .22,
    color: colors[Math.floor(Math.random() * colors.length)],
    shape: Math.random() > .35 ? 'rect' : 'circle'
  }));
  cancelAnimationFrame(frame);
  drawParticles();
}

function drawParticles() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  particles = particles.filter(p => p.y < window.innerHeight + 24);
  for (const p of particles) {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += p.gravity;
    p.vx *= .994;
    p.spin += p.spinSpeed;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.spin);
    ctx.fillStyle = p.color;
    if (p.shape === 'circle') {
      ctx.beginPath();
      ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * .68);
    }
    ctx.restore();
  }
  if (particles.length) frame = requestAnimationFrame(drawParticles);
}

fitCanvas();
window.addEventListener('resize', fitCanvas);
wishButton.addEventListener('click', () => {
  const isFirstWish = !wishButton.classList.contains('blown');
  wishButton.classList.add('blown');
  wishResponse.textContent = isFirstWish
    ? 'Candles out! May your wish come true, Gloria ✨'
    : 'Sending your wish a little extra birthday magic ✨';
  wishResponse.classList.add('visible');
  celebrate();
});

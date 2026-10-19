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

const musicButton = document.querySelector('#music-button');
const notes = [523.25, 659.25, 783.99, 659.25, 587.33, 783.99];
let audioContext;
let musicTimer;

function playChime() {
  if (!audioContext || audioContext.state !== 'running') return;
  const start = audioContext.currentTime;
  notes.forEach((frequency, index) => {
    const oscillator = audioContext.createOscillator();
    const volume = audioContext.createGain();
    const noteStart = start + index * .36;
    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    volume.gain.setValueAtTime(.0001, noteStart);
    volume.gain.exponentialRampToValueAtTime(.035, noteStart + .04);
    volume.gain.exponentialRampToValueAtTime(.0001, noteStart + .54);
    oscillator.connect(volume);
    volume.connect(audioContext.destination);
    oscillator.start(noteStart);
    oscillator.stop(noteStart + .56);
  });
}

musicButton.addEventListener('click', async () => {
  if (musicTimer) {
    window.clearInterval(musicTimer);
    musicTimer = undefined;
    musicButton.setAttribute('aria-pressed', 'false');
    musicButton.setAttribute('aria-label', 'Play soft birthday music');
    musicButton.querySelector('.music-label').textContent = 'A little music';
    await audioContext.close();
    audioContext = undefined;
    return;
  }
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) {
    musicButton.querySelector('.music-label').textContent = 'Audio unavailable';
    return;
  }
  audioContext = new AudioContextClass();
  await audioContext.resume();
  const playPhrase = () => {
    if (audioContext.state !== 'running') return;
    playChime();
  };
  playPhrase();
  musicTimer = window.setInterval(playPhrase, 3100);
  musicButton.setAttribute('aria-pressed', 'true');
  musicButton.setAttribute('aria-label', 'Stop soft birthday music');
  musicButton.querySelector('.music-label').textContent = 'Music on · tap to stop';
});

const birthdayNotes = [
  'You make ordinary days feel like a celebration.',
  'Keep taking up space and shining exactly as you are.',
  'The world is more fun with you in it, Gloria.',
  'Your laugh, your style, your whole you — all worth celebrating.',
  'Whatever this year brings, your number one is cheering for you.'
];
const noteButton = document.querySelector('#note-button');
const secretNote = document.querySelector('#secret-note');
noteButton.addEventListener('click', () => {
  const nextIndex = Math.floor(Math.random() * birthdayNotes.length);
  secretNote.textContent = birthdayNotes[nextIndex];
  secretNote.classList.remove('note-pop');
  void secretNote.offsetWidth;
  secretNote.classList.add('note-pop');
});

const shareButton = document.querySelector('#share-button');
const shareStatus = document.querySelector('#share-status');
shareButton.addEventListener('click', async () => {
  const shareData = {
    title: 'A little birthday magic for Gloria',
    text: 'Happy birthday, Gloria Kaveza! A little something from your number one, the champion Steve Azi.',
    url: window.location.href
  };
  try {
    if (navigator.share) {
      await navigator.share(shareData);
      shareStatus.textContent = 'Thanks for sharing the birthday magic!';
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href);
      shareStatus.textContent = 'Link copied — send the birthday magic along!';
    } else {
      shareStatus.textContent = window.location.href;
    }
  } catch (error) {
    if (error.name !== 'AbortError') shareStatus.textContent = 'Copy the page link from your browser to share it.';
  }
});

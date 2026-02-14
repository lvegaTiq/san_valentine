
(() => {
  const canvas = document.getElementById("snow");
  const ctx = canvas.getContext("2d", { alpha: true });

  const DPR = Math.min(window.devicePixelRatio || 1, 2);
  let w, h, flakes = [];
  const FLAKE_COUNT = 220;

  function resize() {
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.floor(w * DPR);
    canvas.height = Math.floor(h * DPR);
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    // Re-seed (opcional)
    if (!flakes.length) init();
  }

  function rand(min, max){ return Math.random() * (max - min) + min; }

  function makeFlake(spawnTop = false){
    return {
      x: rand(0, w),
      y: spawnTop ? rand(-h, 0) : rand(0, h),
      r: rand(1, 4.2),          // tamaño
      vy: rand(0.6, 2.2),       // velocidad vertical
      vx: rand(-0.5, 0.5),      // viento base
      sway: rand(0.6, 2.0),     // oscilación lateral
      phase: rand(0, Math.PI*2),
      alpha: rand(0.5, 1.0)
    };
  }

  function init(){
    flakes = Array.from({length: FLAKE_COUNT}, () => makeFlake(false));
  }

  let t = 0;
  function tick(){
    t += 0.01;

    ctx.clearRect(0, 0, w, h);

    // Viento suave global (puedes ajustar)
    const wind = Math.sin(t) * 0.3;

    for (const f of flakes){
      f.phase += 0.01 * f.sway;

      // movimiento
      f.y += f.vy;
      f.x += f.vx + wind + Math.sin(f.phase) * 0.6;

      // dibujar copo (círculo con brillo sutil)
      ctx.beginPath();
      ctx.fillStyle = `rgba(255,255,255,${f.alpha})`;
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fill();

      // respawn abajo
      if (f.y > h + 10){
        Object.assign(f, makeFlake(true));
        f.y = -10;
      }

      // wrap lateral
      if (f.x < -10) f.x = w + 10;
      if (f.x > w + 10) f.x = -10;
    }

    requestAnimationFrame(tick);
  }

  window.addEventListener("resize", resize);
  resize();
  tick();
})();

(() => {
  const container = document.querySelector(".container");
  const title = document.querySelector(".contentT h1");
  const noBtn = document.querySelector(".no-btn");
  const yesBtn = document.querySelector(".si-btn");
  const buttonsBox = document.querySelector(".buttons");

  if (!container || !title || !noBtn || !yesBtn || !buttonsBox) return;

  // Mensajes infinitos (se ciclan)
  const mensajes = [
    "😒 Ey... dime que sí",
    "Ya no me quieres 🥺",
    "Dame una oportinidad si? 😊",
    "Que grosero por no aceptar😒",
    "😏 Ya sabes que quieres decir que sí",
    "🤭 Última vez... ¿sí?"
  ];

  let attempts = 0;

  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  function moveNoButton() {
    attempts++;

    // Mensaje infinito (ciclo)
    title.textContent = mensajes[(attempts - 1) % mensajes.length];

    // Hacer crecer el botón SÍ progresivamente
    const scaleYes = clamp(1 + attempts * 0.10, 1, 10.2); // hasta 2.2x
    yesBtn.style.transform = `scale(${scaleYes})`;

    // NO se mantiene pequeño (sin crecer)
    noBtn.style.transform = `translateX(-50%) scale(0.85)`;

    // mover NO dentro del área .buttons
    const pad = 8;
    const boxRect = buttonsBox.getBoundingClientRect();
    const btnRect = noBtn.getBoundingClientRect();

    const maxX = Math.max(pad, boxRect.width - btnRect.width - pad);
    const maxY = Math.max(pad, boxRect.height - btnRect.height - pad);

    const x = Math.random() * maxX;
    const y = Math.random() * maxY;

    noBtn.style.left = `${x}px`;
    noBtn.style.top = `${y}px`;
  }

  function showFinalScreen() {
    const imgSrc =
      document.body.dataset.finalImg || "./IMG/mi-imagen-final.jpg"; // fallback

    container.innerHTML = `
      <div class="final-screen">
        <div class="heart">❤️</div>
        <h1>¡Muchas gracias! Mañana nos vemos 🥰</h1>
        <img class="final-img" src="${imgSrc}" alt="imagen final">
      </div>
    `;
    launchHearts();
  }

  // Que se mueva con hover y también con click
  noBtn.addEventListener("mouseenter", moveNoButton);
  noBtn.addEventListener("click", moveNoButton);

  yesBtn.addEventListener("click", showFinalScreen);
})();


function launchHearts() {
  const canvas = document.getElementById("confetti-hearts");
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const hearts = [];
  const total = 120;

  function random(min, max) {
    return Math.random() * (max - min) + min;
  }

  for (let i = 0; i < total; i++) {
    hearts.push({
      x: random(0, canvas.width),
      y: random(-canvas.height, 0),
      size: random(15, 30),
      speed: random(1, 3),
      sway: random(-1, 1),
      opacity: random(0.6, 1)
    });
  }

  function drawHeart(x, y, size, opacity) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(size / 20, size / 20);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(0, -10, -20, -10, -20, 5);
    ctx.bezierCurveTo(-20, 20, 0, 25, 0, 35);
    ctx.bezierCurveTo(0, 25, 20, 20, 20, 5);
    ctx.bezierCurveTo(20, -10, 0, -10, 0, 0);
    ctx.fillStyle = `rgba(255,0,100,${opacity})`;
    ctx.fill();
    ctx.restore();
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    hearts.forEach(h => {
      h.y += h.speed;
      h.x += h.sway;

      if (h.y > canvas.height) {
        h.y = -20;
        h.x = random(0, canvas.width);
      }

      drawHeart(h.x, h.y, h.size, h.opacity);
    });

    requestAnimationFrame(animate);
  }

  animate();
}

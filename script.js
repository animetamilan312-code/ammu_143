"use strict";

/* ==================================
   PERSONAL BIRTHDAY MESSAGE
   Nee un message-ah inga direct-ah edit pannalaam.
================================== */

const birthdayMessage = "WRITE YOUR PERSONAL BIRTHDAY MESSAGE HERE";


/* ==================================
   SCENE NAVIGATION
================================== */

const scenes = Array.from(document.querySelectorAll(".scene"));
const progressBar = document.getElementById("progressBar");

function showScene(sceneNumber) {
  const index = sceneNumber - 1;

  if (index < 0 || index >= scenes.length) return;

  scenes.forEach((scene, i) => {
    scene.classList.toggle("active", i === index);
  });

  progressBar.style.width =
    `${((index + 1) / scenes.length) * 100}%`;

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

  if (sceneNumber === 10) {
    launchFireworks(1000);
  }
}

document.querySelectorAll("[data-next]").forEach(button => {
  button.addEventListener("click", () => {
    const nextScene = Number(button.dataset.next);
    showScene(nextScene);
  });
});

document.getElementById("restartButton").addEventListener("click", () => {
  stopFireworks();
  showScene(1);
});

document.getElementById("birthdayMessageDisplay").textContent =
  birthdayMessage;


/* ==================================
   BACKGROUND HEARTS
================================== */

const heartsContainer = document.getElementById("hearts-container");
const heartEmojis = ["💗", "💕", "💖", "💘", "❤️", "💞"];

function createHeart() {
  const heart = document.createElement("span");
  heart.className = "floating-heart-item";
  heart.textContent =
    heartEmojis[Math.floor(Math.random() * heartEmojis.length)];

  heart.style.left = `${Math.random() * 100}%`;
  heart.style.fontSize = `${14 + Math.random() * 20}px`;
  heart.style.animationDuration = `${8 + Math.random() * 9}s`;

  heartsContainer.appendChild(heart);

  heart.addEventListener("animationend", () => heart.remove(), {
    once: true
  });
}

setInterval(createHeart, 900);


/* ==================================
   GLOWING PARTICLES
================================== */

const particlesContainer = document.getElementById("particles");

function createParticle() {
  const particle = document.createElement("span");
  particle.className = "particle";

  particle.style.left = `${Math.random() * 100}%`;
  particle.style.top = `${75 + Math.random() * 35}%`;
  particle.style.animationDuration = `${7 + Math.random() * 8}s`;

  particlesContainer.appendChild(particle);

  particle.addEventListener("animationend", () => particle.remove(), {
    once: true
  });
}

setInterval(createParticle, 250);


/* ==================================
   FALLING ROSE PETALS
================================== */

const petalsContainer = document.getElementById("petals-container");
const petalEmojis = ["🌸", "🌹", "🌷", "💮"];

function createPetal() {
  const petal = document.createElement("span");
  petal.className = "rose-petal";
  petal.textContent =
    petalEmojis[Math.floor(Math.random() * petalEmojis.length)];

  petal.style.left = `${Math.random() * 100}%`;
  petal.style.fontSize = `${12 + Math.random() * 13}px`;
  petal.style.animationDuration = `${8 + Math.random() * 8}s`;

  petalsContainer.appendChild(petal);

  petal.addEventListener("animationend", () => petal.remove(), {
    once: true
  });
}

setInterval(createPetal, 1400);


/* ==================================
   SPARKLES
================================== */

const sparklesContainer = document.getElementById("sparkles-container");

function createSparkle() {
  const sparkle = document.createElement("span");
  sparkle.className = "sparkle";
  sparkle.textContent = "✦";

  sparkle.style.left = `${Math.random() * 100}%`;
  sparkle.style.top = `${Math.random() * 100}%`;
  sparkle.style.color = Math.random() > 0.5 ? "#ffe0f0" : "#f5d49b";
  sparkle.style.fontSize = `${8 + Math.random() * 13}px`;

  sparklesContainer.appendChild(sparkle);

  setTimeout(() => sparkle.remove(), 2500);
}

setInterval(createSparkle, 500);


/* ==================================
   CUTE MOVING CATS
================================== */

const catsContainer = document.getElementById("cats-container");
const catCharacters = ["🐈", "🐈‍⬛", "🐱", "😺", "😸"];

function createMovingCat() {
  const cat = document.createElement("span");
  cat.className = "moving-cat";
  cat.textContent =
    catCharacters[Math.floor(Math.random() * catCharacters.length)];

  cat.style.bottom = `${4 + Math.random() * 20}%`;
  cat.style.animationDuration = `${15 + Math.random() * 10}s`;

  catsContainer.appendChild(cat);

  cat.addEventListener("animationend", () => cat.remove(), {
    once: true
  });
}

for (let i = 0; i < 3; i++) {
  setTimeout(createMovingCat, i * 3500);
}

setInterval(createMovingCat, 9000);


/* ==================================
   MUSIC PLAY / PAUSE
================================== */

const birthdaySong = document.getElementById("birthdaySong");
const musicButton = document.getElementById("musicButton");

musicButton.addEventListener("click", async () => {
  if (birthdaySong.paused) {
    try {
      await birthdaySong.play();
      musicButton.textContent = "♫ Pause Our Song";
    } catch (error) {
      musicButton.textContent = "Tap To Play Song";
      console.error("Music could not be played:", error);
    }
  } else {
    birthdaySong.pause();
    musicButton.textContent = "♫ Play Our Song";
  }
});

birthdaySong.addEventListener("ended", () => {
  musicButton.textContent = "♫ Play Our Song";
});


/* ==================================
   PHOTO VIEWER
================================== */

const photoViewer = document.getElementById("photoViewer");
const expandedPhoto = document.getElementById("expandedPhoto");
const closePhotoViewer = document.getElementById("closePhotoViewer");

document.querySelectorAll(".memory-photo").forEach(photo => {
  photo.addEventListener("click", () => {
    if (!photo.complete || photo.naturalWidth === 0) return;

    expandedPhoto.src = photo.src;
    expandedPhoto.alt = photo.alt;
    photoViewer.classList.add("open");
  });

  photo.addEventListener("error", () => {
    console.warn(`Photo not found: ${photo.getAttribute("src")}`);
  });
});

function closeViewer() {
  photoViewer.classList.remove("open");
  expandedPhoto.src = "";
}

closePhotoViewer.addEventListener("click", closeViewer);

photoViewer.addEventListener("click", event => {
  if (event.target === photoViewer) {
    closeViewer();
  }
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeViewer();
  }
});


/* ==================================
   FIREWORKS
================================== */

const canvas = document.getElementById("fireworksCanvas");
const ctx = canvas.getContext("2d");
const fireworksButton = document.getElementById("fireworksButton");

let fireworks = [];
let animationFrame = null;
let fireworksUntil = 0;

function resizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  canvas.width = Math.floor(window.innerWidth * dpr);
  canvas.height = Math.floor(window.innerHeight * dpr);

  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function createFirework(x, y) {
  const colors = [
    "#ff8ec7",
    "#ffe6a7",
    "#cba7ff",
    "#ffffff",
    "#ffb4d8"
  ];

  const color = colors[Math.floor(Math.random() * colors.length)];
  const count = 45 + Math.floor(Math.random() * 35);

  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count;
    const speed = 1 + Math.random() * 4;

    fireworks.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      alpha: 1,
      decay: 0.008 + Math.random() * 0.012,
      color,
      size: 1 + Math.random() * 2.2
    });
  }
}

function animateFireworks() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  fireworks = fireworks.filter(particle => particle.alpha > 0.02);

  fireworks.forEach(particle => {
    particle.x += particle.vx;
    particle.y += particle.vy;

    particle.vx *= 0.99;
    particle.vy *= 0.99;
    particle.vy += 0.025;
    particle.alpha -= particle.decay;

    ctx.globalAlpha = Math.max(0, particle.alpha);
    ctx.fillStyle = particle.color;
    ctx.beginPath();
    ctx.arc(
      particle.x,
      particle.y,
      particle.size,
      0,
      Math.PI * 2
    );
    ctx.fill();
  });

  ctx.globalAlpha = 1;

  if (Date.now() < fireworksUntil) {
    if (Math.random() < 0.08) {
      createFirework(
        60 + Math.random() * (window.innerWidth - 120),
        70 + Math.random() * (window.innerHeight * 0.45)
      );
    }
  }

  if (Date.now() < fireworksUntil || fireworks.length > 0) {
    animationFrame = requestAnimationFrame(animateFireworks);
  } else {
    animationFrame = null;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  }
}

function launchFireworks(duration = 5000) {
  fireworksUntil = Math.max(fireworksUntil, Date.now() + duration);

  createFirework(
    window.innerWidth * 0.35,
    window.innerHeight * 0.3
  );

  createFirework(
    window.innerWidth * 0.7,
    window.innerHeight * 0.25
  );

  if (!animationFrame) {
    animationFrame = requestAnimationFrame(animateFireworks);
  }
}

function stopFireworks() {
  fireworksUntil = 0;
  fireworks = [];

  if (animationFrame) {
    cancelAnimationFrame(animationFrame);
    animationFrame = null;
  }

  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
}

fireworksButton.addEventListener("click", () => {
  launchFireworks(6000);
});


/* ==================================
   FIRST LOAD
================================== */

showScene(1);

"use strict";

/* =========================================================
   PERSONAL MESSAGE
   Un birthday message-ai indha quotes-kulla paste pannalaam.
   Example: const birthdayMessage = "Your own message here";
========================================================= */

const birthdayMessage = "WRITE YOUR PERSONAL BIRTHDAY MESSAGE HERE";

/* =========================================================
   HELPERS
========================================================= */

const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) =>
  Array.from(parent.querySelectorAll(selector));

const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

const scenes = $$(".scene");
const progressBar = $("#progressBar");
const heartsContainer = $("#hearts-container");
const petalsContainer = $("#petals-container");
const sparklesContainer = $("#sparkles-container");

let currentScene = 1;
let previousFocusedElement = null;
let lastDecorationTime = 0;

/* =========================================================
   SCENE NAVIGATION
========================================================= */

function showScene(sceneNumber) {
  const index = Number(sceneNumber) - 1;

  if (!Number.isInteger(index) || index < 0 || index >= scenes.length) {
    return;
  }

  currentScene = index + 1;

  scenes.forEach((scene, sceneIndex) => {
    scene.classList.toggle("active", sceneIndex === index);
    scene.setAttribute(
      "aria-hidden",
      sceneIndex === index ? "false" : "true"
    );
  });

  if (progressBar) {
    progressBar.style.width =
      `${((index + 1) / scenes.length) * 100}%`;
  }

  if (birthdayMessageDisplay) {
    birthdayMessageDisplay.textContent = birthdayMessage;
  }

  window.scrollTo({
    top: 0,
    behavior: reducedMotion ? "auto" : "smooth"
  });

  if (index === 9) {
    launchFireworks(1600);
  } else {
    stopFireworks();
  }

  // Ask the browser to load photos in the current scene.
  scenes[index].querySelectorAll("img[loading='lazy']").forEach((img) => {
    img.loading = "eager";
  });
}

$$("[data-next]").forEach((button) => {
  button.addEventListener("click", () => {
    const nextScene = Number(button.dataset.next);
    showScene(nextScene);
  });
});

const restartButton = $("#restartButton");

if (restartButton) {
  restartButton.addEventListener("click", () => {
    closePhotoViewer();
    showScene(1);
  });
}

const birthdayMessageDisplay = $("#birthdayMessageDisplay");

if (birthdayMessageDisplay) {
  birthdayMessageDisplay.textContent = birthdayMessage;
}

/* =========================================================
   FLOATING DECORATIONS
========================================================= */

function addFloatingItem(container, className, symbol, options = {}) {
  if (!container || reducedMotion) return;

  const item = document.createElement("span");
  item.className = className;
  item.textContent = symbol;
  item.setAttribute("aria-hidden", "true");

  item.style.left = `${Math.random() * 96}%`;

  if (options.top) {
    item.style.top = `${Math.random() * 90}%`;
  }

  const duration = options.duration || 8;
  item.style.animationDuration = `${duration}s`;
  item.style.fontSize = `${options.size || 18}px`;

  if (options.delay) {
    item.style.animationDelay = `${options.delay}s`;
  }

  container.appendChild(item);

  window.setTimeout(() => item.remove(), (duration + 1) * 1000);
}

function createHeart() {
  addFloatingItem(
    heartsContainer,
    "floating-heart",
    Math.random() > 0.5 ? "♡" : "♥",
    {
      duration: 7 + Math.random() * 5,
      size: 12 + Math.random() * 20
    }
  );
}

function createPetal() {
  const petals = ["❀", "✿", "❁", "♡"];

  addFloatingItem(
    petalsContainer,
    "floating-petal",
    petals[Math.floor(Math.random() * petals.length)],
    {
      duration: 8 + Math.random() * 5,
      size: 12 + Math.random() * 13
    }
  );
}

function createSparkle() {
  addFloatingItem(
    sparklesContainer,
    "floating-sparkle",
    Math.random() > 0.5 ? "✦" : "✧",
    {
      top: true,
      duration: 2 + Math.random() * 2,
      size: 10 + Math.random() * 12
    }
  );
}

/* Limit background animation on small screens and hidden tabs. */
const isSmallScreen = window.matchMedia("(max-width: 600px)").matches;

if (!reducedMotion) {
  window.setInterval(() => {
    if (document.hidden) return;
    createHeart();
  }, isSmallScreen ? 1600 : 1000);

  window.setInterval(() => {
    if (document.hidden) return;
    createPetal();
  }, isSmallScreen ? 2500 : 1700);

  window.setInterval(() => {
    if (document.hidden) return;
    createSparkle();
  }, isSmallScreen ? 1200 : 750);
}

/* =========================================================
   MUSIC PLAYER
========================================================= */

const birthdaySong = $("#birthdaySong");
const musicButton = $("#musicButton");
const musicLabel = $("#musicLabel");

let musicIsPlaying = false;

function updateMusicButton(isPlaying) {
  musicIsPlaying = isPlaying;

  if (musicButton) {
    musicButton.classList.toggle("is-playing", isPlaying);
    musicButton.setAttribute("aria-pressed", String(isPlaying));
    musicButton.setAttribute(
      "aria-label",
      isPlaying ? "Pause birthday music" : "Play birthday music"
    );
  }

  if (musicLabel) {
    musicLabel.textContent = isPlaying ? "Pause Music" : "Play Music";
  }
}

if (birthdaySong && musicButton) {
  birthdaySong.addEventListener("play", () => updateMusicButton(true));
  birthdaySong.addEventListener("pause", () => updateMusicButton(false));
  birthdaySong.addEventListener("ended", () => updateMusicButton(false));

  musicButton.addEventListener("click", async () => {
    if (birthdaySong.paused) {
      try {
        await birthdaySong.play();
        updateMusicButton(true);
      } catch (error) {
        updateMusicButton(false);
        console.warn(
          "Music could not start. Check the music file path and format.",
          error
        );
      }
    } else {
      birthdaySong.pause();
      updateMusicButton(false);
    }
  });

  birthdaySong.addEventListener("error", () => {
    updateMusicButton(false);
    console.warn("Music file not found. Check music/Song.mp3.");
  });
}

/* =========================================================
   PHOTO VIEWER
========================================================= */

const photoViewer = $("#photoViewer");
const expandedPhoto = $("#expandedPhoto");
const closePhotoViewerButton = $("#closePhotoViewer");

function openPhotoViewer(image) {
  if (!photoViewer || !expandedPhoto || !image || !image.src) return;

  previousFocusedElement = document.activeElement;
  expandedPhoto.src = image.currentSrc || image.src;
  expandedPhoto.alt = image.alt || "Expanded memory";

  photoViewer.classList.add("open");
  photoViewer.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  if (closePhotoViewerButton) {
    closePhotoViewerButton.focus();
  }
}

function closePhotoViewer() {
  if (!photoViewer) return;

  photoViewer.classList.remove("open");
  photoViewer.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";

  if (expandedPhoto) {
    expandedPhoto.removeAttribute("src");
  }

  if (
    previousFocusedElement &&
    typeof previousFocusedElement.focus === "function"
  ) {
    previousFocusedElement.focus();
  }
}

$$(".memory-photo").forEach((image) => {
  image.addEventListener("click", () => {
    if (image.complete && image.naturalWidth > 0) {
      openPhotoViewer(image);
    } else {
      console.warn(`Photo is missing or could not load: ${image.src}`);
    }
  });

  image.addEventListener("error", () => {
    console.warn(`Please check this photo path: ${image.getAttribute("src")}`);
  });
});

if (closePhotoViewerButton) {
  closePhotoViewerButton.addEventListener("click", closePhotoViewer);
}

if (photoViewer) {
  photoViewer.addEventListener("click", (event) => {
    if (event.target === photoViewer) {
      closePhotoViewer();
    }
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && photoViewer?.classList.contains("open")) {
    closePhotoViewer();
  }
});

/* =========================================================
   FIREWORKS
========================================================= */

const fireworksCanvas = $("#fireworksCanvas");
const fireworksButton = $("#fireworksButton");

let fireworksContext = null;
let fireworksParticles = [];
let fireworksAnimationFrame = null;
let fireworksStopTimer = null;
let fireworksRunning = false;
let lastFireworkTime = 0;
let canvasWidth = 0;
let canvasHeight = 0;
let pixelRatio = 1;

if (fireworksCanvas) {
  try {
    fireworksContext = fireworksCanvas.getContext("2d");
  } catch (error) {
    console.warn("Canvas effects are unavailable.", error);
  }
}

function resizeFireworksCanvas() {
  if (!fireworksCanvas || !fireworksContext) return;

  pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  canvasWidth = window.innerWidth;
  canvasHeight = window.innerHeight;

  fireworksCanvas.width = Math.round(canvasWidth * pixelRatio);
  fireworksCanvas.height = Math.round(canvasHeight * pixelRatio);

  fireworksCanvas.style.width = `${canvasWidth}px`;
  fireworksCanvas.style.height = `${canvasHeight}px`;

  fireworksContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
}

window.addEventListener("resize", resizeFireworksCanvas);
resizeFireworksCanvas();

function createFirework(x, y) {
  if (!fireworksContext) return;

  const particleCount = 45;
  const hue = Math.floor(Math.random() * 360);

  for (let i = 0; i < particleCount; i++) {
    const angle = (Math.PI * 2 * i) / particleCount;
    const speed = 1.5 + Math.random() * 4;

    fireworksParticles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      alpha: 1,
      decay: 0.012 + Math.random() * 0.014,
      radius: 1.3 + Math.random() * 2,
      hue: (hue + Math.random() * 40) % 360
    });
  }
}

function drawFireworks(timestamp) {
  if (!fireworksContext || !fireworksCanvas) {
    stopFireworks();
    return;
  }

  if (!fireworksRunning) return;

  fireworksContext.clearRect(0, 0, canvasWidth, canvasHeight);

  if (
    timestamp - lastFireworkTime > 350 &&
    fireworksParticles.length < 400
  ) {
    createFirework(
      canvasWidth * (0.15 + Math.random() * 0.7),
      canvasHeight * (0.15 + Math.random() * 0.45)
    );

    lastFireworkTime = timestamp;
  }

  const remainingParticles = [];

  for (const particle of fireworksParticles) {
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.vy += 0.025;
    particle.vx *= 0.992;
    particle.vy *= 0.992;
    particle.alpha -= particle.decay;

    if (particle.alpha <= 0) continue;

    fireworksContext.globalAlpha = particle.alpha;
    fireworksContext.fillStyle = `hsl(${particle.hue} 90% 68%)`;
    fireworksContext.beginPath();
    fireworksContext.arc(
      particle.x,
      particle.y,
      particle.radius,
      0,
      Math.PI * 2
    );
    fireworksContext.fill();

    remainingParticles.push(particle);
  }

  fireworksContext.globalAlpha = 1;
  fireworksParticles = remainingParticles;

  fireworksAnimationFrame = requestAnimationFrame(drawFireworks);
}

function launchFireworks(duration = 3000) {
  if (reducedMotion || !fireworksContext) return;

  stopFireworks();

  fireworksRunning = true;
  fireworksParticles = [];
  lastFireworkTime = 0;

  createFirework(canvasWidth * 0.35, canvasHeight * 0.3);
  createFirework(canvasWidth * 0.65, canvasHeight * 0.25);

  fireworksAnimationFrame = requestAnimationFrame(drawFireworks);

  fireworksStopTimer = window.setTimeout(() => {
    stopFireworks();
  }, Math.max(500, duration));
}

function stopFireworks() {
  fireworksRunning = false;

  if (fireworksAnimationFrame !== null) {
    cancelAnimationFrame(fireworksAnimationFrame);
    fireworksAnimationFrame = null;
  }

  if (fireworksStopTimer !== null) {
    clearTimeout(fireworksStopTimer);
    fireworksStopTimer = null;
  }

  fireworksParticles = [];

  if (fireworksContext && fireworksCanvas) {
    fireworksContext.clearRect(0, 0, canvasWidth, canvasHeight);
  }
}

if (fireworksButton) {
  fireworksButton.addEventListener("click", () => {
    launchFireworks(5000);
  });
}

/* Pause visual effects when the page is hidden. */
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    stopFireworks();
  }
});

/* =========================================================
   INITIALIZE
========================================================= */

showScene(1);

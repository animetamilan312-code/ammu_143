"use strict";

/* =========================================================
PERSONAL SETTINGS
========================================================= */

const birthdayMessage = "WRITE YOUR PERSONAL BIRTHDAY MESSAGE HERE";

// Change this password if you want.
const unlockPassword = "AMMU";

/* =========================================================
HELPERS
========================================================= */

const $ = (selector, parent = document) =>
parent.querySelector(selector);

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

const birthdayMessageDisplay = $("#birthdayMessageDisplay");

let currentScene = 1;
let previousFocusedElement = null;
let typewriterStarted = false;
let typewriterTimers = [];
let finalSurpriseRevealed = false;

/* =========================================================
PASSWORD GATE
========================================================= */

const siteLock = $("#siteLock");
const unlockForm = $("#unlockForm");
const unlockPasswordInput = $("#unlockPassword");
const lockError = $("#lockError");

function unlockSite() {
if (!siteLock || siteLock.hidden || siteLock.classList.contains("is-closing")) {
return;
}

if (lockError) {
lockError.textContent = "";
}

siteLock.classList.add("is-closing");

const finishUnlock = () => {
siteLock.hidden = true;
siteLock.classList.remove("is-closing");
document.body.style.overflow = "";

showScene(1);  

const firstButton = $('#scene1 [data-next="2"]');  
if (firstButton) firstButton.focus();

};

if (reducedMotion) {
finishUnlock();
} else {
window.setTimeout(finishUnlock, 450);
}
}

if (siteLock && unlockForm && unlockPasswordInput) {
  document.body.style.overflow = "hidden";

  unlockForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const enteredPassword = unlockPasswordInput.value.trim();

    if (
      enteredPassword.toUpperCase() !==
      unlockPassword.toUpperCase()
    ) {
      if (lockError) {
        lockError.textContent =
          "Incorrect password. Try again, Ammu. ♡";
      }

      unlockPasswordInput.value = "";
      unlockPasswordInput.focus();
      return;
    }

    if (lockError) {
      lockError.textContent = "";
    }

    unlockSite();
  });
}

/* =========================================================
TYPEWRITER LOVE LETTER
========================================================= */

function stopTypewriterTimers() {
typewriterTimers.forEach((timer) => clearTimeout(timer));
typewriterTimers = [];
}

function startTypewriter() {
  if (typewriterStarted) return;

  const letterScene = $("#scene9");
  if (!letterScene) return;

  const paragraphs = $$(".typewriter-text", letterScene);
  if (!paragraphs.length) return;

  typewriterStarted = true;

  paragraphs.forEach((paragraph) => {
    if (!paragraph.dataset.fullText) {
      paragraph.dataset.fullText =
        paragraph.textContent.replace(/\s+/g, " ").trim();
    }

    paragraph.textContent = "";
    paragraph.classList.remove("typing", "is-complete");
  });

  if (reducedMotion) {
    paragraphs.forEach((paragraph) => {
      paragraph.textContent = paragraph.dataset.fullText;
      paragraph.classList.add("is-complete");
    });

    return;
  }

  let paragraphIndex = 0;

  function typeParagraph() {
    if (paragraphIndex >= paragraphs.length) return;

    if (!letterScene.classList.contains("active")) {
      paragraphs.forEach((paragraph) => {
        paragraph.textContent = paragraph.dataset.fullText;
        paragraph.classList.remove("typing");
        paragraph.classList.add("is-complete");
      });

      return;
    }

    const paragraph = paragraphs[paragraphIndex];
    const fullText = paragraph.dataset.fullText;

    paragraph.textContent = "";
    paragraph.classList.remove("is-complete");
    paragraph.classList.add("typing");

    let characterIndex = 0;

    function typeNextCharacter() {
      if (!letterScene.classList.contains("active")) {
        paragraph.textContent = fullText;
        paragraph.classList.remove("typing");
        paragraph.classList.add("is-complete");
        return;
      }

      if (characterIndex < fullText.length) {
        paragraph.textContent += fullText.charAt(characterIndex);
        characterIndex++;

        const timer = window.setTimeout(
          typeNextCharacter,
          20
        );

        typewriterTimers.push(timer);
      } else {
        paragraph.classList.remove("typing");
        paragraph.classList.add("is-complete");

        paragraphIndex++;

        if (paragraphIndex < paragraphs.length) {
          const nextParagraphTimer = window.setTimeout(
            typeParagraph,
            350
          );

          typewriterTimers.push(nextParagraphTimer);
        }
      }
    }

    const startDelay = paragraphIndex === 0 ? 450 : 0;

    const startTimer = window.setTimeout(
      typeNextCharacter,
      startDelay
    );

    typewriterTimers.push(startTimer);
  }

  typeParagraph();
}

function resetTypewriter() {
  stopTypewriterTimers();
  typewriterStarted = false;

  $$(".typewriter-text").forEach((paragraph) => {
    paragraph.classList.remove("typing", "is-complete");

    paragraph.textContent =
      paragraph.dataset.fullText || paragraph.textContent;
  });
}

/* Store original letter text before any animation begins. */
$$(".typewriter-text").forEach((paragraph) => {
  paragraph.dataset.fullText =
    paragraph.textContent.replace(/\s+/g, " ").trim();
});

/* =========================================
   SCENE 9 — ENVELOPE AND LETTER CONTROLS
========================================= */

const openLoveLetterButton = $("#openLoveLetter");
const loveEnvelopeWrap = $("#loveEnvelopeWrap");
const loveLetterPaper = $("#loveLetterPaper");
const envelopeHint = $("#envelopeHint");
const letterNextButton = $("#letterNextButton");

let letterOpening = false;
let letterSceneTimers = [];
function clearLetterSceneTimers() {
  letterSceneTimers.forEach((timer) => {
    window.clearTimeout(timer);
  });

  letterSceneTimers = [];
}

function resetLetterScene() {
  clearLetterSceneTimers();

  letterOpening = false;

  if (openLoveLetterButton) {
    openLoveLetterButton.classList.remove("is-open");
    openLoveLetterButton.disabled = false;
    openLoveLetterButton.setAttribute("aria-expanded", "false");
  }

  if (loveEnvelopeWrap) {
    loveEnvelopeWrap.hidden = false;
  }

  if (envelopeHint) {
    envelopeHint.textContent =
      "Tap the heart to open your letter ♡";
  }

  if (loveLetterPaper) {
    loveLetterPaper.hidden = true;
    loveLetterPaper.inert = true;
    loveLetterPaper.setAttribute("aria-hidden", "true");

    loveLetterPaper.classList.remove(
      "is-opening",
      "is-writing"
    );
  }

  if (letterNextButton) {
    letterNextButton.hidden = true;
  }

  resetTypewriter();
}

if (openLoveLetterButton) {
  openLoveLetterButton.addEventListener("click", () => {
    if (letterOpening) return;

    letterOpening = true;

    openLoveLetterButton.classList.add("is-open");
    openLoveLetterButton.setAttribute("aria-expanded", "true");
    openLoveLetterButton.disabled = true;

    if (envelopeHint) {
      envelopeHint.textContent =
        "A little message, just for you... ♡";
    }

    const scheduleLetterTimer = (callback, delay) => {
      const timer = window.setTimeout(() => {
        letterSceneTimers = letterSceneTimers.filter(
          (savedTimer) => savedTimer !== timer
        );

        callback();
      }, delay);

      letterSceneTimers.push(timer);
      return timer;
    };

    scheduleLetterTimer(() => {
      if (
        !loveLetterPaper ||
        !loveEnvelopeWrap ||
        !$("#scene9")?.classList.contains("active")
      ) {
        letterOpening = false;
        return;
      }

      loveEnvelopeWrap.hidden = true;

      loveLetterPaper.hidden = false;
      loveLetterPaper.inert = false;
      loveLetterPaper.setAttribute("aria-hidden", "false");

      loveLetterPaper.classList.remove(
        "is-opening",
        "is-writing"
      );

      void loveLetterPaper.offsetWidth;

      loveLetterPaper.classList.add("is-opening");

      scheduleLetterTimer(() => {
        if (!$("#scene9")?.classList.contains("active")) {
          return;
        }

        loveLetterPaper.classList.add("is-writing");
        startTypewriter();

        const paragraphs = $$(".typewriter-text", loveLetterPaper);

        const totalTypingDuration = paragraphs.reduce(
          (total, paragraph, paragraphIndex) => {
            const fullText =
              paragraph.dataset.fullText || paragraph.textContent;

            return (
              total +
              (paragraphIndex === 0 ? 450 : 350) +
              fullText.length * 20
            );
          },
          0
        );

        scheduleLetterTimer(() => {
          if (
            letterNextButton &&
            $("#scene9")?.classList.contains("active") &&
            !loveLetterPaper.hidden
          ) {
            letterNextButton.hidden = false;
          }
        }, reducedMotion ? 100 : totalTypingDuration + 250);
      }, reducedMotion ? 0 : 650);
    }, reducedMotion ? 0 : 450);
  });
}

/* =========================================================  
   SCENE NAVIGATION  
========================================================= */  
  
function showScene(sceneNumber) {  
  const index = Number(sceneNumber) - 1;  
  
  if (  
    !Number.isInteger(index) ||  
    index < 0 ||  
    index >= scenes.length  
  ) {  
    return;  
  }  
  
  currentScene = index + 1;  
  
  scenes.forEach((scene, sceneIndex) => {  
    const isActive = sceneIndex === index;  
  
    scene.classList.toggle("active", isActive);  
    scene.setAttribute("aria-hidden", String(!isActive));  
  });  
  
  if (progressBar) {  
    progressBar.style.width =  
      `${((index + 1) / scenes.length) * 100}%`;  
  }  
  
  if (birthdayMessageDisplay) {  
    birthdayMessageDisplay.textContent = birthdayMessage;  
  }  
  
if (index === 8) {
  resetLetterScene();
} else {
  clearLetterSceneTimers();
  stopTypewriterTimers();
}
  
  if (index === 0) {  
    resetFinalSurprise();  
    resetCakeWish();  
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
  
  scenes[index].querySelectorAll("img[loading='lazy']").forEach((img) => {  
    img.loading = "eager";  
  });  
}  
  
$$("[data-next]").forEach((button) => {  
  button.addEventListener("click", () => {  
    showScene(Number(button.dataset.next));  
  });  
});  
  
const restartButton = $("#restartButton");  
  
if (restartButton) {  
  restartButton.addEventListener("click", () => {  
    closePhotoViewer();  
    resetFinalSurprise();  
    resetCakeWish();  
   resetLetterScene();
   showScene(1);
  });  
}  
  
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
  
  container.appendChild(item);  
  
  window.setTimeout(() => {  
    item.remove();  
  }, (duration + 1) * 1000);  
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
  
const isSmallScreen = window.matchMedia(  
  "(max-width: 600px)"  
).matches;  
  
if (!reducedMotion) {  
  window.setInterval(() => {  
    if (!document.hidden) createHeart();  
  }, isSmallScreen ? 1600 : 1000);  
  
  window.setInterval(() => {  
    if (!document.hidden) createPetal();  
  }, isSmallScreen ? 2500 : 1700);  
  
  window.setInterval(() => {  
    if (!document.hidden) createSparkle();  
  }, isSmallScreen ? 1200 : 750);  
}  
  
/* =========================================================  
   MUSIC PLAYER + REACTIVE HEART  
========================================================= */  
  
const birthdaySong = $("#birthdaySong");  
const musicButton = $("#musicButton");  
const musicLabel = $("#musicLabel");  
  
function updateMusicButton(isPlaying) {  
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
  birthdaySong.addEventListener("play", () => {  
    updateMusicButton(true);  
  });  
  
  birthdaySong.addEventListener("pause", () => {  
    updateMusicButton(false);  
  });  
  
  birthdaySong.addEventListener("ended", () => {  
    updateMusicButton(false);  
  });  
  
  musicButton.addEventListener("click", async () => {  
    if (birthdaySong.paused) {  
      try {  
        await birthdaySong.play();  
      } catch (error) {  
        updateMusicButton(false);  
  
console.warn(
  "Music could not start. Check AUD-20261018-WA0000.mp3.",
  error
);
      }  
    } else {  
      birthdaySong.pause();  
    }  
  });  
  
  birthdaySong.addEventListener("error", () => {  
    updateMusicButton(false);  
console.warn("Music file not found. Check AUD-20261018-WA0000.mp3.");
  });  
}  
  
/* =========================================================  
   PHOTO VIEWER  
========================================================= */  
  
const photoViewer = $("#photoViewer");  
const expandedPhoto = $("#expandedPhoto");  
const closePhotoViewerButton = $("#closePhotoViewer");  
  
function openPhotoViewer(image) {  
  if (!photoViewer || !expandedPhoto || !image || !image.src) {  
    return;  
  }  
  
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
  
  previousFocusedElement = null;  
}  
  
$$(".memory-photo").forEach((image) => {  
  image.addEventListener("click", () => {  
    if (image.complete && image.naturalWidth > 0) {  
      openPhotoViewer(image);  
    } else {  
      console.warn(  
        `Photo is missing or could not load: ${image.src}`  
      );  
    }  
  });  
  
  image.addEventListener("error", () => {  
    console.warn(  
      `Please check this photo path: ${image.getAttribute("src")}`  
    );  
  });  
});  
  
if (closePhotoViewerButton) {  
  closePhotoViewerButton.addEventListener(  
    "click",  
    closePhotoViewer  
  );  
}  
  
if (photoViewer) {  
  photoViewer.addEventListener("click", (event) => {  
    if (event.target === photoViewer) {  
      closePhotoViewer();  
    }  
  });  
}  
  
document.addEventListener("keydown", (event) => {  
  if (  
    event.key === "Escape" &&  
    photoViewer?.classList.contains("open")  
  ) {  
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
    fireworksContext.fillStyle =  
      `hsl(${particle.hue} 90% 68%)`;  
  
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
  
/* =========================================================  
   CAKE WISH + FINAL SURPRISE  
========================================================= */  
  
const birthdayCakeButton = $("#birthdayCakeButton");  
const cakeWishMessage = $("#cakeWishMessage");  
const finalSurprise = $("#finalSurprise");  
const finalReplayButton = $("#finalReplayButton");  
  
function resetCakeWish() {  
  if (cakeWishMessage) {  
    cakeWishMessage.hidden = true;  
  }  
  
  if (birthdayCakeButton) {  
    birthdayCakeButton.classList.remove("cake-celebration");  
  }  
}  
  
if (birthdayCakeButton) {  
  birthdayCakeButton.addEventListener("click", () => {  
    if (cakeWishMessage) {  
      cakeWishMessage.hidden = false;  
    }  
  
    birthdayCakeButton.classList.remove("cake-celebration");  
  
    // Restart the bounce animation on every click.  
    void birthdayCakeButton.offsetWidth;  
  
    birthdayCakeButton.classList.add("cake-celebration");  
    launchFireworks(3500);  
  });  
}  
  
function revealFinalSurprise() {  
  if (!finalSurprise) {  
    launchFireworks(5000);  
    return;  
  }  
  
  finalSurprise.hidden = false;  
  finalSurpriseRevealed = true;  
  
  launchFireworks(5000);  
  
  finalSurprise.scrollIntoView({  
    behavior: reducedMotion ? "auto" : "smooth",  
    block: "center"  
  });  
}  
  
function resetFinalSurprise() {
  if (finalSurprise) {
    finalSurprise.hidden = true;

    finalSurprise.style.removeProperty("top");
    finalSurprise.style.removeProperty("left");
    finalSurprise.style.removeProperty("width");
    finalSurprise.style.removeProperty("max-width");
    finalSurprise.style.removeProperty("margin");
  }

  const giftButton = $("#giftBoxButton");

  if (giftButton) {
    giftButton.setAttribute("aria-expanded", "false");
  }

  finalSurpriseRevealed = false;
}
  
if (fireworksButton) {  
  fireworksButton.addEventListener("click", () => {  
    revealFinalSurprise();  
  });  
}  
  
if (finalReplayButton) {
  finalReplayButton.addEventListener("click", () => {
    closePhotoViewer();
    resetFinalSurprise();
    resetCakeWish();
    resetLetterScene();
    showScene(1);
  });
}
  
/* =========================================================  
   PAGE VISIBILITY  
========================================================= */  
  
document.addEventListener("visibilitychange", () => {  
  if (document.hidden) {  
    stopFireworks();  
  }  
});  
  
/* =========================================================  
   INITIALIZE  
========================================================= */  
  
showScene(1);  
  
/* =========================================================  
   PROPOSAL YES / NO INTERACTION  
========================================================= */  
  
const proposalCard = $(".proposal-card");  
const proposalActions = $("#proposalActions");  
const proposalYes = $("#proposalYes");  
const proposalNo = $("#proposalNo");  
const proposalSuccess = $("#proposalSuccess");  
  
let proposalNoAttempts = 0;  
let proposalAccepted = false;  
  
function moveProposalNo() {  
  if (  
    !proposalActions ||  
    !proposalNo ||  
    !proposalYes ||  
    proposalAccepted  
  ) {  
    return;  
  }  
  
  const area = proposalActions.getBoundingClientRect();  
  const button = proposalNo.getBoundingClientRect();  
  
  const maxX = Math.max(0, area.width - button.width);  
  const maxY = Math.max(0, area.height - button.height);  
  
  let left = 0;  
  let top = 0;  
  
  // Try different positions without changing button dimensions.  
  const positions = [  
    [0, 0],  
    [maxX, 0],  
    [0, maxY],  
    [maxX, maxY],  
    [maxX / 2, 0],  
    [maxX / 2, maxY],  
    [0, maxY / 2],  
    [maxX, maxY / 2]  
  ];  
  
  if (proposalNoAttempts < positions.length) {  
    [left, top] = positions[proposalNoAttempts];  
  } else {  
    left = Math.random() * maxX;  
    top = Math.random() * maxY;  
  }  
  
  proposalNo.classList.add("is-dodging");  
  proposalNo.style.left = `${left}px`;  
  proposalNo.style.top = `${top}px`;  
  
  proposalNoAttempts++;  
  
const growth = Math.min(1 + proposalNoAttempts * 0.05, 1.35);  
  
  proposalYes.style.setProperty("--yes-scale", growth);  
}  
  
if (proposalNo) {  
  proposalNo.addEventListener("pointerenter", event => {  
    if (event.pointerType === "mouse") {  
      moveProposalNo();  
    }  
  });  
  
  proposalNo.addEventListener("click", event => {  
    event.preventDefault();  
    moveProposalNo();  
  });  
}  
  
if (proposalYes) {  
  proposalYes.addEventListener("click", () => {  
    if (proposalAccepted) return;  
  
    proposalAccepted = true;  
  
    if (proposalSuccess) {  
      proposalSuccess.hidden = false;  
    }  
  
    if (proposalNo) {  
      proposalNo.disabled = true;  
      proposalNo.hidden = true;  
    }  
  
    proposalYes.textContent = "Yes! 💗";  
    proposalYes.style.setProperty("--yes-scale", "1.2");  
  
    // Small heart particles only after Yes is clicked.  
    if (!reducedMotion && proposalCard) {  
      const hearts = ["💗", "♡", "💕", "✨"];  
  
      hearts.forEach((symbol, index) => {  
        const heart = document.createElement("span");  
  
        heart.textContent = symbol;  
        heart.setAttribute("aria-hidden", "true");  
  
        Object.assign(heart.style, {  
          display: "inline-block",  
          margin: "5px",  
          fontSize: "1.4rem",  
          animation: `heartBeat ${0.6 + index * 0.1}s ease-in-out 2`  
        });  
  
        proposalSuccess?.appendChild(heart);  
      });  
    }  
  });  
}  
  
/* =========================================================
   ANIMATED GIFT BOX
========================================================= */

const giftBoxButton = $("#giftBoxButton");

if (giftBoxButton) {
  giftBoxButton.addEventListener("click", () => {
    const isOpen =
      giftBoxButton.getAttribute("aria-expanded") === "true";

    if (isOpen || !finalSurprise) return;

    const giftSection = giftBoxButton.closest(".gift-section");

    if (!giftSection) {
      console.warn(
        "Gift box error: .gift-section element was not found."
      );
      return;
    }

    giftBoxButton.setAttribute("aria-expanded", "true");

    finalSurprise.hidden = false;
    finalSurpriseRevealed = true;

    launchFireworks(5000);
  });
      }

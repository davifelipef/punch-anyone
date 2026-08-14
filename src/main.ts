import "./style.css";

import { Renderer } from "./canvas/renderer";
import {
  initializeFaceDetector,
  type DetectedFace,
} from "./face/face-detector";
import { startGameLoop } from "./game/game-loop";
import { createGameUI } from "./ui/game-ui";
import { setupGameEvents } from "./ui/game-events";

// ============================================================
// APLICAÇÃO
// ============================================================

const app =
  document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error(
    "Elemento #app não encontrado"
  );
}

// ============================================================
// INTERFACE
// ============================================================

const ui = createGameUI(app);

// ============================================================
// RENDERER
// ============================================================

const renderer =
  new Renderer(ui.canvas);

// ============================================================
// FOTO DO JOGADOR
// ============================================================

let currentImage:
  HTMLImageElement | null = null;

// ============================================================
// DETECÇÃO FACIAL
// ============================================================

let detectedFace:
  DetectedFace | null = null;

let faceDetectorReady = false;

// ============================================================
// INICIALIZAÇÃO DO DETECTOR FACIAL
// ============================================================

initializeFaceDetector()
  .then(() => {
    faceDetectorReady = true;

    console.log(
      "Detector facial pronto."
    );
  })
  .catch((error) => {
    console.error(
      "Erro ao inicializar detector facial:",
      error
    );
  });

// ============================================================
// ASSET DO PUNHO
// ============================================================

const punchImage =
  new Image();

let punchImageLoaded = false;

punchImage.onload = () => {
  punchImageLoaded = true;
};

punchImage.src =
  "/assets/punches/right-punch.png";

// ============================================================
// GAME LOOP
// ============================================================

startGameLoop({
  renderer,
  canvas: ui.canvas,
  getCurrentImage: () =>
    currentImage,
  punchImage,
  isPunchImageLoaded: () =>
    punchImageLoaded,
});

// ============================================================
// EVENTOS DO JOGO
// ============================================================

setupGameEvents({
  ui,
  renderer,
  getCurrentImage: () =>
    currentImage,
  setCurrentImage: (image) => {
    currentImage = image;
  },
  getDetectedFace: () =>
    detectedFace,
  setDetectedFace: (face) => {
    detectedFace = face;
  },
  isFaceDetectorReady: () =>
    faceDetectorReady,
});
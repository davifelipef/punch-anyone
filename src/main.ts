import "./style.css";

import { Renderer } from "./canvas/renderer";
import { FaceController } from "./controllers/face-controller";
import { startGameLoop } from "./game/game-loop";
import { createGameUI } from "./ui/game-ui";
import { setupGameEvents } from "./ui/game-events";
import { AssetController } from "./controllers/asset-controller";

// ============================================================
// APLICAÇÃO
// ============================================================

const app = document.querySelector<HTMLDivElement>("#app");

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

const renderer = new Renderer(ui.canvas);

// ============================================================
// FOTO DO JOGADOR
// ============================================================

let currentImage: HTMLImageElement | null = null;

// ============================================================
// DETECÇÃO FACIAL
// ============================================================

const faceController = new FaceController();

faceController.initialize();

// ============================================================
// ASSET DO PUNHO
// ============================================================

const assetController = new AssetController();

assetController.load();

// ============================================================
// GAME LOOP
// ============================================================

startGameLoop({
  renderer,
  canvas: ui.canvas,
  getCurrentImage: () => currentImage,
  punchImage:
    assetController.getPunchImage(),
  isPunchImageLoaded: () =>
    assetController.isPunchImageLoaded(),
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
  faceController,
});
import "./style.css";

import { Renderer } from "./canvas/renderer";
import { AssetController } from "./controllers/asset-controller";
import { FaceController } from "./controllers/face-controller";
import { GameController } from "./controllers/game-controller";
import { startGameLoop } from "./game/game-loop";
import { createGameUI } from "./ui/game-ui";

// ============================================================
// APLICAÇÃO
// ============================================================

const app =
  document.querySelector<HTMLDivElement>(
    "#app"
  );

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
// FACE CONTROLLER
// ============================================================

const faceController =
  new FaceController();

faceController.initialize();

// ============================================================
// ASSET CONTROLLER
// ============================================================

const assetController =
  new AssetController();

assetController.load();

// ============================================================
// GAME CONTROLLER
// ============================================================

const gameController =
  new GameController(
    ui,
    renderer,
    faceController
  );

gameController.start();

// ============================================================
// GAME LOOP
// ============================================================

startGameLoop({
  renderer,
  canvas: ui.canvas,
  getCurrentImage: () =>
    gameController.getCurrentImage(),
  punchImage:
    assetController.getPunchImage(),
  isPunchImageLoaded: () =>
    assetController.isPunchImageLoaded(),
});
import { Renderer } from "../canvas/renderer";
import { AssetController } from "./asset-controller";
import { FaceController } from "./face-controller";
import { GameController } from "./game-controller";
import { GameLoopController } from "./game-loop-controller";
import { createGameUI } from "../ui/game-ui";

export class ApplicationController {
  private readonly app: HTMLDivElement;

  constructor(app: HTMLDivElement) {
    this.app = app;
  }

  start(): void {
    const ui =
      createGameUI(this.app);

    const renderer =
      new Renderer(ui.canvas);

    const faceController =
      new FaceController();

    faceController.initialize();

    const assetController =
      new AssetController();

    assetController.load();

    const gameController =
      new GameController(
        ui,
        renderer,
        faceController
      );

    gameController.start();

    const gameLoopController =
      new GameLoopController({
        renderer,
        canvas: ui.canvas,
        getCurrentImage: () =>
          gameController.getCurrentImage(),
        punchImage:
          assetController.getPunchImage(),
        isPunchImageLoaded: () =>
          assetController.isPunchImageLoaded(),
      });

    gameLoopController.start();
  }
}
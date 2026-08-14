import { Renderer } from "../canvas/renderer";
import { FaceController } from "./face-controller";
import type { GameUI } from "../ui/game-ui";
import { setupGameEvents } from "../ui/game-events";

export class GameController {
  private readonly ui: GameUI;
  private readonly renderer: Renderer;
  private readonly faceController: FaceController;

  private currentImage:
    HTMLImageElement | null = null;

  constructor(
    ui: GameUI,
    renderer: Renderer,
    faceController: FaceController
  ) {
    this.ui = ui;
    this.renderer = renderer;
    this.faceController = faceController;
  }

  start(): void {
    setupGameEvents({
      ui: this.ui,
      renderer: this.renderer,
      getCurrentImage: () =>
        this.currentImage,
      setCurrentImage: (image) => {
        this.currentImage = image;
      },
      faceController:
        this.faceController,
    });
  }

  getCurrentImage():
    HTMLImageElement | null {
    return this.currentImage;
  }
}
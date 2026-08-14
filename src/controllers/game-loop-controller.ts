import { Renderer } from "../canvas/renderer";
import { startGameLoop } from "../game/game-loop";

export interface GameLoopControllerOptions {
  renderer: Renderer;
  canvas: HTMLCanvasElement;
  getCurrentImage: () => HTMLImageElement | null;
  punchImage: HTMLImageElement;
  isPunchImageLoaded: () => boolean;
}

export class GameLoopController {
  private readonly renderer: Renderer;
  private readonly canvas: HTMLCanvasElement;
  private readonly getCurrentImage: () => HTMLImageElement | null;
  private readonly punchImage: HTMLImageElement;
  private readonly isPunchImageLoaded: () => boolean;

  constructor(
    options: GameLoopControllerOptions
  ) {
    this.renderer = options.renderer;
    this.canvas = options.canvas;
    this.getCurrentImage =
      options.getCurrentImage;
    this.punchImage = options.punchImage;
    this.isPunchImageLoaded =
      options.isPunchImageLoaded;
  }

  start(): void {
    startGameLoop({
      renderer: this.renderer,
      canvas: this.canvas,
      getCurrentImage:
        this.getCurrentImage,
      punchImage: this.punchImage,
      isPunchImageLoaded:
        this.isPunchImageLoaded,
    });
  }
}
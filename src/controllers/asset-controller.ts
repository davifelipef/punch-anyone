export class AssetController {
  private punchImage: HTMLImageElement;

  private punchImageLoaded = false;

  constructor() {
    this.punchImage = new Image();
  }

  load() {
    this.loadPunchImage();
  }

  private loadPunchImage() {
    this.punchImage.onload = () => {
      this.punchImageLoaded = true;
    };

    this.punchImage.onerror = () => {
      console.error(
        "Erro ao carregar o asset do punho."
      );
    };

    this.punchImage.src =
      `${import.meta.env.BASE_URL}assets/punches/right-punch.png`;
  }

  getPunchImage(): HTMLImageElement {
    return this.punchImage;
  }

  isPunchImageLoaded(): boolean {
    return this.punchImageLoaded;
  }
}
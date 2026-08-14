import {
  initializeFaceDetector,
  detectFace,
  type DetectedFace,
} from "../face/face-detector";

export class FaceController {
  private ready = false;

  private detectedFace: DetectedFace | null =
    null;

  async initialize(): Promise<void> {
    try {
      await initializeFaceDetector();

      this.ready = true;

      console.log(
        "Detector facial pronto."
      );
    } catch (error) {
      console.error(
        "Erro ao inicializar detector facial:",
        error
      );
    }
  }

  isReady(): boolean {
    return this.ready;
  }

  detect(
    image: HTMLImageElement
  ): DetectedFace | null {
    if (!this.ready) {
      return null;
    }

    this.detectedFace =
      detectFace(image);

    return this.detectedFace;
  }

  getDetectedFace(): DetectedFace | null {
    return this.detectedFace;
  }

  clear(): void {
    this.detectedFace = null;
  }
}
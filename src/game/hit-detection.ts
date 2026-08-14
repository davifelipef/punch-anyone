import { Renderer } from "../canvas/renderer";
import type { DetectedFace } from "../face/face-detector";

export function isHit(
  renderer: Renderer,
  image: HTMLImageElement | null,
  face: DetectedFace | null,
  x: number,
  y: number
): boolean {
  if (!image || !face) {
    return false;
  }

  // ==========================================================
  // CONVERTE O CANTO SUPERIOR ESQUERDO DO ROSTO
  // DA IMAGEM ORIGINAL PARA O CANVAS
  // ==========================================================

  const topLeft =
    renderer.getImageCoordinates(
      image,
      face.x,
      face.y
    );

  // ==========================================================
  // CONVERTE O CANTO INFERIOR DIREITO
  // ==========================================================

  const bottomRight =
    renderer.getImageCoordinates(
      image,
      face.x + face.width,
      face.y + face.height
    );

  // ==========================================================
  // VERIFICA SE O CLIQUE ESTÁ DENTRO DA FACE
  // ==========================================================

  return (
    x >= topLeft.x &&
    x <= bottomRight.x &&
    y >= topLeft.y &&
    y <= bottomRight.y
  );
}
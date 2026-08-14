import { addPunch, state } from "../game/state";
import { isHit } from "../game/hit-detection";
import {
  detectFace,
  type DetectedFace,
} from "../face/face-detector";
import { Renderer } from "../canvas/renderer";
import type { GameUI } from "./game-ui";


interface GameEventsOptions {
  ui: GameUI;
  renderer: Renderer;
  getCurrentImage: () => HTMLImageElement | null;
  setCurrentImage: (
    image: HTMLImageElement | null
  ) => void;
  getDetectedFace: () => DetectedFace | null;
  setDetectedFace: (
    face: DetectedFace | null
  ) => void;
  isFaceDetectorReady: () => boolean;
}

export function setupGameEvents({
  ui,
  renderer,
  getCurrentImage,
  setCurrentImage,
  getDetectedFace,
  setDetectedFace,
  isFaceDetectorReady,
}: GameEventsOptions) {
  const {
    canvas,
    uploadLabel,
    fileInput,
    clearButton,
  } = ui;

  // ==========================================================
  // UPLOAD DA FOTO
  // ==========================================================

  fileInput.addEventListener(
    "change",
    () => {
      const file =
        fileInput.files?.[0];

      if (!file) {
        return;
      }

      const image = new Image();

      image.onload = () => {
        setCurrentImage(image);

        // ------------------------------------------------------
        // DETECTA O ROSTO NA IMAGEM ORIGINAL
        // ------------------------------------------------------

        if (isFaceDetectorReady()) {
          const detectedFace =
            detectFace(image);

          setDetectedFace(
            detectedFace
          );

          if (detectedFace) {
            console.log(
              "Rosto detectado:",
              detectedFace
            );
          } else {
            console.log(
              "Nenhum rosto detectado."
            );
          }
        }

        renderer.drawImage(image);

        uploadLabel.classList.add(
          "hidden"
        );

        clearButton.classList.remove(
          "hidden"
        );
      };

      image.src =
        URL.createObjectURL(file);
    }
  );

  // ==========================================================
  // LIMPAR FOTO
  // ==========================================================

  clearButton.addEventListener(
    "click",
    () => {
      setCurrentImage(null);
      setDetectedFace(null);

      renderer.clear();

      uploadLabel.classList.remove(
        "hidden"
      );

      clearButton.classList.add(
        "hidden"
      );

      fileInput.value = "";
    }
  );

  // ==========================================================
  // CLIQUE — APLICA UM SOCO
  // ==========================================================

  canvas.addEventListener(
    "click",
    (event) => {
      // Só permite um soco por vez.
      // Enquanto o punho estiver em animação,
      // novos cliques são ignorados.
      if (state.punches.length > 0) {
        return;
      }

      const rect =
        canvas.getBoundingClientRect();

      // Converte as coordenadas do clique
      // da tela para as coordenadas internas
      // do Canvas.
      const x =
        (event.clientX - rect.left) *
        (canvas.width / rect.width);

      const y =
        (event.clientY - rect.top) *
        (canvas.height / rect.height);

      const hit = isHit(
        renderer,
        getCurrentImage(),
        getDetectedFace(),
        x,
        y
      );

      // Registra o soco no estado do jogo.
      addPunch(
        x,
        y,
        10,
        hit
      );

      console.log(
        hit
          ? "HIT 👊"
          : "MISS 💨",
        {
          x,
          y,
        }
      );
    }
  );
}
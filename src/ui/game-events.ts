import { addPunch, state } from "../game/state";
import { isHit } from "../game/hit-detection";
import { Renderer } from "../canvas/renderer";
import type { GameUI } from "./game-ui";
import { FaceController } from "../controllers/face-controller";

interface GameEventsOptions {
  ui: GameUI;
  renderer: Renderer;
  getCurrentImage: () => HTMLImageElement | null;
  setCurrentImage: (
    image: HTMLImageElement | null
  ) => void;
  faceController: FaceController;
}

export function setupGameEvents({
  ui,
  renderer,
  getCurrentImage,
  setCurrentImage,
  faceController,
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
        // DETECTA O ROSTO
        // ------------------------------------------------------

        const detectedFace =
          faceController.detect(image);

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

      faceController.clear();

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

      const x =
        (event.clientX - rect.left) *
        (canvas.width / rect.width);

      const y =
        (event.clientY - rect.top) *
        (canvas.height / rect.height);

      const hit = isHit(
        renderer,
        getCurrentImage(),
        faceController.getDetectedFace(),
        x,
        y
      );

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
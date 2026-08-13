import "./style.css";
import { Renderer } from "./canvas/renderer";
import { addPunch, state } from "./game/state";
import { addImpact, impacts } from "./game/effects";

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("Elemento #app não encontrado");
}

const title = document.createElement("h1");
title.textContent = "Punch Anyone";

const canvasContainer = document.createElement("div");
canvasContainer.className = "canvas-container";

const canvas = document.createElement("canvas");

const size = Math.min(
  window.innerWidth * 0.9,
  window.innerHeight * 0.7,
  600
);

canvas.width = size;
canvas.height = size;

const uploadLabel = document.createElement("label");
uploadLabel.className = "upload-button";
uploadLabel.textContent = "📷 Escolher foto";

const fileInput = document.createElement("input");
fileInput.type = "file";
fileInput.accept = "image/*";

uploadLabel.appendChild(fileInput);

const clearButton = document.createElement("button");
clearButton.className = "clear-button";
clearButton.textContent = "🗑 Limpar foto";
clearButton.classList.add("hidden");

canvasContainer.append(canvas, uploadLabel);

app.append(
  title,
  canvasContainer,
  clearButton
);

const renderer = new Renderer(canvas);

let currentImage: HTMLImageElement | null = null;

const punchImage = new Image();

let punchImageLoaded = false;

punchImage.onload = () => {
  punchImageLoaded = true;
};

punchImage.src = "/assets/punches/right-punch.png";

const punchApproachDuration = 300;
const punchImpactDuration = 60;
const punchRetreatDuration = 290;

const punchTotalDuration =
  punchApproachDuration +
  punchImpactDuration +
  punchRetreatDuration;

function gameLoop() {
  renderer.clear();

  if (currentImage) {
    renderer.drawImage(currentImage);
  }

  const now = Date.now();

  for (const impact of impacts) {
    const elapsed = now - impact.createdAt;
    const duration = 300;

    const progress = Math.min(elapsed / duration, 1);

    renderer.drawImpact(
      impact.x,
      impact.y,
      progress
    );
  }

  if (punchImageLoaded) {
    const now = Date.now();

    for (const punch of state.punches) {
      const elapsed = now - punch.createdAt;

      if (elapsed >= punchTotalDuration) {
        continue;
      }

      const approachEnd = punchApproachDuration;
      const impactEnd =
        approachEnd + punchImpactDuration;

      let scale: number;
      let offset: number;

      const flipX = punch.x < canvas.width / 2;
      const direction = flipX ? -1 : 1;

      if (elapsed < approachEnd) {
        const progress =
          elapsed / punchApproachDuration;

        scale = 1.0 - progress * 0.7;
        offset = 220 * (1 - progress);
      } else if (elapsed < impactEnd) {
        scale = 0.3;
        offset = 0;
      } else {
        const progress =
          (elapsed - impactEnd) /
          punchRetreatDuration;

        scale = 0.3 + progress * 0.7;
        offset = 220 * progress;
      }

      renderer.drawPunchImage(
        punchImage,
        punch.x + offset * direction,
        punch.y + offset,
        scale,
        flipX
      );
    }
  }

  for (let i = state.punches.length - 1; i >= 0; i--) {
    const elapsed =
      now - state.punches[i].createdAt;

    if (elapsed >= punchTotalDuration) {
      state.punches.splice(i, 1);
    }
  }

  for (let i = impacts.length - 1; i >= 0; i--) {
    const elapsed = now - impacts[i].createdAt;

    if (elapsed >= 300) {
      impacts.splice(i, 1);
    }
  }

  requestAnimationFrame(gameLoop);
}

gameLoop();

fileInput.addEventListener("change", () => {
  const file = fileInput.files?.[0];

  if (!file) {
    return;
  }

  const image = new Image();

  image.onload = () => {
    currentImage = image;

    renderer.drawImage(image);

    uploadLabel.classList.add("hidden");
    clearButton.classList.remove("hidden");
  };

    image.src = URL.createObjectURL(file);
  });

clearButton.addEventListener("click", () => {
  renderer.clear();

  uploadLabel.classList.remove("hidden");
  clearButton.classList.add("hidden");

  fileInput.value = "";
});

canvas.addEventListener("click", (event) => {
  const rect = canvas.getBoundingClientRect();

  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  addPunch(x, y, 10);

  addImpact(x, y);

  console.log("Soco:", {
    x,
    y,
  });
});
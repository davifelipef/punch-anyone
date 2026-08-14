import "./style.css";
import { Renderer } from "./canvas/renderer";
import { addPunch, state } from "./game/state";
import {
  initializeFaceDetector,
  detectFace,
  type DetectedFace,
} from "./face/face-detector";
import { startGameLoop } from "./game/game-loop";

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("Elemento #app não encontrado");
}

// ============================================================
// INTERFACE
// ============================================================

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

// ------------------------------------------------------------
// Upload da foto
// ------------------------------------------------------------

const uploadLabel = document.createElement("label");
uploadLabel.className = "upload-button";
uploadLabel.textContent = "📷 Escolher foto";

const fileInput = document.createElement("input");
fileInput.type = "file";
fileInput.accept = "image/*";

uploadLabel.appendChild(fileInput);

// ------------------------------------------------------------
// Botão para limpar a foto
// ------------------------------------------------------------

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

// ============================================================
// RENDERER
// ============================================================

const renderer = new Renderer(canvas);

// ============================================================
// FOTO DO JOGADOR
// ============================================================

let currentImage: HTMLImageElement | null = null;

// ============================================================
// DETECÇÃO FACIAL
// ============================================================

let detectedFace: DetectedFace | null = null;

let faceDetectorReady = false;

// ============================================================
// INICIALIZAÇÃO DO DETECTOR FACIAL
// ============================================================

initializeFaceDetector()
  .then(() => {
    faceDetectorReady = true;

    console.log("Detector facial pronto.");
  })
  .catch((error) => {
    console.error(
      "Erro ao inicializar detector facial:",
      error
    );
  });

// ============================================================
// ASSET DO PUNHO
// ============================================================

const punchImage = new Image();

let punchImageLoaded = false;

punchImage.onload = () => {
  punchImageLoaded = true;
};

punchImage.src = "/assets/punches/right-punch.png";

startGameLoop({
  renderer,
  canvas,
  getCurrentImage: () => currentImage,
  punchImage,
  isPunchImageLoaded: () => punchImageLoaded,
});

// ============================================================
// VERIFICA SE O CLIQUE ATINGIU O ROSTO
// ============================================================

function isHit(
  x: number,
  y: number
): boolean {
  if (!currentImage || !detectedFace) {
    return false;
  }

  const face = detectedFace;

  // ----------------------------------------------------------
  // Converte o canto superior esquerdo do rosto
  // da imagem original para o Canvas.
  // ----------------------------------------------------------

  const topLeft =
    renderer.getImageCoordinates(
      currentImage,
      face.x,
      face.y
    );

  // ----------------------------------------------------------
  // Converte também o canto inferior direito.
  // ----------------------------------------------------------

  const bottomRight =
    renderer.getImageCoordinates(
      currentImage,
      face.x + face.width,
      face.y + face.height
    );

  // ----------------------------------------------------------
  // Verifica se o clique está dentro da bounding box
  // da face já convertida para as coordenadas do Canvas.
  // ----------------------------------------------------------

  return (
    x >= topLeft.x &&
    x <= bottomRight.x &&
    y >= topLeft.y &&
    y <= bottomRight.y
  );
}

// ============================================================
// UPLOAD DA FOTO
// ============================================================

fileInput.addEventListener("change", () => {
  const file = fileInput.files?.[0];

  if (!file) {
    return;
  }

  const image = new Image();

  image.onload = () => {
    currentImage = image;

    // ----------------------------------------------------------
    // Detecta o rosto na imagem original
    // ----------------------------------------------------------

    if (faceDetectorReady) {
      detectedFace = detectFace(image);

      if (detectedFace) {
        console.log("Rosto detectado:", detectedFace);
      } else {
        console.log("Nenhum rosto detectado.");
      }
    }

    renderer.drawImage(image);

    uploadLabel.classList.add("hidden");
    clearButton.classList.remove("hidden");
  };

  image.src = URL.createObjectURL(file);
});

// ============================================================
// LIMPAR FOTO
// ============================================================

clearButton.addEventListener("click", () => {
  currentImage = null;

  renderer.clear();

  uploadLabel.classList.remove("hidden");
  clearButton.classList.add("hidden");

  fileInput.value = "";
});

// ============================================================
// CLIQUE — APLICA UM SOCO
// ============================================================

canvas.addEventListener("click", (event) => {

  // Só permite um soco por vez.
  // Enquanto o punho estiver em animação, novos cliques são ignorados.
  if (state.punches.length > 0) {
    return;
  }
  
  const rect =
    canvas.getBoundingClientRect();

  // Converte as coordenadas do clique
  // da tela para as coordenadas internas do Canvas.
  const x =
    (event.clientX - rect.left) *
    (canvas.width / rect.width);

  const y =
    (event.clientY - rect.top) *
    (canvas.height / rect.height);

  const hit = isHit(x, y);

  // Registra o soco no estado do jogo.
  addPunch(x, y, 10, hit);

  console.log(
    hit ? "HIT 👊" : "MISS 💨",
    {
      x,
      y,
    }
  );
});
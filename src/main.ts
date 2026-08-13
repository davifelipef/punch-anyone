import "./style.css";
import { Renderer } from "./canvas/renderer";
import { addPunch, state } from "./game/state";
import { addImpact, impacts } from "./game/effects";

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
// ASSET DO PUNHO
// ============================================================

const punchImage = new Image();

let punchImageLoaded = false;

punchImage.onload = () => {
  punchImageLoaded = true;
};

punchImage.src = "/assets/punches/right-punch.png";

// ============================================================
// TIMING DO SOCO
// ============================================================

// O punho atravessa a tela rapidamente até o alvo.
const punchApproachDuration = 30;

// Pequena pausa para marcar o contato.
const punchImpactDuration = 50;

// O braço recua rapidamente depois do impacto.
const punchRetreatDuration = 220;

// Duração total do soco.
const punchTotalDuration =
  punchApproachDuration +
  punchImpactDuration +
  punchRetreatDuration;

// ============================================================
// EASING
// ============================================================

// Começa rápido e desacelera ao chegar no alvo.
// Usado na aproximação.
function easeOutCubic(progress: number) {
  return 1 - Math.pow(1 - progress, 3);
}

// Começa devagar e acelera ao sair do alvo.
// Usado no recuo.
function easeInCubic(progress: number) {
  return progress * progress * progress;
}

// ============================================================
// GAME LOOP
// ============================================================

function gameLoop() {
  renderer.clear();

  // ----------------------------------------------------------
  // Desenha a foto
  // ----------------------------------------------------------

  if (currentImage) {
    renderer.drawImage(currentImage);
  }

  const now = Date.now();

  // ==========================================================
  // EFEITOS DE IMPACTO
  // ==========================================================

  for (const impact of impacts) {
    const elapsed = now - impact.createdAt;
    const duration = 300;

    const progress = Math.min(
      elapsed / duration,
      1
    );

    renderer.drawImpact(
      impact.x,
      impact.y,
      progress
    );
  }

  // ==========================================================
  // ANIMAÇÃO DOS SOCOS
  // ==========================================================

  if (punchImageLoaded) {
    for (const punch of state.punches) {
      const elapsed =
        now - punch.createdAt;

      // O soco terminou sua animação.
      if (elapsed >= punchTotalDuration) {
        continue;
      }

      // --------------------------------------------------------
      // Limites das fases da animação
      // --------------------------------------------------------

      const approachEnd =
        punchApproachDuration;

      const impactEnd =
        approachEnd +
        punchImpactDuration;

      // ========================================================
      // CRIA O IMPACTO EXATAMENTE QUANDO O PUNHO ATINGE O ALVO
      // ========================================================
      if (
        elapsed >= approachEnd &&
        !punch.impactCreated
      ) {
        addImpact(
          punch.x,
          punch.y
        );

        // Intensidade do cachoalhar do impacto
        renderer.shake(10);

        punch.impactCreated = true;
      }

      // --------------------------------------------------------
      // Variáveis calculadas durante a animação
      // --------------------------------------------------------

      let scale: number;
      let offset: number;

      // --------------------------------------------------------
      // Determina o lado do golpe
      // --------------------------------------------------------

      const flipX =
        punch.x < canvas.width / 2;

      const direction =
        flipX ? -1 : 1;

      // ========================================================
      // FASE 1 — APROXIMAÇÃO
      // ========================================================

      if (elapsed < approachEnd) {
        const progress =
          elapsed /
          punchApproachDuration;

        const easedProgress =
          easeOutCubic(progress);

        // O punho começa grande e diminui
        // conforme se aproxima do alvo.
        scale =
          1.0 -
          easedProgress * 0.7;

        // O punho começa afastado e chega ao alvo.
        offset =
          220 *
          (1 - easedProgress);

      // ========================================================
      // FASE 2 — IMPACTO
      // ========================================================

      } else if (elapsed < impactEnd) {
        scale = 0.3;
        offset = 0;

      // ========================================================
      // FASE 3 — RECUO
      // ========================================================

      } else {
        const progress =
          (elapsed - impactEnd) /
          punchRetreatDuration;

        const easedProgress =
          easeInCubic(progress);

        // O punho começa pequeno e aumenta
        // enquanto se afasta do alvo.
        scale =
          0.3 +
          easedProgress * 0.7;

        // Retorna para a posição de onde veio.
        offset =
          220 *
          easedProgress;
      }

      // --------------------------------------------------------
      // Desenha o punho
      // --------------------------------------------------------

      renderer.drawPunchImage(
        punchImage,
        punch.x +
          offset * direction,
        punch.y +
          offset,
        scale,
        flipX
      );
    }
  }

  // ==========================================================
  // REMOVE SOCOS TERMINADOS
  // ==========================================================

  for (
    let i = state.punches.length - 1;
    i >= 0;
    i--
  ) {
    const elapsed =
      now -
      state.punches[i].createdAt;

    if (elapsed >= punchTotalDuration) {
      state.punches.splice(i, 1);
    }
  }

  // ==========================================================
  // REMOVE IMPACTOS TERMINADOS
  // ==========================================================

  for (
    let i = impacts.length - 1;
    i >= 0;
    i--
  ) {
    const elapsed =
      now -
      impacts[i].createdAt;

    if (elapsed >= 300) {
      impacts.splice(i, 1);
    }
  }

  requestAnimationFrame(gameLoop);
}

gameLoop();

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
  const rect =
    canvas.getBoundingClientRect();

  const x =
    event.clientX -
    rect.left;

  const y =
    event.clientY -
    rect.top;

  // Registra o soco no estado do jogo.
  addPunch(x, y, 10);

  console.log("Soco:", {
    x,
    y,
  });
});
import { Renderer } from "../canvas/renderer";
import { addImpact, impacts } from "./effects";
import { state } from "./state";

interface GameLoopOptions {
  renderer: Renderer;
  canvas: HTMLCanvasElement;
  getCurrentImage: () => HTMLImageElement | null;
  punchImage: HTMLImageElement;
  isPunchImageLoaded: () => boolean;
}

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

// Começa rápido e desacelera ao chegar ao alvo.
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

export function startGameLoop({
  renderer,
  canvas,
  getCurrentImage,
  punchImage,
  isPunchImageLoaded,
}: GameLoopOptions) {

  function gameLoop() {
    renderer.clear();

    // ----------------------------------------------------------
    // Desenha a foto
    // ----------------------------------------------------------

    const currentImage = getCurrentImage();

    if (currentImage) {
      renderer.drawImage(currentImage);
    }

    const now = Date.now();

    // ==========================================================
    // EFEITOS DE IMPACTO
    // ==========================================================

    for (const impact of impacts) {
      const elapsed =
        now - impact.createdAt;

      const duration = 300;

      const progress =
        Math.min(
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

    if (isPunchImageLoaded()) {
      for (const punch of state.punches) {
        const elapsed =
          now - punch.createdAt;

        // O soco terminou sua animação.
        if (
          elapsed >= punchTotalDuration
        ) {
          continue;
        }

        // ------------------------------------------------------
        // Limites das fases da animação
        // ------------------------------------------------------

        const approachEnd =
          punchApproachDuration;

        const impactEnd =
          approachEnd +
          punchImpactDuration;

        // ======================================================
        // MOMENTO DO CONTATO
        // ======================================================

        if (
          elapsed >= approachEnd &&
          !punch.impactCreated
        ) {
          // O impacto visual e o shake só acontecem
          // quando o soco realmente acertou o rosto.
          if (punch.hit) {
            addImpact(
              punch.x,
              punch.y
            );

            // Intensidade do chacoalhar do impacto.
            renderer.shake(10);
          }

          // Marca que o momento do contato já aconteceu,
          // seja HIT ou MISS.
          punch.impactCreated = true;
        }

        // ------------------------------------------------------
        // Variáveis calculadas durante a animação
        // ------------------------------------------------------

        let scale: number;
        let offset: number;

        // ------------------------------------------------------
        // Determina o lado do golpe
        // ------------------------------------------------------

        const flipX =
          punch.x <
          canvas.width / 2;

        const direction =
          flipX ? -1 : 1;

        // ======================================================
        // FASE 1 — APROXIMAÇÃO
        // ======================================================

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

        // ======================================================
        // FASE 2 — IMPACTO
        // ======================================================

        } else if (
          elapsed < impactEnd
        ) {
          scale = 0.3;
          offset = 0;

        // ======================================================
        // FASE 3 — RECUO
        // ======================================================

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

        // ------------------------------------------------------
        // Desenha o punho
        // ------------------------------------------------------

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

      if (
        elapsed >= punchTotalDuration
      ) {
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
}
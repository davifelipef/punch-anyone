export interface GameUI {
  canvas: HTMLCanvasElement;
  uploadLabel: HTMLLabelElement;
  fileInput: HTMLInputElement;
  clearButton: HTMLButtonElement;
}

export function createGameUI(
  app: HTMLDivElement
): GameUI {
  // ==========================================================
  // TÍTULO
  // ==========================================================

  const title =
    document.createElement("h1");

  title.textContent =
    "Punch Anyone";

  // ==========================================================
  // CONTAINER DO CANVAS
  // ==========================================================

  const canvasContainer =
    document.createElement("div");

  canvasContainer.className =
    "canvas-container";

  // ==========================================================
  // CANVAS
  // ==========================================================

  const canvas =
    document.createElement("canvas");

  // Resolução lógica do jogo.
  // O tamanho visual é controlado pelo CSS.
  canvas.width = 600;
  canvas.height = 600;

  // ==========================================================
  // UPLOAD DA FOTO
  // ==========================================================

  const uploadLabel =
    document.createElement("label");

  uploadLabel.className =
    "upload-button";

  uploadLabel.textContent =
    "📷 Escolher foto";

  const fileInput =
    document.createElement("input");

  fileInput.type = "file";
  fileInput.accept = "image/*";

  uploadLabel.appendChild(
    fileInput
  );

  // ==========================================================
  // BOTÃO PARA LIMPAR A FOTO
  // ==========================================================

  const clearButton =
    document.createElement("button");

  clearButton.className =
    "clear-button";

  clearButton.textContent =
    "🗑 Limpar foto";

  clearButton.classList.add(
    "hidden"
  );

  // ==========================================================
  // MONTA A INTERFACE
  // ==========================================================

  canvasContainer.append(
    canvas,
    uploadLabel
  );

  app.append(
    title,
    canvasContainer,
    clearButton
  );

  return {
    canvas,
    uploadLabel,
    fileInput,
    clearButton,
  };
}
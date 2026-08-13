export class Renderer {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;

  // ==========================================================
  // SCREEN SHAKE
  // ==========================================================

  private shakeAmount = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;

    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("Não foi possível criar o contexto do Canvas");
    }

    this.context = context;
  }

  // ==========================================================
  // LIMPA O CANVAS
  // ==========================================================

  clear() {
    this.context.setTransform(1, 0, 0, 1, 0, 0);

    this.context.clearRect(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );

    // Aplica um novo deslocamento aleatório
    // para o próximo frame.
    if (this.shakeAmount > 0) {
      const offsetX =
        (Math.random() - 0.5) *
        this.shakeAmount;

      const offsetY =
        (Math.random() - 0.5) *
        this.shakeAmount;

      this.context.translate(
        offsetX,
        offsetY
      );

      // Reduz o shake progressivamente.
      this.shakeAmount *= 0.75;

      if (this.shakeAmount < 0.1) {
        this.shakeAmount = 0;
      }
    }
  }

  // ==========================================================
  // ATIVA O SCREEN SHAKE
  // ==========================================================

  shake(amount: number) {
    this.shakeAmount = Math.max(
      this.shakeAmount,
      amount
    );
  }

  // ==========================================================
  // DESENHA A FOTO
  // ==========================================================

  drawImage(image: HTMLImageElement) {
    const canvasRatio =
      this.canvas.width /
      this.canvas.height;

    const imageRatio =
      image.naturalWidth /
      image.naturalHeight;

    let width = this.canvas.width;
    let height = this.canvas.height;

    let x = 0;
    let y = 0;

    if (imageRatio > canvasRatio) {
      // Imagem mais larga que o canvas:
      // mantém altura e corta as laterais
      height = this.canvas.height;
      width = height * imageRatio;

      x =
        (this.canvas.width - width) /
        2;
    } else {
      // Imagem mais alta que o canvas:
      // mantém largura e corta topo/base
      width = this.canvas.width;
      height = width / imageRatio;

      y =
        (this.canvas.height - height) /
        2;
    }

    this.context.drawImage(
      image,
      x,
      y,
      width,
      height
    );
  }

  // ==========================================================
  // DESENHA O PONTO DO SOCO
  // ==========================================================

  drawPunch(x: number, y: number) {
    this.context.beginPath();

    this.context.arc(
      x,
      y,
      30,
      0,
      Math.PI * 2
    );

    this.context.fillStyle =
      "rgba(255, 0, 0, 0.5)";

    this.context.fill();

    this.context.closePath();
  }

  // ==========================================================
  // DESENHA O PUNHO
  // ==========================================================

  drawPunchImage(
    image: HTMLImageElement,
    x: number,
    y: number,
    scale: number,
    flipX: boolean
  ) {
    this.context.save();

    const width =
      image.naturalWidth * scale;

    const height =
      image.naturalHeight * scale;

    const anchorX =
      212 * scale;

    const anchorY =
      171 * scale;

    this.context.translate(x, y);

    if (flipX) {
      this.context.scale(-1, 1);
    }

    this.context.drawImage(
      image,
      -anchorX,
      -anchorY,
      width,
      height
    );

    this.context.restore();
  }

  // ==========================================================
  // EFEITO DE IMPACTO
  // ==========================================================

  drawImpact(
    x: number,
    y: number,
    progress: number
  ) {
    this.context.save();

    const radius =
      10 + progress * 50;

    const opacity =
      1 - progress;

    this.context.beginPath();

    this.context.arc(
      x,
      y,
      radius,
      0,
      Math.PI * 2
    );

    this.context.strokeStyle =
      `rgba(255, 255, 0, ${opacity})`;

    this.context.lineWidth = 8;

    this.context.stroke();

    this.context.restore();
  }
}
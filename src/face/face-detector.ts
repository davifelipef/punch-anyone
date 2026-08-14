import {
  FaceDetector,
  FilesetResolver,
} from "@mediapipe/tasks-vision";

let detector: FaceDetector | null = null;

export interface DetectedFace {
  x: number;
  y: number;
  width: number;
  height: number;
}

export async function initializeFaceDetector() {
  const vision =
    await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
    );

  detector =
    await FaceDetector.createFromOptions(
      vision,
      {
        baseOptions: {
          modelAssetPath:
            "/models/blaze_face_short_range.tflite",
        },

        runningMode: "IMAGE",

        minDetectionConfidence: 0.5,
      }
    );
}

export function detectFace(
  image: HTMLImageElement
): DetectedFace | null {
  if (!detector) {
    throw new Error(
      "Face detector não foi inicializado"
    );
  }

  const result =
    detector.detect(image);

  const detection =
    result.detections[0];

  if (!detection) {
    return null;
  }

  const boundingBox =
    detection.boundingBox;

  if (!boundingBox) {
    return null;
  }

  return {
    x: boundingBox.originX,
    y: boundingBox.originY,
    width: boundingBox.width,
    height: boundingBox.height,
  };
}
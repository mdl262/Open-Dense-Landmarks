import { FaceDetector, FilesetResolver } from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0";

/**
 * Initializes the BlazeFace face detector for video.
 * @returns {Promise<FaceDetector>} A ready-to-use face detector instance.
 */
export async function initBlazeFace() {
    const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
    );

    const detector = await FaceDetector.createFromOptions(vision, {
        baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite`,
            delegate: "CPU"
        },
        runningMode: "VIDEO"
    });

    return detector;
}

/**
 * Computes a padded square crop box centered around the detected face.
 * @param {Object} detection BlazeFace detection output.
 * @param {number} width Original video width.
 * @param {number} height Original video height.
 * @param {number} scaleFactor Optional padding scale (default: 1.2).
 */
export function getCropBoxFromDetection(detection, width, height, scaleFactor = 1.2) {
    const box = detection.boundingBox;
    const cx = box.originX + box.width / 2;
    const cy = box.originY + box.height / 2;
    const size = Math.max(box.width, box.height) * scaleFactor;
    const x = Math.max(0, cx - size / 2);
    const y = Math.max(0, cy - size / 2);
    const w = Math.min(width - x, size);
    const h = Math.min(height - y, size);
    return { x, y, width: w, height: h };
}

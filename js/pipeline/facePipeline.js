import { runLandmarkModel } from '../models/landmarkModel.js';
import { AppState } from '../../state.js';
import { drawLandmarks } from '../utils/visualization.js';
import { getCropBoxFromDetection } from '../models/blazeface.js';
import { WebGLCropResizer } from "../utils/cropper.js";

const cropper = new WebGLCropResizer(document.getElementById('webcam'));

let smoothedBox = null; // ✅ persist across frames
const alpha = 1;       // smoothing factor

function smoothBox(newBox, prevBox, alpha = 0.3) {
    if (!prevBox) return newBox;

    return {
        x: Math.floor(alpha * newBox.x + (1 - alpha) * prevBox.x),
        y: Math.floor(alpha * newBox.y + (1 - alpha) * prevBox.y),
        width: Math.floor(alpha * newBox.width + (1 - alpha) * prevBox.width),
        height: Math.floor(alpha * newBox.height + (1 - alpha) * prevBox.height)
    };
}

// video, AppState.canvasContext, faceDetector, landmarkModel
export async function processFrame(video, ctx, fd, lm) {
    const detections = await fd.detectForVideo(video, performance.now()).detections;
    const valid = detections.find(d => d.categories[0].score > 0.8);
    if (!valid) return;

    const box = getCropBoxFromDetection(detections[0], video.videoWidth, video.videoHeight);
    smoothedBox = smoothBox(box, smoothedBox, alpha); // ✅ update the persistent value

    const cropImage = await cropper.crop(smoothedBox); // ✅ use the smoothed box
    const landmarksFlat = await runLandmarkModel(cropImage, lm); // [565*2]

    drawLandmarks(ctx, landmarksFlat, smoothedBox);
    AppState.landmarks = new ort.Tensor('float32', landmarksFlat, [565 * 3]);

    if (AppState.fitter != null) {
        await AppState.fitter.step(AppState.landmarks);
    }
}

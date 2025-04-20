import { runLandmarkModel } from '../models/landmarkModel.js';
import { AppState } from '../../state.js';
import { drawLandmarks } from '../utils/visualization.js';
import { getCropBoxFromDetection } from '../models/blazeface.js';
import { WebGLCropResizer } from "../utils/cropper.js";

const cropper = new WebGLCropResizer(document.getElementById('webcam'));

// video, AppState.canvasContext, faceDetector, landmarkModel
export async function processFrame(video, ctx, fd, lm) {
    const detections = await fd.detectForVideo(video, performance.now()).detections;
    const valid = detections.find(d => d.categories[0].score > 0.8);
    if (!valid) return;

    const box = getCropBoxFromDetection(detections[0], video.videoWidth, video.videoHeight);
    const cropImage = await cropper.crop(box);
    const landmarksFlat = await runLandmarkModel(cropImage, lm); // [565*2]
    // landmarks, cropBox, scaleX, scaleY, ctx
    drawLandmarks(ctx, landmarksFlat, box);
    AppState.landmarks ??= new ort.Tensor('float32', landmarksFlat, [565*3])

    if (AppState.fitter != null) {
        await runFitter(AppState.landmarks);
    }
}

export async function runFitter(landmarks) {
    if (!!landmarks) {
        const projected = await AppState.fitter.step(AppState.landmarks);
        return projected;
    }
    return;
}
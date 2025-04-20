console.log("[main.js] ✅ Loaded");

import { loadFLAMEModel } from './js/models/flameLoader.js';
import { initBlazeFace } from './js/models/blazeface.js';
import { initLandmarkModel } from './js/models/landmarkModel.js';
import { createFitter } from './js/models/flameFitter.js';
import { AppState } from './state.js';
import { processFrame, runFitter } from './js/pipeline/facePipeline.js';
import { setupCamera } from './js/utils/visualization.js';

AppState.canvasContext = document.getElementById('overlay').getContext('2d');
await setupCamera();
const video = document.getElementById('webcam');
const faceDetector = await initBlazeFace();
const landmarkModel = await initLandmarkModel();

const fpsDisplay = document.getElementById('fps-display');
let lastTimestamp = performance.now();

// Load FLAME
document.getElementById('flameUpload').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file || !window.landmarkIndices) return;

    try {
        const model = await loadFLAMEModel(file, window.landmarkIndices);
        AppState.flameModel = model;
        AppState.fitter = await createFitter(model);
        console.log("✅ FLAME model and fitter ready");
    } catch (err) {
        console.error(err);
    }
});

async function renderLoop() {
    await processFrame(video, AppState.canvasContext, faceDetector, landmarkModel);
    const now = performance.now();
    const fps = 1000 / (now - lastTimestamp);
    fpsDisplay.textContent = `FPS: ${fps.toFixed(1)}`;
    lastTimestamp = now;
    requestAnimationFrame(renderLoop);
}

renderLoop();
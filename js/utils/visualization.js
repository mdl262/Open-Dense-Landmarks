export function drawLandmarks(ctx, landmarks, cropBox) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = 'cyan';
    const points = new Path2D();
    const numLandmarks = landmarks.length/3
    for (let i = 0; i < numLandmarks; i++) {
        const x = ((landmarks[i] / 2 + 0.5) * cropBox.width + cropBox.x);
        const y = ((landmarks[i + numLandmarks] / 2 + 0.5) * cropBox.height + cropBox.y);
        points.moveTo(x + 1, y);
        points.arc(x, y, 1, 0, 2 * Math.PI);
    }
    ctx.fill(points);
}

export async function setupCamera() {
    const video = document.getElementById('webcam');
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    const canvas = document.getElementById('overlay');
    video.srcObject = stream;
    return new Promise(resolve => {
        video.onloadedmetadata = () => {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            resolve();
        };
    });
}
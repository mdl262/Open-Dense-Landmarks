export function convertLandmarks(landmarks2D) {
    const flat = new Float32Array(565 * 2);
    for (let i = 0; i < 565; i++) {
        flat[i * 2] = landmarks2D[i][0];
        flat[i * 2 + 1] = landmarks2D[i][1];
    }
    return new ort.Tensor('float32', flat, [565, 2]);
}

export function convertBlendShapes(blendshapes3D, expectedDims) {
    const [dim1, dim2, dim3] = expectedDims;
    const flat = new Float32Array(dim1 * dim2 * dim3);

    let idx = 0;
    for (let i = 0; i < dim1; i++) {
        for (let j = 0; j < dim2; j++) {
            for (let k = 0; k < dim3; k++) {
                flat[idx++] = blendshapes3D[i][j][k];
            }
        }
    }

    return new ort.Tensor('float32', flat, expectedDims);
}

export function convert2D(array2D, expectedDims) {
    const [dim1, dim2] = expectedDims;
    const flat = new Float32Array(dim1 * dim2);

    let idx = 0;
    for (let i = 0; i < dim1; i++) {
        for (let j = 0; j < dim2; j++) {
            flat[idx++] = array2D[i][j];
        }
    }

    return new ort.Tensor('float32', flat, expectedDims);
}
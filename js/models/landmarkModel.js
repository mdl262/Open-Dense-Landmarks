export async function initLandmarkModel() {
    const session = await ort.InferenceSession.create(
        '../assets/landmark_models/simplified_model.onnx',
        { 
            executionProviders: ['wasm','cpu'],
            graphOptimizationLevel: "all",
            enableCpuMemArena: true,
            enableMemPattern: true
        }
    );
    console.log("✅ ONNX model loaded");
    return session;
}

export async function runLandmarkModel(tensor, session) {
    const results = await session.run({ input: tensor });
    return results.output.data;
}
export async function initLandmarkModel() {
    const session = await ort.InferenceSession.create(
        '../assets/landmark_models/simplified_model.onnx',
        { 
            executionProviders: ['wasm','cpu'],
            graphOptimizationLevel: "extended",
            enableCpuMemArena: true,
            enableMemPattern: true,
            //executionMode: 'parallel',
            //intraOpNumThreads: 2,
            //enableProfiling: true
        }
    );
    console.log("✅ ONNX model loaded");
    return session;
}

export async function runLandmarkModel(tensor, session) {
    //await session.startProfiling();
    const results = await session.run({ input: tensor });
    //session.endProfiling().then(console.log)
    return results.output.data;
}
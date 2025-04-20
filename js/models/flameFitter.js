export async function createFitter(flameModel) {
    const session = await ort.InferenceSession.create(
        '/assets/other/rmspropfitter_optimized.onnx',
        { executionProviders: ['wasm', 'cpu'] }
    );

    console.log(flameModel)

    const fitter = {
        session,
        lr: 0.1,
        eps: 1e-6,
        currentParams: new ort.Tensor('float32', Float32Array.from({ length: 404 }, (_, i) => (i === 403 ? 154 : 0)), [404]),
        v: new ort.Tensor('float32', new Float32Array(404).fill(0.01), [404]),
        V0: flameModel.V0,
        S: flameModel.S,
        E: flameModel.E,

        async step(landmarksTensor) {
            const input = {
                params: this.currentParams,
                v: this.v,
                landmarks: landmarksTensor,
                V0: this.V0,
                S: this.S,
                E: this.E,
                lr: new ort.Tensor('float32', new Float32Array([this.lr]), [1])
            };
            const out = await this.session.run(input);
            this.currentParams = out.params_out;
            this.v = out.v_out;
            return out.proj_a;
        }
    };

    return fitter;
}

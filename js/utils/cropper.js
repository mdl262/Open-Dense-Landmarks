export class WebGLCropResizer {
    constructor(video, outputSize = 128) {
        this.video = video;
        this.outputSize = outputSize;

        // Create canvas and WebGL2 context
        this.canvas = document.createElement("canvas");
        this.canvas.width = this.canvas.height = outputSize;
        this.gl = this.canvas.getContext("webgl2", { preserveDrawingBuffer: false, willReadFrequently: true });

        this._rgbaBuffer = new Uint8Array(outputSize * outputSize * 4);
        this._tensorBuffer = new Float32Array(3 * outputSize * outputSize);

        if (!this.gl) throw new Error("WebGL2 not supported");

        this._initGL();
    }

    _initGL() {
        const gl = this.gl;

        // Vertex + Fragment shaders
        const vs = `#version 300 es
        in vec2 a_position;
        out vec2 v_texCoord;
        void main() {
            v_texCoord = a_position * 0.5 + 0.5;
            gl_Position = vec4(a_position, 0, 1);
        }`;

        const fs = `#version 300 es
        precision highp float;
        uniform sampler2D u_texture;
        uniform vec4 u_crop;
        in vec2 v_texCoord;
        out vec4 outColor;
        void main() {
            vec2 cropCoord = u_crop.xy + v_texCoord * u_crop.zw;
            vec3 rgb = texture(u_texture, cropCoord).rgb;
            outColor = vec4(rgb, 1.0);
        }`;

        // Compile and link
        const compile = (type, src) => {
            const shader = gl.createShader(type);
            gl.shaderSource(shader, src);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
                throw new Error(gl.getShaderInfoLog(shader));
            return shader;
        };

        const program = gl.createProgram();
        gl.attachShader(program, compile(gl.VERTEX_SHADER, vs));
        gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fs));
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS))
            throw new Error(gl.getProgramInfoLog(program));

        this.program = program;
        this.cropLoc = gl.getUniformLocation(program, "u_crop");

        // Setup VAO for fullscreen quad
        const vao = gl.createVertexArray();
        gl.bindVertexArray(vao);
        const pos = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, pos);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            -1, -1, 1, -1, -1, 1, 1, 1
        ]), gl.STATIC_DRAW);
        const loc = gl.getAttribLocation(program, "a_position");
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
        this.vao = vao;

        // Setup texture
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        this.texture = texture;
    }

    crop(box) {
        const { video, gl, outputSize } = this;

        const normBox = {
            x: box.x / video.videoWidth,
            y: box.y / video.videoHeight,
            w: box.width / video.videoWidth,
            h: box.height / video.videoHeight
        };

        gl.viewport(0, 0, outputSize, outputSize);
        gl.useProgram(this.program);
        gl.bindVertexArray(this.vao);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, video);

        gl.uniform4f(this.cropLoc, normBox.x, normBox.y, normBox.w, normBox.h);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        const rgba = this._rgbaBuffer;
        const chw = this._tensorBuffer;
        const size = outputSize * outputSize;

        gl.readPixels(0, 0, outputSize, outputSize, gl.RGBA, gl.UNSIGNED_BYTE, rgba);
        
        for (let i = 0; i < size; ++i) {
            const base = i << 2;
            const rVal = rgba[base];
            const gVal = rgba[base + 1];
            const bVal = rgba[base + 2];
            chw[i] = rVal / 255;
            chw[size + i] = gVal / 255;
            chw[2 * size + i] = bVal / 255;
        }

        this._tensor ??= new ort.Tensor("float32", this._tensorBuffer, [1, 3, outputSize, outputSize]);
        return this._tensor;
    }
}

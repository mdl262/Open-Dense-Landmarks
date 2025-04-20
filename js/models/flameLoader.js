import { convert2D, convertBlendShapes } from '../utils/tensor.js';

/**
 * Loads and processes a FLAME model JSON.
 * @param {File} file - Uploaded .json file from user.
 * @param {number[]} landmarkIndices - List of vertex indices to extract.
 * @returns {Promise<Object>} Parsed and prepared flame model
 */
export async function loadFLAMEModel(file, landmarkIndices) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            try {
                const json = JSON.parse(reader.result);

                const v_template = landmarkIndices.map(i => json.v_template[i]);
                const shapedirs = json.shapedirs;
                const expdirs = json.expdirs;

                const S = shapedirs.map(param => landmarkIndices.map(idx => param[idx]));
                const E = expdirs.map(param => landmarkIndices.map(idx => param[idx]));

                resolve({
                    V0: convert2D(v_template, [565, 3]),
                    S: convertBlendShapes(S, [300, 565, 3]),
                    E: convertBlendShapes(E, [100, 565, 3]),
                });
            } catch (err) {
                reject("❌ Failed to parse FLAME model: " + err.message);
            }
        };

        reader.onerror = () => reject("❌ File read error");
        reader.readAsText(file);
    });
}

"use strict";

//
// shader.js -- Utilities for working with shaders.
//

/**
 * Vertex shader that simply places 2-dimensional points onto the screen and
 * provides a varying normalized position variable that is simply the position
 * normalized to coordinates in the range [0, 1] rather than [-1, 1].
 */
const IDENTITY_VS = `
attribute vec2 position;

varying vec2 position_norm;

void main() {
    gl_Position = vec4(position, 0., 1.);
    position_norm = (position + vec2(1., 1.)) / 2.;
}
`;

/**
 * Fragment shader that simply maps a texture to the screen.
 */
const IDENTITY_FS = `
varying vec2 position_norm;

uniform sampler2D texture;

void main() {
    gl_FragColor = texture2D(texture, position_norm);
}
`;

/**
 * WebGL reference to the compiled identity vertex shader.
 */
var id_vs;

/**
 * WebGL reference to the compiled identity fragment shader.
 */
var id_fs;

/**
 * Tries to compile a shader. Throws an exception on failure.
 * @param {GLEnum} type Type of the shader to compile. Can be either
 *                      gl.VERTEX_SHADER or gl.FRAGMENT_SHADER.
 * @param {String} text Source code of the shader to compile.
 */
function tryCompileShader(type, text) {
    requireGLContext();

    out = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(out, text);
    gl.compileShader(out);
    if (!gl.getShaderParameter(out, gl.SHADER_STATUS)) {
        throw gl.getShaderInfoLog(out);
    }
    return out;
}

/**
 * Postprocessing effect for rendering.
 */
class PostProcessor {
    /**
     * Create a PostProcessor
     * @param {String} effect Shader text for the postprocessing effect. Falls
     *                        back to IDENTIY_FS.
     */
    constructor(effect) {
        requireGLContext();
        
        this.prog = gl.createProgram();

        // Compile the identity vertex shader if not yet compiled
        id_vs = id_vs || tryCompileShader(gl.VERTEX_SHADER, IDENTITY_VS);

        let fs = null;
        if (!effect) {
            // Compile the identity fragment shader if not yet compiled
            id_fs = id_fs || tryCompileShader(gl.FRAGMENT_SHADER, IDENTITY_FS);
            fs = id_fs;
        } else {
            fs = tryCompileShader(gl.FRAGMENT_SHADER, effect);
        }

        gl.attachShader(this.prog, id_vs);
        gl.attachShader(this.prog, fs);
        gl.linkProgram(this.prog);
        if (!gl.getProgramParameter(this.prog, gl.LINK_STATUS)) {
            throw gl.getProgramInfoLog(this.prog);
        }
    }

    /**
     * Use this shader for rendering.
     */
    activate() {
        gl.useProgram(this.prog);
    }
}

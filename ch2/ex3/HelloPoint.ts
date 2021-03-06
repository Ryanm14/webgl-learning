
function getWebGLContext(canvas: HTMLCanvasElement): WebGLRenderingContext {
    return canvas.getContext('webgl');
}

function initShaders(gl: WebGLRenderingContext, vshader_src: string, fshader_src: string) {
    var program = createProgram(gl, vshader_src, fshader_src);
    if (!program) {
        console.log('Failed to create program');
        return false;
    }

    gl.useProgram(program);

    return true;
}

function createProgram(gl, vshader, fshader) {
    // Create shader object
    var vertexShader = loadShader(gl, gl.VERTEX_SHADER, vshader);
    var fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fshader);
    if (!vertexShader || !fragmentShader) {
        return null;
    }

    // Create a program object
    var program = gl.createProgram();
    if (!program) {
        return null;
    }

    // Attach the shader objects
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    // Link the program object
    gl.linkProgram(program);

    // Check the result of linking
    var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!linked) {
        var error = gl.getProgramInfoLog(program);
        console.log('Failed to link program: ' + error);
        gl.deleteProgram(program);
        gl.deleteShader(fragmentShader);
        gl.deleteShader(vertexShader);
        return null;
    }
    return program;
}

function loadShader(gl, type, source) {
    // Create shader object
    var shader = gl.createShader(type);
    if (shader == null) {
        console.log('unable to create shader');
        return null;
    }

    // Set the shader program
    gl.shaderSource(shader, source);

    // Compile the shader
    gl.compileShader(shader);

    // Check the result of compilation
    var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!compiled) {
        var error = gl.getShaderInfoLog(shader);
        console.log('Failed to compile shader: ' + error);
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}



//////////////////////

// MAIN PROGRAM

///////////////////////

//Vertex Shader
const VSHADER_SOURCE =`
    void main() {
       gl_Position = vec4(0.0, -0.2, 0.0, 1.0);
       gl_PointSize = 10.0;
    }
    `;

//Fragment Shader
const FSHADER_SOURCE = `
    void main() {
       gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
    `;


function main() {
    const canvas = <HTMLCanvasElement> document.getElementById("canvas")

    const gl: WebGLRenderingContext = getWebGLContext(canvas)

    if (!gl) {
        console.log("Can't get webgl context")
        return false
    }

    //Init Shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log("Failed to init shaders");
        return false;
    }

    gl.clearColor(0,0,0,1.0);

    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.POINTS, 0, 1);

}
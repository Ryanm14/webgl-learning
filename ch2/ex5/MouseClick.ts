
function getWebGLContext(canvas: HTMLCanvasElement): WebGLRenderingContext {
    return canvas.getContext('webgl');
}

function initShaders(gl: WebGLRenderingContext, vshader_src: string, fshader_src: string): WebGLProgram | null {
    var program = createProgram(gl, vshader_src, fshader_src);
    if (!program) {
        console.log('Failed to create program');
        return program;
    }

    gl.useProgram(program);

    return program;
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
    attribute vec4 a_Position;
    attribute float a_PointSize;

    void main() {
       gl_Position = a_Position;
       gl_PointSize = a_PointSize;
    }
    `;

//Fragment Shader
const FSHADER_SOURCE = `
    precision mediump float;
    uniform vec4 u_FragColor;
    
    void main() {
       gl_FragColor = u_FragColor;
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
    const program = initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)
    if (!program) {
        console.log("Failed to init shaders");
        return false;
    }

    //Get a_Position field in vertex shader
    const a_Position = gl.getAttribLocation(program, 'a_Position')
    if (a_Position < 0) {
        console.log("Failed to get storage location of a_Position");
        return false;
    }

    //Get a_PointSize field in vertex shader
    const a_PointSize = gl.getAttribLocation(program, 'a_PointSize')
    if (a_PointSize < 0) {
        console.log("Failed to get storage location of a_PointSize");
        return false;
    }

    //Get u_FragColor field in fragment shader
    const u_FragColor = gl.getUniformLocation(program, 'u_FragColor')
    if (!u_FragColor) {
        console.log("Failed to get storage location of u_FragColor");
        return false;
    }

    gl.vertexAttrib1f(a_PointSize, 10.0)

    gl.clearColor(0,0,0,1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    canvas.onmousedown = (event) => {
        click(event, gl, canvas, a_Position, u_FragColor)
    }
}
const points = [];
function click(ev: MouseEvent, gl: WebGLRenderingContext, canvas: HTMLCanvasElement, a_Position: number, u_FragColor: WebGLUniformLocation) {
    const rect = canvas.getBoundingClientRect();

    const x = ((ev.clientX - rect.left) - canvas.width/2) / (canvas.width /2 );
    const y = (canvas.height / 2 - (ev.clientY - rect.top)) / (canvas.height / 2);

    points.push([[x, y, 0.0, 1.0], [Math.random(), Math.random(), Math.random(), 1.0]])

    gl.clear(gl.COLOR_BUFFER_BIT);

    for (let p of points) {
        const pos = p[0]
        const color = p[1]
        gl.vertexAttrib3fv(a_Position, pos);
        gl.uniform4fv(u_FragColor, color)
        gl.drawArrays(gl.POINTS, 0, 1);
    }
}
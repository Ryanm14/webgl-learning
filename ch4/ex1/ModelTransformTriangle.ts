function getWebGLContext(canvas: HTMLCanvasElement): WebGLRenderingContext {
    return <WebGLRenderingContext>canvas.getContext('webgl');
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
    uniform mat4 u_xFormMatrix;
    uniform mat4 u_translatedMatrix;

    void main() {
       mat4 modelMatrix =  u_translatedMatrix * u_xFormMatrix; //Rotate then trandlate
       gl_Position =  modelMatrix  * a_Position;
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

const ANGLE = 90.0;

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

    //Get u_xFormMatrix field in vertex shader
    const u_xFormMatrix = gl.getUniformLocation(program, 'u_xFormMatrix')
    if (!u_xFormMatrix) {
        console.log("Failed to get storage location of u_xFormMatrix");
        return false;
    }

    //Get u_translatedMatrix field in vertex shader
    const u_translatedMatrix = gl.getUniformLocation(program, 'u_translatedMatrix')
    if (!u_translatedMatrix) {
        console.log("Failed to get storage location of u_translatedMatrix");
        return false;
    }

    const n = initVertexBuffers(gl, a_Position);
    if (n < 0) {
        console.log("Failed to set the position of the vertices");
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
    gl.uniform4fv(u_FragColor, [1.0, 0, 0, 1.0])

    const radians = Math.PI * ANGLE / 180.0; //Convert to radians
    const cosB = Math.cos(radians)
    const sinB = Math.sin(radians)


    //WEBGL is Column Major order!
    const x_rotatedMatrix = [
        cosB, sinB, 0.0, 0.0,
        -sinB, cosB, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        0.0, 0.0 ,0.0 ,1.0
    ]

    //WEBGL is Column Major order!
    const translatedMatrix = [
        1.0, 0.0, 0.0, 0.0,
        0.0, 1.0, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        0.0, 0.0 ,0.0 ,1.0 //Tx, Ty, Tz, 1.0
    ]


    gl.uniformMatrix4fv(u_xFormMatrix, false, x_rotatedMatrix)
    gl.uniformMatrix4fv(u_translatedMatrix, false, translatedMatrix)

    gl.clearColor(0,0,0,1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLES, 0, 3)
}

function initVertexBuffers(gl: WebGLRenderingContext, a_Position: number): number {
    const vertices = new Float32Array([0.0, 0.5, -0.5, -0.5, 0.5, -0.5])
    const n = 3

    //Create buffer object
    const vertexBuffer = gl.createBuffer()
    if (!vertexBuffer){
        console.log('Failed to create vertex buffer')
        return -1
    }

    //Bind the buffer to the target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)

    //Write data to the buffer
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

    //Assign the buffer to a_Position variable
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

    //Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position)

    return n;
}
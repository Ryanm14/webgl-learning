function main() {
    const canvas = <HTMLCanvasElement> document.getElementById("canvas")

    const gl: WebGLRenderingContext = canvas.getContext('webgl')

    if (!gl) {
        console.log("Can't get webgl context")
        return false
    }

    gl.clearColor(0,0,0,1.0);

    gl.clear(gl.COLOR_BUFFER_BIT);

}
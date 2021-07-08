class DrawProgram {

    canvas: HTMLCanvasElement | null = <HTMLCanvasElement> document.getElementById("example")

    start() {
        if (!this.canvas) {
            console.log("Failed to get <canvas> element");
            return;
        }

        const ctx = this.canvas.getContext("2d");

        ctx.fillStyle = 'rgba(0,0,255,1.0)' //Fill blue
        ctx.fillRect(120, 10, 150, 150) //Create rectangle at x,y with width,height
    }
}

function main() {
    new DrawProgram().start()

}
var DrawProgram = /** @class */ (function () {
    function DrawProgram() {
        this.canvas = document.getElementById("example");
    }
    DrawProgram.prototype.start = function () {
        if (!this.canvas) {
            console.log("Failed to get <canvas> element");
            return;
        }
        var ctx = this.canvas.getContext("2d");
        ctx.fillStyle = 'rgba(0,0,255,1.0)'; //Fill blue
        ctx.fillRect(120, 10, 150, 150); //Create rectangle at x,y with width,height
    };
    return DrawProgram;
}());
function main() {
    new DrawProgram().start();
}

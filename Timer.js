export default class createTimeLabel {
    constructor() {
        this.startTime = Date.now();
    }

    draw(ctx) {
        ctx.font = "20px Arial";
        ctx.fillStyle = "white";
        ctx.fillText(`Score: ${Math.floor((Date.now() - this.startTime) / 500)}`, 20, 30);
    }

    saveScore() {
        return Math.floor((Date.now() - this.startTime) / 500);
    }
}

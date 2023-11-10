export default class createBlock {
    constructor(width, height, canvasWidth, canvasHeight) {
        this.width = width;
        this.height = height;
        this.x = canvasWidth + 100;
        this.y = Math.floor(Math.random() * canvasHeight - 20) + 10;
				this.freeze = new Image();
				this.freeze.src = `./images/freeze.svg`;
    }

    delete(activeBlocks) {
        if (this.x < -100) {
            activeBlocks.shift();
        }
    }

    move(speedMultiplier) {
        this.x -= 1 * speedMultiplier;
    }

    draw(ctx, currentPowerup) {
        ctx.fillStyle = "red";
        ctx.fillRect(this.x, this.y, this.width, this.height);
				if (currentPowerup === "slowMo") {
					ctx.drawImage(this.freeze, this.x - 4, this.y - 4, 1.27 * this.width, 1.27 * this.height);
				}
    }
}

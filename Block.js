export default class createBlock {
    constructor(width, height, canvasWidth, canvasHeight) {
        this.width = width;
        this.height = height;
        this.x = canvasWidth + 100;
        this.y = Math.floor(Math.random() * canvasHeight - 20) + 10;
				this.icon = new Image();
				this.icon.src = `./images/block-icon.svg`;
				this.freeze = new Image();
				this.freeze.src = `./images/freeze.svg`;
    }

    delete(activeBlocks) {
        if (this.x < -100) {
            activeBlocks.shift();
        }
    }

    move(blockSpeedMultiplier, activePowerups) {
        let blockSpeed = blockSpeedMultiplier;
        if (activePowerups.some((powerup) => powerup[0] === "slowMo")) {
            blockSpeed *= 0.5;
        }
        this.x -= blockSpeed;
    }

    draw(ctx, activePowerups) {
				ctx.drawImage(this.icon, this.x, this.y, this.width, this.height);
				if (activePowerups.some((powerup) => powerup[0] === "slowMo")) {
					ctx.drawImage(this.freeze, this.x - 4, this.y - 4, 1.27 * this.width, 1.27 * this.height);
				}
    }
}

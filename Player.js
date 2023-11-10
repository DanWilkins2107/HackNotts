export default class createPlayer {
    constructor(width, height, x, y) {
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.colour = "#008000";
        this.turbofx = new Image();
        this.turbofx.src = "./images/turbofx.svg";
    }

    move(ctx, playerSpeedMultiplier, keysPressed, activePowerups) {
        let playerMovementSpeed = playerSpeedMultiplier;
        if (activePowerups.some((powerup) => powerup[0] === "slowMo")) {
            playerMovementSpeed *= 0.75;
        } 
        if (activePowerups.some((powerup) => powerup[0] === "turbo")) {
            playerMovementSpeed *= 2;
        }
        if (("a" in keysPressed || "ArrowLeft" in keysPressed) && this.x > 0) {
            this.x -= playerMovementSpeed;
        }
        if (
            ("d" in keysPressed || "ArrowRight" in keysPressed) &&
            this.x < ctx.canvas.width - this.width
        ) {
            this.x += playerMovementSpeed;
        }
        if (("w" in keysPressed || "ArrowUp" in keysPressed) && this.y > 0) {
            this.y -= playerMovementSpeed;
        }
        if (
            ("s" in keysPressed || "ArrowDown" in keysPressed) &&
            this.y < ctx.canvas.height - this.height
        ) {
            this.y += playerMovementSpeed;
        }
    }

    draw(ctx, activePowerups) {
        if (activePowerups.some((powerup) => powerup[0] === "shield")) {
            ctx.fillStyle = "white";
            ctx.fillRect(this.x - 2, this.y - 2, this.width + 4, this.height + 4);
        }

        if (activePowerups.some((powerup) => powerup[0] === "turbo")) {
            ctx.drawImage(this.turbofx, this.x - 20, this.y + this.height * 1/8, this.width* 3/4, this.height * 3/4);
        }
        ctx.fillStyle = this.colour;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

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

    move(ctx, playerSpeedMultiplier, keysPressed) {
        if (("a" in keysPressed || "ArrowLeft" in keysPressed) && this.x > 0) {
            this.x -= 1 * playerSpeedMultiplier;
        }
        if (
            ("d" in keysPressed || "ArrowRight" in keysPressed) &&
            this.x < ctx.canvas.width - this.width
        ) {
            this.x += 1 * playerSpeedMultiplier;
        }
        if (("w" in keysPressed || "ArrowUp" in keysPressed) && this.y > 0) {
            this.y -= 1 * playerSpeedMultiplier;
        }
        if (
            ("s" in keysPressed || "ArrowDown" in keysPressed) &&
            this.y < ctx.canvas.height - this.height
        ) {
            this.y += 1 * playerSpeedMultiplier;
        }
    }

    draw(ctx, currentPowerup) {
        if (currentPowerup === "shield") {
            ctx.fillStyle = "white";
            ctx.fillRect(this.x - 2, this.y - 2, this.width + 4, this.height + 4);
        }

        if (currentPowerup === "turbo") {
            ctx.drawImage(this.turbofx, this.x - 20, this.y + this.height * 1/8, this.width* 3/4, this.height * 3/4);
        }

        ctx.fillStyle = this.colour;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

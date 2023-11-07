export default class createPlayer {
  constructor(width, height, x, y) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.colour = "#008000";
  }

  move(ctx, playerSpeedMultiplier, keysPressed) {
    if (("a" in keysPressed || "ArrowLeft" in keysPressed) && this.x > 0) {
      this.x -= 1 * playerSpeedMultiplier;
    }
    if (("d" in keysPressed || "ArrowRight" in keysPressed) && this.x < ctx.canvas.width - this.width) {
      this.x += 1 * playerSpeedMultiplier;
    }
    if (("w" in keysPressed || "ArrowUp" in keysPressed) && this.y > 0) {
      this.y -= 1 * playerSpeedMultiplier;
    }
    if (("s" in keysPressed || "ArrowDown" in keysPressed) && this.y < ctx.canvas.height - this.height) {
      this.y += 1 * playerSpeedMultiplier;
    }
  }

  draw(ctx, shielded) {
    if (shielded === true) {
      ctx.fillStyle = "white";
      ctx.fillRect(this.x - 2, this.y - 2, this.width + 4, this.height + 4);
    }

    ctx.fillStyle = this.colour;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

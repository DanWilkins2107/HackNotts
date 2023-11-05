export default class createPlayer {
  constructor(width, height, x, y) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.colour = "#008000";
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

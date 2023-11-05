export default class createBlock {
	constructor(width, height, canvasWidth, canvasHeight) {
		this.width = width;
		this.height = height;
		this.x = canvasWidth + 100;
		this.y = Math.floor(Math.random() * canvasHeight - 20) + 10;
	}

	delete(activeBlocks) {
		if (this.x < -100) {
			activeBlocks.shift();
		}
	};

	move() {
		this.x -= 1;
	};

	draw(ctx) {
		ctx.fillStyle = "red";
		ctx.fillRect(this.x, this.y, this.width, this.height);
	};
}
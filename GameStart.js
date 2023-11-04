const canvasWidth = 600;
const canvasHeight = 400;

function startGame() {
  gameCanvas.start();
}

let gameCanvas = {
  canvas: document.createElement("canvas"),
  start: function () {
    this.canvas.width = canvasWidth;
    this.canvas.height = canvasHeight;
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
  },
};

let player;

function startGame() {
    gameCanvas.start();
    player = new createPlayer(30, 30, 10, 120);
}

function createPlayer(width, height, x, y) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y; 
    
    ctx = gameCanvas.context;
    ctx.fillStyel = "green";
    ctx.fillRect(this.x, this.y, this.width, this.height);
}



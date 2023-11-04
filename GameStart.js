const canvasWidth = 600;
const canvasHeight = 400;

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
let blocks = [];

function addBlockToArray() {
    let block = new createBlock(30, 30);
    blocks.push(block);
}

let newBlock = setInterval(createBlock, 1000)

function startGame() {
  ctx = gameCanvas.start();
  player = new createPlayer(30, 30, 10, 120);
  startGameLoop();
}

function startGameLoop() {
    let gameLoop = setInterval(updateCanvas, 20);
    let newBlock = setInterval(addBlockToArray, 1000)
}

function updateCanvas() {
  gameCanvas.context;
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  player.draw();
  for (let block of blocks) {
    block.move();
    block.delete();
    block.draw();
  }
}

function createPlayer(width, height, x, y) {
  this.width = width;
  this.height = height;
  this.x = x;
  this.y = y;

  this.draw = function () {
    ctx = gameCanvas.context;
    ctx.fillStyle = "green";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  };
}

let keyMap = {
  left: ["a", "ArrowLeft"],
  right: ["d", "ArrowRight"],
  up: ["w", "ArrowUp"],
  down: ["s", "ArrowDown"],
};
let keysPressed = {};
function createBlock(width, height) {
  this.width = width;
  this.height = height;
  this.x = canvasWidth + 100;
  this.y = Math.floor(Math.random() * canvasHeight - 20) + 10;

document.addEventListener("keydown", (event) => {
  keysPressed[event.key] = true;
  this.draw = function () {
    ctx = gameCanvas.context;
    ctx.fillStyle = "red";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  };

  if ((keyMap.left.includes(event.key) || keysPressed[keyMap.left[0]] || keysPressed[keyMap.left[1]]) && player.x > 0) {
    player.x -= 10;
  }
  if ((keyMap.right.includes(event.key) || keysPressed[keyMap.right[0]] || keysPressed[keyMap.right[1]]) && player.x < canvasWidth - player.width) {
    player.x += 10;
  }
  if ((keyMap.up.includes(event.key) || keysPressed[keyMap.up[0]] || keysPressed[keyMap.up[1]]) && player.y > 0) {
    player.y -= 10;
  }
  if ((keyMap.down.includes(event.key) || keysPressed[keyMap.down[0]] || keysPressed[keyMap.down[1]]) && player.y < canvasHeight - player.height) {
    player.y += 10;
  }
  updateCanvas();
});

document.addEventListener("keyup", (event) => {
  delete keysPressed[event.key];
});

function updateCanvas() {
  ctx = gameCanvas.context;
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  player.draw();
}

  this.delete = function () {
    if (this.x < -100) {
        blocks.shift();
    }
  }

  ctx = gameCanvas.context;
  ctx.fillStyle = "red";
  ctx.fillRect(this.x, this.y, this.width, this.height);

  this.move = function () {
    this.x -= 1;
  };
}

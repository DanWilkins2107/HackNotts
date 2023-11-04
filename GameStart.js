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
let gameLoop;
let newBlock;

function addBlockToArray() {
  let block = new createBlock(30, 30);
  blocks.push(block);
}

function startGame() {
  gameCanvas.start();
  player = new createPlayer(30, 30, 10, 120);
  score = new createTimeLabel(20, 30);
  startGameLoop();
}

function startGameLoop() {
  gameLoop = setInterval(updateCanvas, 20);
  newBlock = setInterval(addBlockToArray, 1000);
}

function updateCanvas() {
  if (!detectCollision()) {
    ctx = gameCanvas.context;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    player.draw();
    score.draw();
    for (let block of blocks) {
      block.move();
      block.delete();
      block.draw();
    }
  } else {
    stopGame();
  }
}

function stopGame() {
  clearInterval(gameLoop);
  clearInterval(newBlock);
  blocks = [];
  let highScore = score.saveScore();
  console.log(highScore);
  gameEndScreen(highScore);
}

function gameEndScreen(highScore) {
  ctx = gameCanvas.context;
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  ctx.fillStyle = "green";
  ctx.fillRect(30, 20, canvasWidth - 90, canvasHeight - 60);
  ctx.font = "80px Arial";
  ctx.fillStyle = "white";
  ctx.fillText(`Game Over!`, 80, 150);
  ctx.font = "50px Arial";
  ctx.fillText(`Score: ${highScore}`, 200, 200);
  ctx.font = "30px Arial";
  ctx.fillText(`Press Enter to Play Again`,100, 235);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      startGame();
    }
  });
}

function detectCollision() {
  collisionDetected = false;

  for (let block of blocks) {
    if (
      player.x < block.x + block.width &&
      player.x + player.width > block.x &&
      player.y < block.y + block.height &&
      player.y + player.height > block.y
    ) {
      collisionDetected = true;
      break;
    }
  }

  return collisionDetected;
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

function createBlock(width, height) {
  this.width = width;
  this.height = height;
  this.x = canvasWidth + 100;
  this.y = Math.floor(Math.random() * canvasHeight - 20) + 10;

  this.delete = function () {
    if (this.x < -100) {
      blocks.shift();
    }
  };

  this.move = function () {
    this.x -= 1;
  };

  this.draw = function () {
    ctx = gameCanvas.context;
    ctx.fillStyle = "red";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  };
}

function createTimeLabel(x, y) {
  const startTime = Date.now();
  this.x = x;
  this.y = y;

  //this.stop = function () {};

  this.draw = function () {
    ctx = gameCanvas.context;
    ctx.font = "20px Arial";
    ctx.fillStyle = "black";
    ctx.fillText(`Score: ${Math.floor((Date.now() - startTime) / 500)}`, this.x, this.y);
  };

  this.saveScore = function () {
    return score = Math.floor((Date.now() - startTime) / 500);
  }
}

let keyMap = {
  left: ["a", "ArrowLeft"],
  right: ["d", "ArrowRight"],
  up: ["w", "ArrowUp"],
  down: ["s", "ArrowDown"],
};

let keysPressed = {};

document.addEventListener("keydown", (event) => {
  keysPressed[event.key] = true;

  if (
    (keyMap.left.includes(event.key) ||
      keysPressed[keyMap.left[0]] ||
      keysPressed[keyMap.left[1]]) &&
    player.x > 0
  ) {
    player.x -= 10;
  }
  if (
    (keyMap.right.includes(event.key) ||
      keysPressed[keyMap.right[0]] ||
      keysPressed[keyMap.right[1]]) &&
    player.x < canvasWidth - player.width
  ) {
    player.x += 10;
  }
  if (
    (keyMap.up.includes(event.key) ||
      keysPressed[keyMap.up[0]] ||
      keysPressed[keyMap.up[1]]) &&
    player.y > 0
  ) {
    player.y -= 10;
  }
  if (
    (keyMap.down.includes(event.key) ||
      keysPressed[keyMap.down[0]] ||
      keysPressed[keyMap.down[1]]) &&
    player.y < canvasHeight - player.height
  ) {
    player.y += 10;
  }
});

document.addEventListener("keyup", (event) => {
  delete keysPressed[event.key];
});

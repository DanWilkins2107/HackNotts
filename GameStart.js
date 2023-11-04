const canvasWidth = 600;
const canvasHeight = 400;

let gameCanvas = {
  canvas: document.createElement("canvas"),
  start: function () {
    this.canvas.width = canvasWidth;
    this.canvas.height = canvasHeight;
    this.context = this.canvas.getContext("2d");
    document.body.appendChild(this.canvas);
  },
};

let player;
let activeBlocks = [];
let activePowerups = [];
let gameLoop;
let newBlock;
let newPowerup;
let score;
let powerups;

function addBlockToArray() {
  let block = new createBlock(30, 30);
  activeBlocks.push(block);
}

function addPowerupToArray() {
  let powerup = new createPowerup(30, 30);
  activePowerups.push(powerup);
}

function startGame() {
  gameCanvas.start();
  player = new createPlayer(30, 30, 10, 120);
  score = new createTimeLabel();
  powerups = new createPowerupBoard();
  startGameLoop();
}

function startGameLoop() {
  clearInterval(gameLoop);
  clearInterval(newBlock);
  clearInterval(newPowerup);
  gameLoop = setInterval(updateCanvas, 10);
  newBlock = setInterval(addBlockToArray, 1000);
  newPowerup = setInterval(addPowerupToArray, 3000);
}

function updateCanvas() {
  if (!detectCollision()) {
    ctx = gameCanvas.context;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    player.draw();
    for (let block of activeBlocks) {
      block.move();
      block.delete();
      block.draw();
    }
    for (let powerup of activePowerups) {
      powerup.move();
      powerup.delete();
      powerup.contact();
      powerup.draw();
    }
    score.draw();
    powerups.draw();
  } else {
    stopGame();
  }
}

function stopGame() {
  clearInterval(gameLoop);
  clearInterval(newBlock);  
  let highScore = score.saveScore();
  console.log(highScore);
  gameEndScreen(highScore);
}

function gameEndScreen(highScore) {
  ctx = gameCanvas.context;
  //ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  ctx.fillStyle = "#505d6b85";
  ctx.fillRect(30, 20, canvasWidth - 60, canvasHeight - 40);
  ctx.font = "75px Arial";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  const x = canvasWidth / 2;
  const y = canvasHeight / 2;
  ctx.fillText(`Game Over!`, x, y - 50);
  ctx.font = "60px Arial";
  ctx.fillText(`Score: ${highScore}`, x, y + 10);
  ctx.font = "30px Arial";
  ctx.fillText(`Press Enter to Play Again`, x, y + 50);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      activeBlocks = [];
      activePowerups = [];
      startGame();
    }
  });
}

function detectCollision() {
  collisionDetected = false;

  for (let block of activeBlocks) {
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
      activeBlocks.shift();
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

function createPowerup(width, height) {
  this.width = width;
  this.height = height;
  this.x = canvasWidth + 100;
  this.y = Math.floor(Math.random() * canvasHeight - 20) + 10;
  powerupTypes = ["turbo", "slowMo", "shield", "bomb"];
  this.powerupType = powerupTypes[Math.floor(Math.random() * 4)];

  this.delete = function () {
    if (this.x < -100) {
      activePowerups.shift();
    }
  };

  this.move = function () {
    this.x -= 1;
  };

  this.draw = function () {
    ctx = gameCanvas.context;
    if (this.powerupType === "turbo") {
      ctx.fillStyle = "blue";
    } else if (this.powerupType === "slowMo") {
      ctx.fillStyle = "yellow";
    } else if (this.powerupType === "shield") {
      ctx.fillStyle = "purple";
    } else if (this.powerupType === "bomb") {
      ctx.fillStyle = "orange";
    }
    ctx.fillRect(this.x, this.y, this.width, this.height);
  };
  this.contact = function () {
    if (
      player.x < this.x + this.width &&
      player.x + player.width > this.x &&
      player.y < this.y + this.height &&
      player.y + player.height > this.y
    ) {
      if (this.powerupType === "turbo") {
        powerups.powerups.turbo += 1;
      } else if (this.powerupType === "slowMo") {
        powerups.powerups.slowMo += 1;
      } else if (this.powerupType === "shield") {
        powerups.powerups.shield += 1;
      } else if (this.powerupType === "bomb") {
        powerups.powerups.bomb += 1;
      }
      let index = activePowerups.indexOf(this);
      activePowerups.splice(index, 1);
    }
  };
}

function createTimeLabel() {
  const startTime = Date.now();
  this.x = 20;
  this.y = 30;

  this.draw = function () {
    ctx = gameCanvas.context;
    ctx.font = "20px Arial";
    ctx.fillStyle = "black";
    ctx.fillText(
      `Score: ${Math.floor((Date.now() - startTime) / 500)}`,
      this.x,
      this.y
    );
  };
  this.saveScore = function () {
    return (score = Math.floor((Date.now() - startTime) / 500));
  };
}

function createPowerupBoard() {
  this.x = 300;
  this.y = 0;

  this.powerups = {
    turbo: 0,
    slowMo: 0,
    shield: 0,
    bomb: 0,
  };
  this.draw = function () {
    ctx = gameCanvas.context;
    ctx.font = "20px Arial";
    ctx.fillStyle = "#FFFFFF80";
    ctx.fillRect(this.x, this.y, 300, 75);
    ctx.fillStyle = "black";
    ctx.fillText("Powerups", this.x + 120, this.y + 20);
    ctx.font = "15px Arial";
    ctx.fillText("Turbo", this.x + 10, this.y + 40);
    ctx.fillText("Slow Mo", this.x + 80, this.y + 40);
    ctx.fillText("Shield", this.x + 170, this.y + 40);
    ctx.fillText("Bomb ", this.x + 250, this.y + 40);
    ctx.font = "20px Arial";
    ctx.fillText(this.powerups.turbo, this.x + 24, this.y + 65);
    ctx.fillText(this.powerups.slowMo, this.x + 105, this.y + 65);
    ctx.fillText(this.powerups.shield, this.x + 185, this.y + 65);
    ctx.fillText(this.powerups.bomb, this.x + 265, this.y + 65);
  };
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

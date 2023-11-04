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
let powerups;
let score;
let activeBlocks = [];
let activePowerups = [];
let shielded = false;
let gameLoop;
let newBlock;
let newPowerup;
let score;
let powerups;
let highScore;

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
    drawCanvas();
    score.draw();
    powerups.draw();
  } else {
    stopGame();
  }
}

function drawCanvas() {
  ctx = gameCanvas.context;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    player.draw();
    for (let powerup of activePowerups) {
      powerup.move();
      powerup.delete();
      powerup.contact();
      powerup.draw();
    }
}

function stopGame() {
  clearInterval(gameLoop);
  clearInterval(newBlock);
  clearInterval(newPowerup);
  highScore = score.saveScore();
  console.log(highScore);
  gameEndScreen(highScore);
}

function gameEndScreen(highScore) {
  ctx = gameCanvas.context;
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  drawCanvas();
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
      if (shielded === true) {
        shielded = false;
        player.colour = "green";
        let index = activeBlocks.indexOf(block);
        // Only take out the one block
        activeBlocks.splice(index, 1);
        break;
      }
      collisionDetected = true;
      break;
    }
  }

  return collisionDetected;
}

function handleTurbo() {
  //pass
};

function handleSlowMo() {
  //pass
};

function handleShield() {
  shielded = true;
  //player.colour = "#aaff00";
};

function handleBomb() {
  activeBlocks = [];
};

function createPlayer(width, height, x, y) {
  this.width = width;
  this.height = height;
  this.x = x;
  this.y = y;
  this.colour = "#008000"

  this.draw = function () {
    ctx = gameCanvas.context;
    if (shielded === true) {
      ctx.fillStyle = "white";
      ctx.fillRect(this.x - 2, this.y - 2, this.width + 4, this.height + 4);
    }
    ctx.fillStyle = this.colour;
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
  const powerupTypes = ["turbo", "slowMo", "shield", "bomb"];
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
        powerups.powerupsCount.turbo += 1;
      } else if (this.powerupType === "slowMo") {
        powerups.powerupsCount.slowMo += 1;
      } else if (this.powerupType === "shield") {
        powerups.powerupsCount.shield += 1;
      } else if (this.powerupType === "bomb") {
        powerups.powerupsCount.bomb += 1;
      }
      let index = activePowerups.indexOf(this);
      activePowerups.splice(index, 1);
    }
  };
}

function createTimeLabel() {
  const startTime = Date.now();

  this.draw = function () {
    ctx = gameCanvas.context;
    ctx.font = "20px Arial";
    ctx.fillStyle = "white";
    ctx.fillText(
      `Score: ${Math.floor((Date.now() - startTime) / 500)}`,
      20,
      30
    );
  };
  this.saveScore = function () {
    return (score = Math.floor((Date.now() - startTime) / 500));
  };
}

function createPowerupBoard() {
  this.x = 300;
  this.y = 0;

  this.powerupsCount = {
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
    ctx.fillStyle = "white";
    ctx.fillText("Powerups", this.x + 120, this.y + 20);
    ctx.font = "15px Arial";
    ctx.fillText("Turbo", this.x + 10, this.y + 40);
    ctx.fillText("Slow Mo", this.x + 80, this.y + 40);
    ctx.fillText("Shield", this.x + 170, this.y + 40);
    ctx.fillText("Bomb ", this.x + 250, this.y + 40);
    ctx.font = "20px Arial";
    ctx.fillText(this.powerupsCount.turbo, this.x + 24, this.y + 65);
    ctx.fillText(this.powerupsCount.slowMo, this.x + 105, this.y + 65);
    ctx.fillText(this.powerupsCount.shield, this.x + 185, this.y + 65);
    ctx.fillText(this.powerupsCount.bomb, this.x + 265, this.y + 65);
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

  //  Direction handling
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

  //  Powerup handling
  if (event.key === "t") {
    if (powerups.powerupsCount.turbo > 0) {
      powerups.powerupsCount.turbo -= 1;
      handleTurbo();
    }
  }
  if (event.key === "y") {
    if (powerups.powerupsCount.slowMo > 0) {
      powerups.powerupsCount.slowMo -= 1;
      handleSlowMo();
    }
  }
  if (event.key === "g") {
    if (powerups.powerupsCount.shield > 0 && shielded === false) {
      powerups.powerupsCount.shield -= 1;
      handleShield();
    }
  }
  if (event.key === "h") {
    if (powerups.powerupsCount.bomb > 0) {
      powerups.powerupsCount.bomb -= 1;
      handleBomb();
    }
  }
});

document.addEventListener("keyup", (event) => {
  delete keysPressed[event.key];
});

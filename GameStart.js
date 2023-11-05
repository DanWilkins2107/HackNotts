import createPlayer from "./Player.js";
import createBlock from "./Block.js";
import { createPowerup, createPowerupBoard } from "./Powerup.js";
import createTimeLabel from "./Timer.js";

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
let blockIncreaseSpeed;
let highScore;
let playerSpeedMultiplier;
let blockSpeedMultiplier;
let gameRun = 0;

function addBlockToArray(assignedGame) {
  let block = new createBlock(30, 30, canvasWidth, canvasHeight);
  activeBlocks.push(block);
  setTimeout(() => {checkBlockToArrayGameEnd(assignedGame)}, 1000/blockSpeedMultiplier ** 4);
}

function addPowerupToArray(assignedGame) {
  let powerup = new createPowerup(30, 30, canvasWidth, canvasHeight);
  activePowerups.push(powerup);
  setTimeout(() => {checkPowerupToArrayGameEnd(assignedGame)}, 3000/blockSpeedMultiplier ** 4);
}

function checkBlockToArrayGameEnd(assignedGame) {
  if (gameRun === assignedGame) {
    addBlockToArray(assignedGame);
  }
}

function checkPowerupToArrayGameEnd(assignedGame) {
  if (gameRun === assignedGame) {
    addPowerupToArray(assignedGame);
  }
}

function startGame() {
  gameCanvas.start();
  player = new createPlayer(30, 30, 10, 120);
  score = new createTimeLabel();
  powerups = new createPowerupBoard();
  startGameLoop();
}

function startGameLoop() {
  clearInterval(blockIncreaseSpeed);
  clearInterval(gameLoop);
  blockSpeedMultiplier = 1;
  gameRun += 1;
  blockIncreaseSpeed = setInterval(blockSpeedUp, 10000);
  gameLoop = setInterval(updateCanvas, 10);
  addBlockToArray(gameRun);
  addPowerupToArray(gameRun);
}

function blockSpeedUp() {
  if (blockSpeedMultiplier < 2) {
    blockSpeedMultiplier *= 1.1;
  } else {
    blockSpeedMultiplier *= 1.05;
  }
}

function updateCanvas() {
  let ctx = gameCanvas.context;
  if (!detectCollision()) {
    drawCanvas(ctx);
    score.draw(ctx);
    powerups.draw(ctx);
  } else {
    stopGame(ctx);
  }
}

function drawCanvas(ctx) {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  player.draw(ctx, shielded);

  for (let block of activeBlocks) {
    block.move();
    block.delete(activeBlocks);
    block.draw(ctx);
  }

  for (let powerup of activePowerups) {
    powerup.move();
    powerup.delete(activePowerups);
    powerup.contact(player, powerups, activePowerups);
    powerup.draw(ctx);
  }
}

function stopGame(ctx) {
  clearInterval(gameLoop);
  highScore = score.saveScore();
  console.log(highScore);
  gameEndScreen(ctx, highScore);
}

function gameEndScreen(ctx, highScore) {
  let gameEnded = true;
  const x = canvasWidth / 2;
  const y = canvasHeight / 2;
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  drawCanvas(ctx);

  ctx.fillStyle = "#505d6b85";
  ctx.fillRect(30, 20, canvasWidth - 60, canvasHeight - 40);
  ctx.font = "75px Arial";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.fillText(`Game Over!`, x, y - 50);
  ctx.font = "60px Arial";
  ctx.fillText(`Score: ${highScore}`, x, y + 10);
  ctx.font = "30px Arial";
  ctx.fillText(`Press Enter to Play Again`, x, y + 50);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && gameEnded === true) {
      gameEnded = false;
      activeBlocks = [];
      activePowerups = [];
      startGame();
    }
  });
}

function detectCollision() {
  let collisionDetected = false;

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
}

function handleSlowMo() {
  //pass
}

function handleShield() {
  shielded = true;
  //player.colour = "#aaff00";
}

function handleBomb() {
  activeBlocks = [];
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
  if (event.key === "1") {
    if (powerups.powerupsCount.turbo > 0) {
      powerups.powerupsCount.turbo -= 1;
      handleTurbo();
    }
  }

  if (event.key === "2") {
    if (powerups.powerupsCount.slowMo > 0) {
      powerups.powerupsCount.slowMo -= 1;
      handleSlowMo();
    }
  }

  if (event.key === "3") {
    if (powerups.powerupsCount.shield > 0 && shielded === false) {
      powerups.powerupsCount.shield -= 1;
      handleShield();
    }
  }

  if (event.key === "4") {
    if (powerups.powerupsCount.bomb > 0) {
      powerups.powerupsCount.bomb -= 1;
      handleBomb();
    }
  }
});

document.addEventListener("keyup", (event) => {
  delete keysPressed[event.key];
});

startGame();
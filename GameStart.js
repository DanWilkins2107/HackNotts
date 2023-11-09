import createPlayer from "./Player.js";
import createBlock from "./Block.js";
import { createPowerup, createPowerupBoard, createPowerupBar } from "./Powerup.js";
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
let powerupBoard;
let powerupBar;
let currentPowerup;
let powerupTimeRemaining;
let powerupTimeTotal;
let score;
let activeBlocks = [];
let activePowerups = [];
let gameLoop;
let blockIncreaseSpeed;
let highScore;
let playerSpeedMultiplier;
let blockSpeedMultiplier;
let blockSpawnMultiplier;
let gameRun = 0;

function addBlockToArray(assignedGame) {
    let block = new createBlock(30, 30, canvasWidth, canvasHeight);
    activeBlocks.push(block);
    setTimeout(() => {
        checkBlockToArrayGameEnd(assignedGame);
    }, 1000 / blockSpawnMultiplier ** 4);
}

function addPowerupToArray(assignedGame) {
    let powerup = new createPowerup(30, 30, canvasWidth, canvasHeight);
    activePowerups.push(powerup);
    setTimeout(() => {
        checkPowerupToArrayGameEnd(assignedGame);
    }, 3000 / blockSpawnMultiplier ** 4);
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
    powerupBoard = new createPowerupBoard();
    powerupBar = new createPowerupBar();
    startGameLoop();
}

function startGameLoop() {
    clearInterval(blockIncreaseSpeed);
    clearInterval(gameLoop);
    currentPowerup = null;
    powerupTimeRemaining = 0;
    blockSpeedMultiplier = 1;
    blockSpawnMultiplier = 1;
    playerSpeedMultiplier = 1;
    gameRun += 1;
    blockIncreaseSpeed = setInterval(increaseBlockRates, 10000);
    gameLoop = setInterval(updateCanvas, 10);
    addBlockToArray(gameRun);
    addPowerupToArray(gameRun);
}

function increaseBlockRates() {
    if (blockSpawnMultiplier < 2) {
        blockSpeedMultiplier *= 1.1;
        blockSpawnMultiplier *= 1.1;
    } else {
        blockSpeedMultiplier *= 1.05;
        blockSpawnMultiplier *= 1.05;
    }
}

function updateCanvas() {
    let ctx = gameCanvas.context;
    if (!detectCollision()) {
        drawCanvas(ctx);
        score.draw(ctx);
        powerupBoard.draw(ctx);
        if (powerupTimeRemaining > 0) {
            powerupBar.draw(ctx, powerupTimeRemaining, powerupTimeTotal, currentPowerup);
            powerupTimeRemaining -= 10;
        }
    } else {
        stopGame(ctx);
    }
}

function drawCanvas(ctx) {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    for (let block of activeBlocks) {
        block.move(blockSpeedMultiplier);
        block.delete(activeBlocks);
        block.draw(ctx);
    }

    for (let powerup of activePowerups) {
        powerup.move(blockSpeedMultiplier);
        powerup.delete(activePowerups);
        powerup.contact(player, powerupBoard, activePowerups);
        powerup.draw(ctx);
    }

    player.move(ctx, playerSpeedMultiplier, keysPressed);
    player.draw(ctx, currentPowerup);
}

function stopGame(ctx) {
    clearInterval(gameLoop);
    highScore = score.saveScore();
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
            if (currentPowerup === "shield") {
                currentPowerup = null;
                player.colour = "green";
                let index = activeBlocks.indexOf(block);
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
    currentPowerup = "turbo";
    powerupTimeRemaining = 5000;
    powerupTimeTotal = 5000;
    playerSpeedMultiplier *= 2;
    setTimeout(() => {
        currentPowerup = null;
        playerSpeedMultiplier *= 0.5;
    }, 5000);
}

function handleSlowMo() {
    currentPowerup = "slowMo";
    powerupTimeRemaining = 5000;
    powerupTimeTotal = 5000;
    playerSpeedMultiplier *= 0.5;
    blockSpeedMultiplier *= 0.5;
    setTimeout(() => {
        currentPowerup = null;
        playerSpeedMultiplier *= 2;
        blockSpeedMultiplier *= 2;
    }, 5000);
}

function handleShield() {
    powerupTimeRemaining = 5000;
    powerupTimeTotal = 5000;
    currentPowerup = "shield";
    setTimeout(() => {
        currentPowerup = null;
    }, 5000);
}

function handleBomb() {
    activeBlocks = activeBlocks.filter((block) => {
        return (
            block.x < player.x - 200 ||
            block.x > player.x + 200 ||
            block.y < player.y - 200 ||
            block.y > player.y + 200
        );
    });
}

let keysPressed = {};

document.addEventListener("keydown", (event) => {
    keysPressed[event.key] = true;
    //  Powerup handling
    if (event.key === "1") {
        if (powerupBoard.powerupsCount.turbo > 0 && currentPowerup === null) {
            powerupBoard.powerupsCount.turbo -= 1;
            handleTurbo();
        }
    }
    if (event.key === "2") {
        if (powerupBoard.powerupsCount.slowMo > 0 && currentPowerup === null) {
            powerupBoard.powerupsCount.slowMo -= 1;
            handleSlowMo();
        }
    }
    if (event.key === "3") {
        if (powerupBoard.powerupsCount.shield > 0 && currentPowerup === null) {
            powerupBoard.powerupsCount.shield -= 1;
            handleShield();
        }
    }
    if (event.key === "4") {
        if (powerupBoard.powerupsCount.bomb > 0 && currentPowerup === null) {
            powerupBoard.powerupsCount.bomb -= 1;
            handleBomb();
        }
    }
});

document.addEventListener("keyup", (event) => {
    delete keysPressed[event.key];
});

startGame();

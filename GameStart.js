import createPlayer from "./Player.js";
import createBlock from "./Block.js";
import { createPowerup, createPowerupBoard, createPowerupBar, drawBomb } from "./Powerup.js";
import createTimeLabel from "./Timer.js";

const canvasWidth = 600;
const canvasHeight = 400;

let gameCanvas = {
    canvas: document.createElement("canvas"),
    start: function () {
        this.canvas.width = canvasWidth;
        this.canvas.height = canvasHeight;
        this.context = this.canvas.getContext("2d");
        const gameContainer = document.getElementById("canvas");
        gameContainer.appendChild(this.canvas);
    },
};

let player;
let powerupBoard;
let powerupBars;
let activePowerups;
let bombActive;
let bombRadius;
let bombDirection;
let score;
let activeBlocks = [];
let activePowerupBlocks = [];
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
    activePowerupBlocks.push(powerup);
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
    powerupBars = new createPowerupBar();
    startGameLoop();
}

function startGameLoop() {
    clearInterval(blockIncreaseSpeed);
    clearInterval(gameLoop);
    activePowerups = [];
    blockSpeedMultiplier = 1;
    blockSpawnMultiplier = 1;
    playerSpeedMultiplier = 1;
    gameRun += 1;
    bombActive = false;
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
        lowerPowerupCount(ctx, activePowerups);
        checkBomb(ctx);
    } else {
        stopGame(ctx);
    }
}

function drawCanvas(ctx) {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    for (let block of activeBlocks) {
        block.move(blockSpeedMultiplier, activePowerups);
        block.delete(activeBlocks);
        block.draw(ctx, activePowerups);
    }

    for (let powerup of activePowerupBlocks) {
        powerup.move(blockSpeedMultiplier, activePowerups);
        powerup.delete(activePowerupBlocks);
        powerup.contact(player, powerupBoard, activePowerupBlocks);
        powerup.draw(ctx);
    }

    player.move(ctx, playerSpeedMultiplier, keysPressed, activePowerups);
    player.draw(ctx, activePowerups);
}

function lowerPowerupCount(ctx, activePowerups) {
    if (activePowerups.length > 0) {
        powerupBars.draw(ctx, activePowerups);
        for (let powerup of activePowerups) {
            powerup[1] -= 10;
            if (powerup[1] <= 0) {
                let index = activePowerups.indexOf(powerup);
                activePowerups.splice(index, 1);
            }
        }
    }
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
            activePowerupBlocks = [];
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
            if (activePowerups.some((powerup) => powerup[0] === "shield")) {
                let index = activeBlocks.indexOf(block);
                activeBlocks.splice(index, 1);
                activePowerups = activePowerups.filter((powerup) => {
                    return powerup[0] !== "shield";
                });
                break;
            }
            collisionDetected = true;
            break;
        }
    }

    return collisionDetected;
}

function handlePowerups(powerupString) {
    activePowerups.push([powerupString, 5000]);
    setTimeout(() => {
        activePowerups = activePowerups.filter((powerup) => {
            return powerup[0] !== powerupString;
        });
    }, 5000);
}

function handleBomb() {
    bombActive = true;
    bombDirection = 1;
    bombRadius = 0;
}

function checkBomb(ctx) {
    if (bombActive) {
        if ("4" in keysPressed) {
            bombRadius += bombDirection;
            drawBomb(ctx, player, bombRadius);
            if (bombRadius === 200) {
                bombDirection = -1;
            } else if (bombRadius === 0) {
                bombDirection = 1;
            }
        } else {
            explodeBomb(bombRadius);
        }
    }
}

function explodeBomb(radius) {
    activeBlocks = activeBlocks.filter((block) => {
        return radius < Math.sqrt((block.x - player.x) ** 2 + (block.y - player.y) ** 2);
    });
    bombActive = false;
}

let keysPressed = {};

document.addEventListener("keydown", (event) => {
    // Disable Arrow Keys moving the page
    if (
        event.key === "ArrowLeft" ||
        event.key === "ArrowRight" ||
        event.key === "ArrowUp" ||
        event.key === "ArrowDown"
    ) {
        event.preventDefault();
    }
    keysPressed[event.key] = true;
    if (
        event.key === "1" &&
        powerupBoard.powerupsCount.turbo > 0 &&
        !activePowerups.some((powerup) => powerup[0] === "turbo")
    ) {
        powerupBoard.powerupsCount.turbo -= 1;
        handlePowerups("turbo");
    }
    if (
        event.key === "2" &&
        powerupBoard.powerupsCount.slowMo > 0 &&
        !activePowerups.some((powerup) => powerup[0] === "slowMo")
    ) {
        powerupBoard.powerupsCount.slowMo -= 1;
        handlePowerups("slowMo");
    }
    if (
        event.key === "3" &&
        powerupBoard.powerupsCount.shield > 0 &&
        !activePowerups.some((powerup) => powerup[0] === "shield")
    ) {
        if (powerupBoard.powerupsCount.shield > 0) {
            powerupBoard.powerupsCount.shield -= 1;
            handlePowerups("shield");
        }
    }
    if (event.key === "4" && powerupBoard.powerupsCount.bomb > 0 && !bombActive) {
        if (powerupBoard.powerupsCount.bomb > 0) {
            powerupBoard.powerupsCount.bomb -= 1;
            handleBomb();
        }
    }
});

document.addEventListener("keyup", (event) => {
    delete keysPressed[event.key];
});

startGame();

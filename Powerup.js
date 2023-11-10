export class createPowerup {
    constructor(width, height, canvasWidth, canvasHeight) {
        this.width = width;
        this.height = height;
        this.x = canvasWidth + 100;
        this.y = Math.floor(Math.random() * canvasHeight - 20) + 10;
        const powerupTypes = ["turbo", "slowMo", "shield", "bomb"];
        this.powerupType = powerupTypes[Math.floor(Math.random() * 4)];
        this.icon = new Image();
        this.icon.src = `./images/${this.powerupType}.svg`;
    }

    delete(activePowerupBlocks) {
        if (this.x < -100) {
            activePowerupBlocks.shift();
        }
    }

    move(blockSpeedMultiplier, activePowerups) {
        let blockSpeed = 1.25 * blockSpeedMultiplier;
        if (activePowerups.some((powerup) => powerup[0] === "slowMo")) {
            blockSpeed *= 0.5;
        }
        this.x -= blockSpeed;
    }

    draw(ctx) {
        ctx.drawImage(this.icon, this.x, this.y, this.width, this.height);
    }

    contact(player, powerups, activePowerups) {
        if (
            player.x < this.x + this.width &&
            player.x + player.width > this.x &&
            player.y < this.y + this.height &&
            player.y + player.height > this.y
        ) {
            if (powerups.powerupsCount[this.powerupType] < 3) {
                powerups.powerupsCount[this.powerupType] += 1;
                let index = activePowerups.indexOf(this);
                activePowerups.splice(index, 1);
            }
        }
    }
}

export class createPowerupBoard {
    constructor() {
        this.x = 300;
        this.y = 0;

        this.powerupNames = ["Turbo", "Slow Mo", "Shield", "Bomb"];

        this.powerupsCount = {
            turbo: 0,
            slowMo: 0,
            shield: 0,
            bomb: 0,
        };
    }

    draw(ctx) {
        ctx.fillStyle = "#FFFFFF80";
        ctx.fillRect(this.x, this.y, 300, 75);

        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.font = "20px Arial";
        ctx.fillText("Powerups", this.x + 150, this.y + 20);

        Object.keys(this.powerupsCount).map((val, i) => {
            if (this.powerupsCount[val] >= 3) {
                ctx.fillStyle = "red";
            } else {
                ctx.fillStyle = "white";
            }

            ctx.font = "15px Arial";
            ctx.fillText(this.powerupNames[i], this.x + 42 + i * 75, this.y + 40);

            ctx.font = "20px Arial";
            ctx.fillText(this.powerupsCount[val], this.x + 42 + i * 75, this.y + 65);
        });

        ctx.textAlign = "start";
    }
}

export class createPowerupBar {
    constructor() {
        this.x = 150;
        this.y = 15;
        this.shield = new Image();
        this.shield.src = "./images/shield.svg";
        this.turbo = new Image();
        this.turbo.src = "./images/turbo.svg";
        this.slowMo = new Image();
        this.slowMo.src = "./images/slowMo.svg";
    }
    draw(ctx, activePowerups) {
        let i = 0;
        for (let powerup of activePowerups) {
            ctx.fillStyle = "#FFFFFF80";
            ctx.fillRect(this.x, this.y + 30*i, 100, 17);
            ctx.drawImage(this[powerup[0]], this.x - 25, this.y - 5 + 30*i, 25, 25)
            ctx.fillStyle = "white";
            ctx.fillRect(this.x, this.y + 30*i, (powerup[1] / 5000) * 100, 17);
            i++;
        }
    }
}

export function drawBomb(ctx, player, radius) {
    ctx.fillStyle = "#FFA50080";
    ctx.beginPath();
    ctx.arc(player.x + player.width/2, player.y+player.width/2, radius, 0, 2 * Math.PI);
    ctx.fill();
}
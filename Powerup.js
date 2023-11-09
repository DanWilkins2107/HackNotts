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

    delete(activePowerups) {
        if (this.x < -100) {
            activePowerups.shift();
        }
    }

    move(speedMultiplier) {
        this.x -= 1.25 * speedMultiplier;
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

        this.powerupsCount = {
            turbo: 0,
            slowMo: 0,
            shield: 0,
            bomb: 0,
        };
    }

    draw(ctx) {
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
    draw(ctx, powerupTimeRemaining, powerupTimeTotal, powerupType) {
        ctx.fillStyle = "#FFFFFF80";
        ctx.fillRect(this.x, this.y, 100, 17);
        ctx.fillStyle = "white";
        ctx.fillRect(this.x, this.y, (powerupTimeRemaining / powerupTimeTotal) * 100, 17);
        if (powerupType === "turbo") {
            ctx.drawImage(this.turbo, this.x - 25, this.y - 5, 25, 25);
        } else if (powerupType === "slowMo") {
            ctx.drawImage(this.slowMo, this.x - 25, this.y - 5, 25, 25);
        } else if (powerupType === "shield") {
            ctx.drawImage(this.shield, this.x - 25, this.y - 5, 25, 25);
        }
    }
}

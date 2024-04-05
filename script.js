let canvas = document.querySelector('#canvas');
let ctx = canvas.getContext('2d');
let score = 0;
let scoreBox2 = document.getElementById("scoreBox2");
let playerXcoord = 375;
let payerYcoord = 750;
let speedRight = 0;
let speedLeft = 0;
let gameIsRunning = true;
let canvasWidth = 800;
let canvasHeight = 800;
let delayFactor = 100;

function generatePlayer() {
    document.getElementById("startGameBtn").innerHTML = "running";
    document.getElementById("startGameBtn").disabled = true;
    drawPlayer();
    setInterval(updateCanvas, 16);
}

function drawPlayer() {
    ctx.fillStyle = "black";
    ctx.fillRect(playerXcoord, payerYcoord, 50, 50);
}

function updateCanvas() {
    if (!gameIsRunning) return;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    if (playerXcoord + 50 + speedRight <= canvasWidth) {
        playerXcoord += speedRight;
    }
    if (playerXcoord - 25 - speedLeft >= 0) {
        playerXcoord += speedLeft;
    }
    drawPlayer();
    drawProjectiles();
    delayObstacleGeneration();
    drawObstacles();
    checkCollisions();
}

addEventListener("keydown", function(e) {
    if (e.key == "ArrowRight") speedRight = 15;
    if (e.key == "ArrowLeft") speedLeft = -15;
    if (e.key == " ") projectileStartCoordinates();
});

addEventListener("keyup", function(e) {
    if (e.key == "ArrowRight") speedRight = 0;
    if (e.key == "ArrowLeft") speedLeft = 0;
});

let projectiles = [];

function projectileStartCoordinates() {
    let projectileData = [playerXcoord + 20, payerYcoord];
    projectiles.push(projectileData);
}

function drawProjectiles() {
    for (let i = 0; i < projectiles.length; ++i) {
        projectiles[i][1] -= 10;
        if (projectiles[i][1] < 0) {
            projectiles.splice(i, 1);
        }
        ctx.fillStyle = 'red';
        if (projectiles.length >= 1) {
            ctx.fillRect(projectiles[i][0], projectiles[i][1], 10, 30);
        }
    }
}

function delayObstacleGeneration() {
    let rnd = Math.floor(Math.random() * 1000);
    if (rnd % delayFactor == 0) {
        obstacleStartCoordinates();
        drawObstacles();
    }
} 

let obstacles = [];

function obstacleStartCoordinates() {
    for (let i = 0; i < 3; ++i) {
        let obstacleX = Math.floor(Math.random() * 750);
        let obstacleY = -50;
        let obstacleFallSpeed = Math.floor(Math.random() * 8) + 1;
        let obstacleData = [obstacleX, obstacleY, obstacleFallSpeed];
        obstacles.push(obstacleData);
    }
}

function drawObstacles() {
    for (let i = 0; i < obstacles.length; ++i) {
        obstacles[i][1] += obstacles[i][2];
        if (obstacles[i][1] >= canvasHeight) {
            obstacles.splice(i, 1);
        }
        ctx.fillStyle = 'blue';
        ctx.fillRect(obstacles[i][0], obstacles[i][1], 50, 50);
    }
}

function checkCollisions() {
    for (let i = 0; i < obstacles.length; i++) {
        if (
            playerXcoord < obstacles[i][0] + 50 &&
            playerXcoord + 50 > obstacles[i][0] &&
            payerYcoord < obstacles[i][1] + 50 &&
            payerYcoord + 50 > obstacles[i][1]
        ) {
            handlePlayerCollision();
        }
    }
    for (let i = 0; i < projectiles.length; i++) {
        for (let j = 0; j < obstacles.length; j++) {
            if (
                projectiles[i][0] < obstacles[j][0] + 50 &&
                projectiles[i][0] + 10 > obstacles[j][0] &&
                projectiles[i][1] < obstacles[j][1] + 50 &&
                projectiles[i][1] + 30 > obstacles[j][1]
            ) {
                projectiles.splice(i, 1);
                obstacles.splice(j, 1);
                score += 10;
                scoreBox2.textContent = score;
                break;
            }
        }
    }
}

function handlePlayerCollision() {
    gameIsRunning = false;
    let refreshBtn = document.createElement("button");
    refreshBtn.addEventListener('click', refreshGame);
    refreshBtn.className = "refreshBtn";
    refreshBtn.innerHTML = "refresh game";
    document.getElementById("buttonContainer").appendChild(refreshBtn);
    document.getElementById("startGameBtn").innerHTML = "game ended";
}

function refreshGame() {
    location.reload();
}


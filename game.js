const canvas = document.getElementById("canvas");
const canvasContext = canvas.getContext("2d");
const pacmanFrames = document.getElementById("animations");
const ghostFrames = document.getElementById("ghosts");

let createRect = (x, y, width, height, color) => {
    canvasContext.fillStyle = color;
    canvasContext.fillRect(x, y, width, height);
};

const DIRECTION_RIGHT = 4;
const DIRECTION_UP = 3;
const DIRECTION_LEFT = 2;
const DIRECTION_BOTTOM = 1;
let lives = 3;
let ghostCount = 4;
let ghostLocations = [
    {x: 0, y: 0},
    {x: 176, y: 0},
    {x: 0, y: 121},
    {x: 176, y: 121},
];

// Important game character variables
let fps = 30;
let pacman;
let oneBlockSize = 20;
let score = 0;
let ghosts = [];
let wallSpaceWidth = oneBlockSize / 1.5;
let wallOffset = (oneBlockSize - wallSpaceWidth) / 2;
let wallInnerColor = "black";

let wallColor = "#342DCA";
let foodColor = "#FEB897";
let foodCount = 0;

// Wall mapping (1 = wall, 0 = no wall)
// For 21 columns and 23 rows
let map = [
    [1,1,1,1,1, 1,1,1,1,1, 1,1,1,1,1, 1,1,1,1,1, 1],
    [1,2,2,2,2, 2,2,2,2,2, 1,2,2,2,2, 2,2,2,2,2, 1],
    [1,2,1,1,1, 2,1,1,1,2, 1,2,1,1,1, 2,1,1,1,2, 1],
    [1,2,1,1,1, 2,1,1,1,2, 1,2,1,1,1, 2,1,1,1,2, 1],
    [1,2,2,2,2, 2,2,2,2,2, 2,2,2,2,2, 2,2,2,2,2, 1],
    [1,2,1,1,1, 2,1,2,1,1, 1,1,1,2,1, 2,1,1,1,2, 1],
    [1,2,2,2,2, 2,1,2,2,2, 1,2,2,2,1, 2,2,2,2,2, 1],
    [1,1,1,1,1, 2,1,1,1,2, 1,2,1,1,1, 2,1,1,1,1, 1],
    [0,0,0,0,1, 2,1,2,2,2, 2,2,2,2,1, 2,1,0,0,0, 0],
    [1,1,1,1,1, 2,1,2,1,1, 2,1,1,2,1, 2,1,1,1,1, 1],
    [1,2,2,2,2, 2,2,2,1,2, 2,2,1,2,2, 2,2,2,2,2, 1],
    [1,1,1,1,1, 2,1,2,1,2, 2,2,1,2,1, 2,1,1,1,1, 1],
    [0,0,0,0,1, 2,1,2,1,1, 1,1,1,2,1, 2,1,0,0,0, 0],
    [0,0,0,0,1, 2,1,2,2,2, 2,2,2,2,1, 2,1,0,0,0, 0],
    [1,1,1,1,1, 2,2,2,1,1, 1,1,1,2,2, 2,1,1,1,1, 1],
    [1,2,2,2,2, 2,2,2,2,2, 1,2,2,2,2, 2,2,2,2,2, 1],
    [1,2,1,1,1, 2,1,1,1,2, 1,2,1,1,1, 2,1,1,1,2, 1],
    [1,2,2,2,1, 2,2,2,2,2, 2,2,2,2,2, 2,1,2,2,2, 1],
    [1,1,2,2,1, 2,1,2,1,1, 1,1,1,2,1, 2,1,2,2,1, 1],
    [1,2,2,2,2, 2,1,2,2,2, 1,2,2,2,1, 2,2,2,2,2, 1],
    [1,2,1,1,1, 1,1,1,1,2, 1,2,1,1,1, 1,1,1,1,2, 1],
    [1,2,2,2,2, 2,2,2,2,2, 2,2,2,2,2, 2,2,2,2,2, 1],
    [1,1,1,1,1, 1,1,1,1,1, 1,1,1,1,1, 1,1,1,1,1, 1],
];

let randomTargetsForGhosts = [
    {x: 1 * oneBlockSize, y: 1 * oneBlockSize},
    {x: 1 * oneBlockSize, y: (map.length - 2) * oneBlockSize},
    {x: (map[0].length - 2) * oneBlockSize, y: oneBlockSize},
    {x: (map[0].length - 2) * oneBlockSize, y: (map.length - 2) * oneBlockSize},
];

// for (let i = 0; i < map.length; i++) {
//     for (let j = 0; j < map.length; j++) {
//         foodCount++;
//     }
// }

let createNewPacman = () => {
    pacman = new Pacman(
        oneBlockSize, oneBlockSize, oneBlockSize, oneBlockSize, oneBlockSize / 5
    );
};

let gameLoop = () => {
    draw();
    update();
};

let gameInterval = setInterval(gameLoop, 1000 / fps);

let restartPacmanAndGhosts = () => {
    createNewPacman();
    createGhosts();
};

let onGhostCollision = () => {
    lives--;
    restartPacmanAndGhosts();
    if (lives == 0) {

    }
};

let update = () => {
    pacman.moveProcess();
    pacman.eat();
    updateGhosts();
    if (pacman.checkGhostCollision(ghosts)) {
        onGhostCollision();
    }
};

// let update = () => {
//     pacman.moveProcess();
//     pacman.eat();
    
//     for(let i = 0; i < map.length; i++) {
//         ghosts[i].moveProcess();
//     }

//     if(pacman.checkGhostCollision()) {
//         console.log("HIT!");
//         restartGame();
//     }

//     if(score >= foodCount) {
//         drawWin();
//         clearInterval(gameInterval);
//     }
// };

// let restartGame = () => {
    //     createNewPacman();
    //     createGhosts();
    //     lives--;
    //     if(lives == 0) {
        //         gameOver();
        //     }
        // };
        
let drawFoods = () => {
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[0].length; j++) {
            if (map[i][j] == 2) {
                createRect(
                    j * oneBlockSize + oneBlockSize / 3,
                    i * oneBlockSize + oneBlockSize / 3,
                    oneBlockSize / 3,
                    oneBlockSize / 3,
                    foodColor
                );
            }
        }
    }
};

let drawRemainingLives = () => {
    canvasContext.font = "20px Emulogic";
    canvasContext.fillStyle = "white";
    canvasContext.fillText = ("Lives: ", 220, oneBlockSize * (map.length + 1));

    for (let i = 0; i < lives; i++) {
        canvasContext.drawImage(
            pacmanFrames,
            2 * oneBlockSize,
            0,
            oneBlockSize,
            oneBlockSize,
            350 + i * oneBlockSize,
            oneBlockSize * map.length + 2,
            oneBlockSize,
            oneBlockSize
        );
    }
};

let drawScore = () => {
    canvasContext.font = "20px Emulogic";
    canvasContext.fillStyle = "white";
    canvasContext.fillText(
        "Score: " + score,
        0,
        oneBlockSize * (map.length + 1)
    );
};

let draw = () => {
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    createRect(0, 0, canvas.width, canvas.height, "black");
    drawWalls();
    drawFoods();
    drawGhosts();
    pacman.draw();
    drawScore();
    drawRemainingLives();
};

let drawWalls = () => {
    for(let i = 0; i < map.length; i++) {
        for(let j = 0; j < map.length; j++) {
            if(map[i][j] == 1) {
                createRect(j * oneBlockSize, i * oneBlockSize, oneBlockSize, oneBlockSize, wallColor);
                if(j > 0 && map[i][j - 1] == 1) {
                    createRect(j * oneBlockSize, i * oneBlockSize + wallOffset, wallSpaceWidth + wallOffset, wallSpaceWidth, wallInnerColor)
                };
                if(j < map[0].length - 1 && map[i][j + 1] == 1) {
                    createRect(j * oneBlockSize + wallOffset, i * oneBlockSize + wallOffset, wallSpaceWidth + wallOffset, wallSpaceWidth, wallInnerColor);
                };
                if(i < map.length - 1 && map[i + 1][j] == 1) {
                    createRect(j * oneBlockSize + wallOffset, i * oneBlockSize + wallOffset, wallSpaceWidth, wallSpaceWidth + wallOffset, wallInnerColor);
                };
                if(i > 0 - 1 && map[i - 1][j] == 1) {
                    createRect(j * oneBlockSize + wallOffset, i * oneBlockSize, wallSpaceWidth, wallSpaceWidth + wallOffset, wallInnerColor);
                };
            }
        }
    }
};

let createGhosts = () => {
    ghosts = [];
    for(let i = 0; i < ghostCount * 2; i++) {
        let newGhost = new Ghost(
            9 * oneBlockSize + (i % 2 == 0 ? 0 : 1) * oneBlockSize,
            10 * oneBlockSize + (i % 2 == 0 ? 0 : 1) * oneBlockSize,
            oneBlockSize,
            oneBlockSize,
            pacman.speed / 2,
            ghostLocations[i % 4].x,
            ghostLocations[i % 4].y,
            124,
            116,
            6 + i,
        );
        ghosts.push(newGhost);
    }
};

createNewPacman();
createGhosts();
gameLoop();

window.addEventListener("keydown", (event) => {
    let k = event.keyCode;
    setTimeout(() => {
        if (k == 37 || k == 65) {
            // left key
            pacman.nextDirection = DIRECTION_LEFT;
        } else if (k == 37 || k == 87) {
            // up key
            pacman.nextDirection = DIRECTION_UP;
        } else if (k == 39 || k == 68) {
            // right key
            pacman.nextDirection = DIRECTION_RIGHT;
        } else if (k == 40 || k == 83) {
            // bottom key
            pacman.nextDirection = DIRECTION_BOTTOM;
        }
    }, 1);
});

// let gameOver = () => {
//     drawGameOver();
//     clearInterval(gameInterval);
// }

// let drawGameOver = () => {
//     canvasContext.font = "20px Emulogic";
//     canvasContext.fillStyle = "white";
//     canvasContext.fillText("Game Over!", 150, 200);
// };

// let drawWin = () => {
//     canvasContext.font = "20px Emulogic";
//     canvasContext.fillStyle = "white";
//     canvasContext.fillText("You Win!", 150, 200);
// };

// let drawLives = () => {
//     canvasContext.font = "20px Emulogic";
//     canvasContext.fillStyle = "white";
//     canvasContext.fillText("Lives: ", 220, oneBlockSize * (map.length + 1) + 10);
//     for (let i = 0; i < lives; i++) {
//         canvasContext.drawImage(pacmanFrames, 2 * oneBlockSize, 0, oneBlockSize, oneBlockSize, 350 + i * oneBlockSize, oneBlockSize * map.length + 10, oneBlockSize, oneBlockSize);
//     }
// }

// let drawGhosts = () => {
//     for(let i = 0; i < ghosts.length; i++) {
//         ghosts[i].draw();
//     }
// };
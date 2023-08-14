const canvas = document.getElementById("canvas");
const canvasContext = canvas.getContext("2d");
const pacmanFrames = document.getElementById("animation");
const ghostFrames = document.getElementById("ghosts");

let createRect = (x, y, width, height, color) => {
    canvasContext.fillStyle = color;
    canvasContext.fillRect(x, y, width, height);
};

let map = [
    [1,1,1,1,1, 1,1,1,1,1, 1,1,1,1,1, 1,1,1,1,1, 1],
    [1,2,2,2,2, 2,2,2,2,2, 1,2,2,2,2, 2,2,2,2,2, 1],
    [1,2,1,1,1, 2,1,1,1,2, 1,2,1,1,1, 2,1,1,1,2, 1],
    [1,2,1,1,1, 2,1,1,1,2, 1,2,1,1,1, 2,1,1,1,2, 1],
];
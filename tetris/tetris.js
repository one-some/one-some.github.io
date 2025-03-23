const canvas = document.getElementById("tetris");
const ctx = canvas.getContext("2d");

canvas.width = 100;
canvas.height = 180;

canvas.style.backgroundColor = "#181818";

const sizeX = 10;
const sizeY = 18;

const colors = [
    "black",
    "lightblue",
    "blue",
    "gold",
    "yellow",
    "green",
    "purple",
    "red"
];

const tetromino = [
    ["XXXX"],
    [
        "X  ",
        "XXX"
    ],
    [
        "  X",
        "XXX"
    ],
    [
        "XX",
        "XX"
    ],
    [
        " XX",
        "XX "
    ],
    [
        " X ",
        "XXX"
    ],
    [
        "XX ",
        " XX"
    ]
]

let tiles = Array.from(Array(sizeX), () => new Array(sizeY).fill(0));
let preTiles = structuredClone(tiles, { deep: true })
const currentPiece = {
    id: 0,
    x: 0,
    y: 0,
};

function renderBrick(x, y, brick) {
    x *= 8;
    y *= 8;

    x += 10;
    y += 20;

    ctx.fillStyle = colors[brick] ?? "black";
    ctx.fillRect(x, y, 8, 8);

    ctx.fillStyle = "#00000044";
    ctx.fillRect(x + 7, y, 1, 8);
    ctx.fillRect(x, y + 7, 8, 1);

    ctx.fillStyle = "#ffffff44";
    ctx.fillRect(x, y, 1, 8);
    ctx.fillRect(x, y, 8, 1);
}

function drawTetromino(id, x, y) {
    const tet = tetromino[id];

    for (let py = 0; py < tet.length; py++) {
        for (let px = 0; px < tet[py].length; px++) {
            if (tet[py][px] === " ") continue;
            tiles[x + px][y + py] = id + 1;
        }
    }
}

function checkCollision(id, x, y) {
    if (y > sizeY) return true;
    const tet = tetromino[id];

    for (let py = 0; py < tet.length; py++) {
        for (let px = 0; px < tet[py].length; px++) {
            if (tet[py][px] === " ") continue;
            if (tiles[x + px][y + py]) return true;
            if (tiles[x + px][y + py] === undefined) return true;
        }
    }
    return false;
}

tiles[1][2] = 3;

function renderTiles() {
    for (let x = 0; x < sizeX; x++) {
        for (let y = 0; y < sizeY; y++) {
            renderBrick(x, y, tiles[x][y]);
        }
    }
}

function gameStep() {
    tiles = structuredClone(preTiles);
    drawTetromino(currentPiece.id, currentPiece.x, currentPiece.y);

    if (checkCollision(currentPiece.id, currentPiece.x, currentPiece.y + 1)) {
        console.log("collided")
        currentPiece.id = 0;
        currentPiece.x = 0;
        currentPiece.y = 0;
        preTiles = structuredClone(tiles);
        return;
    }

    currentPiece.y++;
    renderTiles();
}

renderTiles();

setInterval(gameStep, 100);

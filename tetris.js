const canvas = document.getElementById("tetris");
const ctx = canvas.getContext("2d");

canvas.width = 100;
canvas.height = 180;

canvas.style.backgroundColor = "#181818";

const setTTL = 2;

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
    y += 25;

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
    if (x < 0) return true;
    const tet = tetromino[id];

    for (let py = 0; py < tet.length; py++) {
        for (let px = 0; px < tet[py].length; px++) {
            if (tet[py][px] === " ") continue;
            if (preTiles[x + px] === undefined) return true;
            if (preTiles[x + px][y + py] === undefined) return true;
            if (preTiles[x + px][y + py]) return true;
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


let gameTTL = setTTL;
function gameStep() {
    tiles = structuredClone(preTiles);
    drawTetromino(currentPiece.id, currentPiece.x, currentPiece.y);

    if (gameTTL <= 0) {
        gameTTL = setTTL;
        currentPiece.id = Math.floor(Math.random() * tetromino.length);
        currentPiece.x = Math.floor(Math.random() * 8);
        currentPiece.y = 0;
        preTiles = structuredClone(tiles);
        renderTiles();
        return;
    }

    if (checkCollision(currentPiece.id, currentPiece.x, currentPiece.y + 1)) {
        if (currentPiece.y < 0) alert("DONE");
        gameTTL -= 1;
        renderTiles();
        return;
    }

    currentPiece.y++;
    renderTiles();
}

renderTiles();

let interval = setInterval(gameStep, 100);

function stop() {
    clearInterval(interval);
}

function handleKey(key) {
    let positionDelta = [0, 0];

    switch (key) {
        case "a":
        case "arrowleft":
            positionDelta[0] -= 1;
            break;
        case "d":
        case "arrowright":
            positionDelta[0] += 1;
            break;
    }

    gameTTL = setTTL;

    if (!checkCollision(
        currentPiece.id,
        currentPiece.x + positionDelta[0],
        currentPiece.y + positionDelta[1]
    )) {
        currentPiece.x += positionDelta[0];
        currentPiece.y += positionDelta[1];
    }
}

const keyIntervals = {};

canvas.addEventListener("keydown", function(event) {
    // NOTE: Canvas itself cannot have focus:
    // https://stackoverflow.com/questions/12886286/addeventlistener-for-keydown-on-canvas#comment17449305_12886286

    const key = event.key.toLowerCase();
    handleKey(key);

    keyIntervals[key] = setInterval(() => handleKey(key), 200);
});

window.addEventListener("keyup", function(event) {
    const key = event.key.toLowerCase();
    const interval = keyIntervals[key];
    delete keyIntervals[key];
    if (interval === undefined) return;
    clearInterval(interval);
});

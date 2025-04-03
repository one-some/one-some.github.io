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

let tiles = Array.from(Array(sizeY), () => new Array(sizeX).fill(0));
const currentPiece = {
    id: 0,
    x: 0,
    y: 0,
    rotation: 0,
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

function rotatedTetromino(id, rotation) {
    let tet = structuredClone(tetromino[id], { deep: true });

    for (let i = 0; i < rotation % 4; i++) {
        let dims = [
            tet[0].length,
            tet.length,
        ];

        // Rotate dimensions of array
        if (i % 2 == 0) dims.push(dims.shift);

        let newTet = Array.from(Array(dims[0]), () => new Array(dims[1]).fill(" "));

        for (let y = 0; y < tet.length; y++) {
            for (let x = 0; x < tet[y].length; x++) {
                newTet[x][y] = tet[y][x];
            }
        }

        tet = newTet;
    }

    return tet;
}

function drawTetromino(id, x, y, rotation=0, fieldWrite=false) {
    const tet = rotatedTetromino(id, rotation);

    for (let py = 0; py < tet.length; py++) {
        for (let px = 0; px < tet[py].length; px++) {
            if (tet[py][px] === " ") continue;

            if (fieldWrite) {
                tiles[y + py][x + px] = id + 1;
            } else {
                renderBrick(x + px, y + py, id + 1);
            }
        }
    }
}

function checkCollision(id, x, y, rotation) {
    if (y > sizeY) return true;
    if (x < 0) return true;
    const tet = rotatedTetromino(id, rotation);

    for (let py = 0; py < tet.length; py++) {
        for (let px = 0; px < tet[py].length; px++) {
            if (tet[py][px] === " ") continue;
            if (tiles[y + py] === undefined) return true;
            if (tiles[y + py][x + px] === undefined) return true;
            if (tiles[y + py][x + px]) return true;
        }
    }
    return false;
}

function renderTiles() {
    for (let x = 0; x < sizeX; x++) {
        for (let y = 0; y < sizeY; y++) {
            renderBrick(x, y, tiles[y][x]);
        }
    }

    drawTetromino(currentPiece.id, currentPiece.x, currentPiece.y, currentPiece.rotation, false);
}


function checkLines() {
    for (let i = tiles.length - 1; i >= 0; i--) {
        if (tiles[i].length !== tiles[i].filter(x => !!x).length) continue;
        console.log("WHAT");

        for (let y = i; y >= 1; y--) {
            tiles[y] = tiles[y - 1];
        }
        tiles[0] = tiles[0].map(x => 0);
    }
}

let gameTTL = setTTL;
function gameStep() {
    if (gameTTL <= 0) {
        gameTTL = setTTL;

        drawTetromino(currentPiece.id, currentPiece.x, currentPiece.y, currentPiece.rotation, true);

        currentPiece.id = Math.floor(Math.random() * tetromino.length);
        currentPiece.x = 1;
        currentPiece.y = 0;
        currentPiece.rotation = 0;

        checkLines();
        renderTiles();
        return;
    }

    if (checkCollision(currentPiece.id, currentPiece.x, currentPiece.y + 1, currentPiece.rotation)) {
        if (currentPiece.y < 0) alert("DONE");
        gameTTL -= 1;
        renderTiles();
        return;
    }

    currentPiece.y++;
    renderTiles();
}

renderTiles();

let interval = setInterval(gameStep, 200);

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
        case "w":
        case "arrowup":
            currentPiece.rotation += 1;
            break;
    }

    gameTTL = setTTL;

    if (!checkCollision(
        currentPiece.id,
        currentPiece.x + positionDelta[0],
        currentPiece.y + positionDelta[1],
        currentPiece.rotation
    )) {
        currentPiece.x += positionDelta[0];
        currentPiece.y += positionDelta[1];
    }

    renderTiles();
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

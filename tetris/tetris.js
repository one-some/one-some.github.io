const canvas = document.getElementById("tetris");
const ctx = canvas.getContext("2d");

canvas.width = 100;
canvas.height = 180;

canvas.style.backgroundColor = "red";

function renderBrick(x, y) {
    x *= 8;
    y *= 8;

    x += 10;
    y += 25;

    console.log(x, y);

    ctx.fillStyle = "#181818";
    ctx.fillRect(x, y, 8, 8);

    ctx.fillStyle = "#00000044";
    ctx.fillRect(x + 7, y, 1, 8);
    ctx.fillRect(x, y + 7, 8, 1);

    ctx.fillStyle = "#ffffff44";
    ctx.fillRect(x, y, 1, 8);
    ctx.fillRect(x, y, 8, 1);
}

for (let x=0; x < 10; x++) {
    for (let y=0; y < 18; y++) {
        renderBrick(x, y);
    }
}

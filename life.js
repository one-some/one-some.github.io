const lifeCanvas = document.getElementById("life");
const lCtx = lifeCanvas.getContext("2d");

lifeCanvas.width = 300;
lifeCanvas.height = 300;

let angle = 0;
let velocity = 0;

lCtx.strokeStyle = "red";

function lDraw() {
    lCtx.clearRect(0, 0, 300, 300);

    lCtx.beginPath();
    lCtx.moveTo(150, 150);

    let force = (Math.PI / 2) - angle;
    force /= Math.abs(force);
    force /= 80.0;

    angle += velocity;

    velocity += force;
    velocity = Math.max(-0.2, Math.min(0.2, velocity));

    const x = Math.cos(angle) * 100.0;
    const y = Math.sin(angle) * 100.0;

    lCtx.lineTo(150 + x, 150 + y);

    lCtx.stroke();

    window.requestAnimationFrame(lDraw);
}

lDraw();

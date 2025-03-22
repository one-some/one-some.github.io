const draggingInfo = {
    el: null,
    offsetX: 0,
    offsetY: 0,
    clientX: 0,
    clientY: 0,
};

document.addEventListener("mousedown", function(event) {
    if (event.target.tagName !== "WIN-TITLE") return;
    event.preventDefault();

    draggingInfo.el = event.target.parentElement;
    const rect = draggingInfo.el.getBoundingClientRect();
    draggingInfo.offsetX = draggingInfo.clientX - rect.left;
    draggingInfo.offsetY = draggingInfo.clientY - rect.top;
});

document.addEventListener("mouseup", function() {
    draggingInfo.el = null;
});

document.addEventListener("mousemove", function(event) {
    draggingInfo.clientX = event.clientX;
    draggingInfo.clientY = event.clientY;

    if (!draggingInfo.el) return;
    window.requestAnimationFrame(anim);
});

function anim() {
    if (!draggingInfo.el) return;

    draggingInfo.el.style.left = `${draggingInfo.clientX - draggingInfo.offsetX}px`;
    draggingInfo.el.style.top = `${draggingInfo.clientY - draggingInfo.offsetY}px`;
}


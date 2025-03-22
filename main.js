const draggingInfo = {
    el: null,
    offsetX: 0,
    offsetY: 0,
};

document.addEventListener("mousedown", function(event) {
    if (event.target.tagName !== "WIN-TITLE") return;

    draggingInfo.el = event.target.parentElement;
    draggingInfo.offsetX = null;

    event.preventDefault();
});

document.addEventListener("mouseup", function() {
    draggingInfo.el = null;
});

document.addEventListener("mousemove", function(event) {
    if (!draggingInfo.el) return;

    if (draggingInfo.offsetX === null) {
        // New element, need to init offsets.
        const rect = draggingInfo.el.getBoundingClientRect();
        draggingInfo.offsetX = event.clientX - rect.left;
        draggingInfo.offsetY = event.clientY - rect.top;
    }

    draggingInfo.el.style.left = `${event.clientX - draggingInfo.offsetX}px`;
    draggingInfo.el.style.top = `${event.clientY - draggingInfo.offsetY}px`;
});
/* ------------------ Control Buttons -------------------- */
function moveUp() { planet.vy = -speed; }
function moveDown() { planet.vy =  speed; }
function moveLeft() { planet.vx = -speed; }
function moveRight() { planet.vx =  speed; }
function stopX() { planet.vx = 0; }
function stopY() { planet.vy = 0; }

/* Helper: Add PC + Mobile events together */
function addControl(btn, startFn, stopFn) {
    const el = document.querySelector(btn);

    // PC events
    el.addEventListener("mousedown", startFn);
    el.addEventListener("mouseup", stopFn);
    el.addEventListener("mouseleave", stopFn);

    // Mobile events
    el.addEventListener("touchstart", (e) => {
        e.preventDefault();  // to stop double-touch issues
        startFn();
    });
    el.addEventListener("touchend", (e) => {
        e.preventDefault();
        stopFn();
    });
}

addControl(".up", moveUp, stopY);
addControl(".down", moveDown, stopY);
addControl(".left", moveLeft, stopX);
addControl(".right", moveRight, stopX);
/* ------------------ Control Buttons -------------------- */

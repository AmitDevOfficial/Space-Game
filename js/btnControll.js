/* ------------------ Control Buttons -------------------- */
function moveUp() { planet.vy = -speed; }
function moveDown() { planet.vy =  speed; }
function moveLeft() { planet.vx = -speed; }
function moveRight() { planet.vx =  speed; }
function stopX() { planet.vx = 0; }
function stopY() { planet.vy = 0; }

document.querySelector(".up").addEventListener("mousedown", moveUp);
document.querySelector(".down").addEventListener("mousedown", moveDown);
document.querySelector(".left").addEventListener("mousedown", moveLeft);
document.querySelector(".right").addEventListener("mousedown", moveRight);

document.querySelector(".up").addEventListener("mouseup", stopY);
document.querySelector(".down").addEventListener("mouseup", stopY);
document.querySelector(".left").addEventListener("mouseup", stopX);
document.querySelector(".right").addEventListener("mouseup", stopX);
/* ------------------ Control Buttons -------------------- */

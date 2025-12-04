const joystick = document.getElementById("joystick");
const stick = document.getElementById("stick");

let joyActive = false;
let centerX, centerY;

joystick.addEventListener("touchstart", (e) => {
    joyActive = true;
    const rect = joystick.getBoundingClientRect();
    centerX = rect.left + rect.width / 2;
    centerY = rect.top + rect.height / 2;
});

joystick.addEventListener("touchmove", (e) => {
    if (!joyActive) return;

    const touch = e.touches[0];
    const dx = touch.clientX - centerX;
    const dy = touch.clientY - centerY;

    const distance = Math.min(40, Math.sqrt(dx*dx + dy*dy));
    const angle = Math.atan2(dy, dx);

    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;

    stick.style.transform = `translate(${x}px, ${y}px)`;

    // ---- Movement control send to your game ----
    if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 10) moveRight();
        else if (dx < -10) moveLeft();
    } else {
        if (dy > 10) moveDown();
        else if (dy < -10) moveUp();
    }
});

joystick.addEventListener("touchend", () => {
    joyActive = false;
    stick.style.transform = `translate(0,0)`;
});


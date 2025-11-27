function enableFullScreen() {
    const canvas = document.getElementById("gameCanvas");

    if (canvas.requestFullscreen) {
        canvas.requestFullscreen();
    } else if (canvas.webkitRequestFullscreen) {
        canvas.webkitRequestFullscreen(); // Safari
    } else if (canvas.msRequestFullscreen) {
        canvas.msRequestFullscreen();
    }
}

function checkOrientation() {
    const isPortrait = window.innerHeight > window.innerWidth;
    const rotateWarning = document.getElementById("rotateWarning");
    const gameCanvas = document.getElementById("gameCanvas");

    if (isPortrait) {
        rotateWarning.style.display = "flex";
        gameCanvas.style.display = "none";
    } else {
        rotateWarning.style.display = "none";
        gameCanvas.style.display = "block";

        // User ke first touch par fullscreen
        canvas.addEventListener("touchstart", enableFullScreen, { once: true });
        canvas.addEventListener("click", enableFullScreen, { once: true });
    }
}

window.addEventListener("resize", checkOrientation);
checkOrientation();

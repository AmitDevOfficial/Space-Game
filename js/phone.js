function enterFullScreen() {
    const body = document.body;

    if (body.requestFullscreen) body.requestFullscreen();
    else if (body.webkitRequestFullscreen) body.webkitRequestFullscreen();
    else if (body.msRequestFullscreen) body.msRequestFullscreen();
}




// function checkOrientation() {
//     const isPortrait = window.innerHeight > window.innerWidth;
//     const rotateWarning = document.getElementById("rotateWarning");
//     const fullscreenBtn = document.getElementById("fullscreenBtn");

//     if (isPortrait) {
//         rotateWarning.style.display = "flex";
//         fullscreenBtn.style.display = "none";
//     } else {
//         rotateWarning.style.display = "none";
//         fullscreenBtn.style.display = "block";

//         fullscreenBtn.addEventListener("click", enterFullScreen, { once: true });
//         fullscreenBtn.addEventListener("touchend", enterFullScreen, { once: true });
//     }
// }

let gameStarted = false;  // <-- add this

function checkOrientation() {
    const isPortrait = window.innerHeight > window.innerWidth;
    const rotateWarning = document.getElementById("rotateWarning");
    const fullscreenBtn = document.getElementById("fullscreenBtn");

    if (isPortrait) {
        rotateWarning.style.display = "flex";
        fullscreenBtn.style.display = "none";

        // GAME LOCK in portrait
        gameStarted = false;

    } else {
        rotateWarning.style.display = "none";
        fullscreenBtn.style.display = "block";

        fullscreenBtn.addEventListener("click", enterFullScreen, { once: true });
        fullscreenBtn.addEventListener("touchend", enterFullScreen, { once: true });

        // Start the game only once
        if (!gameStarted) {
            gameStarted = true;
            resetGame();  // <-- YAHAN GAME START KAR
        }
    }
}

window.addEventListener("resize", checkOrientation);
window.addEventListener("orientationchange", checkOrientation);
window.addEventListener("load", checkOrientation);
// checkOrientation();

function enterFullScreen() {
    const body = document.body;

    if (body.requestFullscreen) body.requestFullscreen();
    else if (body.webkitRequestFullscreen) body.webkitRequestFullscreen();
    else if (body.msRequestFullscreen) body.msRequestFullscreen();
}

function checkOrientation() {
    const isPortrait = window.innerHeight > window.innerWidth;
    const rotateWarning = document.getElementById("rotateWarning");
    const fullscreenBtn = document.getElementById("fullscreenBtn");

    if (isPortrait) {
        rotateWarning.style.display = "flex";
        fullscreenBtn.style.display = "none";
    } else {
        rotateWarning.style.display = "none";
        fullscreenBtn.style.display = "block";

        fullscreenBtn.addEventListener("click", enterFullScreen, { once: true });
        fullscreenBtn.addEventListener("touchend", enterFullScreen, { once: true });
    }
}

window.addEventListener("resize", checkOrientation);
checkOrientation();

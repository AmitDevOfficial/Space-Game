function goFullScreen() {
    const canvas = document.getElementById("gameCanvas");

    // Sab browsers ke liye support
    if (canvas.requestFullscreen) {
        canvas.requestFullscreen();
    } 
    else if (canvas.webkitRequestFullscreen) {
        canvas.webkitRequestFullscreen(); // iPhone Safari
    }
    else if (canvas.msRequestFullscreen) {
        canvas.msRequestFullscreen();
    }
}

function checkOrientation() {
    const isPortrait = window.innerHeight > window.innerWidth;
    const rotateWarning = document.getElementById("rotateWarning");
    const canvas = document.getElementById("gameCanvas");

    if (isPortrait) {
        rotateWarning.style.display = "flex";
        canvas.style.display = "none";
    } else {
        rotateWarning.style.display = "none";
        canvas.style.display = "block";

        // First touch → fullscreen
        canvas.addEventListener("touchend", goFullScreen, { once: true });
        canvas.addEventListener("click", goFullScreen, { once: true });
    }
}

window.addEventListener("resize", checkOrientation);
checkOrientation();

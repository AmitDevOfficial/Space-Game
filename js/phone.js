function goFullScreen() {
    const wrapper = document.getElementById("gameWrapper");

    if (wrapper.requestFullscreen) {
        wrapper.requestFullscreen();
    } else if (wrapper.webkitRequestFullscreen) {
        wrapper.webkitRequestFullscreen();
    } else if (wrapper.msRequestFullscreen) {
        wrapper.msRequestFullscreen();
    }
}


function checkOrientation() {
    const isPortrait = window.innerHeight > window.innerWidth;
    const rotateWarning = document.getElementById("rotateWarning");
    const wrapper = document.getElementById("gameWrapper");

    if (isPortrait) {
        rotateWarning.style.display = "flex";
        wrapper.style.display = "none";
    } else {
        rotateWarning.style.display = "none";
        wrapper.style.display = "block";

        wrapper.addEventListener("touchend", goFullScreen, { once: true });
        wrapper.addEventListener("click", goFullScreen, { once: true });
    }
}

window.addEventListener("resize", checkOrientation);
checkOrientation();


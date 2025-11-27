        function checkOrientation() {
    const isPortrait = window.innerHeight > window.innerWidth;

    const canvas = document.getElementById("gameCanvas");

    if (isPortrait) {
        canvas.style.display = "none"; // Gameplay hide
        // Optionally: Pause game loop here
    } else {
        canvas.style.display = "block"; // Gameplay visible
        // Optionally: Resume game loop here
    }
}

window.addEventListener("resize", checkOrientation);
window.addEventListener("orientationchange", checkOrientation);

checkOrientation();
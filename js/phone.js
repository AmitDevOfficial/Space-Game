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
    }
}

// Resize se hamesha fire hota hai (LOCK on ho tab bhi)
window.addEventListener("resize", checkOrientation);

// Page load pe bhi check karo
checkOrientation();

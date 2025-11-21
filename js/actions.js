const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const restartBtn = document.getElementById("restartBtn");

// --------- Background Music ---------
const bgMusic = new Audio("./sound/space-music.mp3");
bgMusic.loop = true;
bgMusic.volume = 0.4;

// --------- blast Music ---------
const blastSound = new Audio("./sound/over.mp3");
blastSound.volume = 0.9;

let firstPlay = false;

function enableBGSound() {
    if (!firstPlay) {
        bgMusic.play().catch(() => {});
        firstPlay = true;
    }
}

window.addEventListener("click", enableBGSound);
window.addEventListener("keydown", enableBGSound);



let rocketOutline = [];   // Final pixel outline


/* ---------------------------------------------------
    GET PIXEL-BASED OUTLINE FROM ROCKET IMAGE
------------------------------------------------------*/
function getImageOutline(image, w, h) {
    let temp = document.createElement("canvas");
    temp.width = w;
    temp.height = h;
    let tctx = temp.getContext("2d");

    tctx.drawImage(image, 0, 0, w, h);
    let imgData = tctx.getImageData(0, 0, w, h);
    let pixels = imgData.data;
    let outline = [];

    for (let y = 1; y < h - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
            let i = (y * w + x) * 4;
            let alpha = pixels[i + 3];

            if (alpha < 20) continue; // transparent skip

            let neighbors = [
                ((y - 1) * w + x) * 4 + 3,
                ((y + 1) * w + x) * 4 + 3,
                (y * w + (x - 1)) * 4 + 3,
                (y * w + (x + 1)) * 4 + 3
            ];

            for (let n of neighbors) {
                if (pixels[n] < 20) {
                    outline.push({ x, y });
                    break;
                }
            }
        }
    }
    return outline;
}


/* ---------------------------------------------------
    CANVAS SIZE
------------------------------------------------------*/
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);


/* ---------------------------------------------------
    GAME VARIABLES
------------------------------------------------------*/
let planet;
let asteroids;
let gameOver;
let win;
let speed = 1.7;


/* ---------------------------------------------------
    LOAD ROCKET IMAGE
------------------------------------------------------*/
const shipImg = new Image();
shipImg.onload = () => {
    rocketOutline = getImageOutline(shipImg, 100, 80);
};
shipImg.src = "./media/rocket.png";


/* ---------------------------------------------------
    RESET GAME
------------------------------------------------------*/
function resetGame() {
    planet = {
        x: 80,
        y: canvas.height / 2,
        vx: 0,
        vy: 0
    };

    asteroids = [];
    gameOver = false;
    win = false;
    restartBtn.style.display = "none";

    createAsteroids(5);
    setTimeout(() => increaseAsteroids(), 5000);
    bgMusic.play().catch(() => {});
    animate();
}


/* ---------------------------------------------------
    ASTEROIDS
------------------------------------------------------*/
function createAsteroids(count) {
    for (let i = 0; i < count; i++) {
        asteroids.push({
            x: canvas.width + Math.random() * 400,
            y: Math.random() * canvas.height,
            r: Math.random() * 30 + 15,
            speed: Math.random() * 4 + 1.5,
            angle: Math.random() * Math.PI * 2,
            zigzag: Math.random() * 2,
            color: "red"
        });
    }
}

function increaseAsteroids() {
    if (gameOver || win) return;
    createAsteroids(4);
    setTimeout(() => increaseAsteroids(), 6000);
}


/* ---------------------------------------------------
    CONTROLS
------------------------------------------------------*/
window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp") planet.vy = -speed;
    if (e.key === "ArrowDown") planet.vy = speed;
    if (e.key === "ArrowLeft") planet.vx = -speed;
    if (e.key === "ArrowRight") planet.vx = speed;
});
window.addEventListener("keyup", (e) => {
    if (["ArrowUp", "ArrowDown"].includes(e.key)) planet.vy = 0;
    if (["ArrowLeft", "ArrowRight"].includes(e.key)) planet.vx = 0;
});


/* ---------------------------------------------------
    UPDATE PLAYER (ROCKET)
------------------------------------------------------*/
function updatePlanet() {
    planet.x += planet.vx;
    planet.y += planet.vy;

    if (planet.x < 20) planet.x = 20;
    if (planet.y < 20) planet.y = 20;
    if (planet.x > canvas.width - 20) planet.x = canvas.width - 20;
    if (planet.y > canvas.height - 20) planet.y = canvas.height - 20;
}


/* ---------------------------------------------------
    DRAW ROCKET + OUTLINE
------------------------------------------------------*/
function drawPlanet() {
    ctx.drawImage(shipImg, planet.x - 40, planet.y - 40, 100, 80);

    ctx.fillStyle = "cyan";
    rocketOutline.forEach(p => {
        ctx.fillRect(planet.x - 40 + p.x, planet.y - 40 + p.y, 1.5, 1.5);
    });
}


/* ---------------------------------------------------
    DRAW ASTEROIDS
------------------------------------------------------*/
function drawAsteroids() {
    asteroids.forEach(a => {
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
        ctx.fillStyle = a.color;
        ctx.fill();

        a.x -= a.speed;
        a.y += Math.sin(a.angle) * a.zigzag;
        a.angle += 0.05;

        if (a.x < -100) {
            a.x = canvas.width + Math.random() * 500;
            a.y = Math.random() * canvas.height;
        }
    });
}


/* ---------------------------------------------------
    REMOVE OLD COLLISION (FAKE)
------------------------------------------------------*/
function checkCollision() {
    if (planet.x > canvas.width - 80) {
        win = true;
    }
}


/* ---------------------------------------------------
    REAL ROCKET OUTLINE COLLISION
------------------------------------------------------*/
function checkRocketCollision() {
    for (let a of asteroids) {
        for (let p of rocketOutline) {

            const px = planet.x - 40 + p.x;
            const py = planet.y - 40 + p.y;

            const dx = px - a.x;
            const dy = py - a.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < a.r) {

                // 🔥 Play blast sound
                blastSound.currentTime = 0;
                blastSound.play();

                // 🔇 Stop background music
                bgMusic.pause();

                gameOver = true;
                return;
            }
        }
    }
}



/* ---------------------------------------------------
    MAIN GAME LOOP
------------------------------------------------------*/
function animate() {
    if (gameOver || win) {
        ctx.fillStyle = "white";
        ctx.font = "50px Arial";
        ctx.fillText(
            gameOver ? "GAME OVER" : "YOU WIN!",
            canvas.width / 2 - 120,
            canvas.height / 2
        );
        restartBtn.style.display = "block";
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    updatePlanet();
    drawPlanet();
    drawAsteroids();
    checkCollision();
    checkRocketCollision();

    requestAnimationFrame(animate);
}

restartBtn.addEventListener("click", resetGame);

resetGame();

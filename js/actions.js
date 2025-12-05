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


const catchSound = new Audio("./sound/reload.mp3");
catchSound.volume = 0.8;


// --------- bullet sound ----------
const bulletSound = new Audio("./sound/gun.wav");
bulletSound.volume = 0.2;

let firstPlay = false;
function enableBGSound() {
    if (!firstPlay) {
        bgMusic.play().catch(() => { });
        firstPlay = true;
    }
}
window.addEventListener("click", enableBGSound);
window.addEventListener("keydown", enableBGSound);

// --------- game / bullets state ----------
// play catch sound
catchSound.currentTime = 0;
catchSound.play();

// refill bullets
bulletsCount = 30;
bulletPowerUp = null;

let bullets = [];
let lastShot = 0;
let shotDelay = 200; // ms

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


function drawBulletBarHorizontal() {
    let maxBullets = 30;
    let barWidth = 250;   // total width of bar
    let barHeight = 18;   // thickness of bar

    let percent = bulletsCount / maxBullets;
    let filled = barWidth * percent;

    // Color logic
    let color = "green";
    if (percent <= 0.70 && percent > 0.30) color = "yellow";
    if (percent <= 0.30) color = "red";

    // Bar outline
    ctx.strokeStyle = "white";
    ctx.lineWidth = 3;
    ctx.strokeRect(20, 20, barWidth, barHeight);

    // Filled bar
    ctx.fillStyle = color;
    ctx.fillRect(20, 20, filled, barHeight);

    // Text
    ctx.fillStyle = "white";
    ctx.font = "16px Arial";
    ctx.fillText(`${bulletsCount}/${maxBullets}`, 20, 60);
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


let hitboxScale;
let maxAsteroids;
const screenWidth = window.visualViewport.width;

// setTimeout(() => {
    if (screenWidth < 600) {
        maxAsteroids = 10;   // Mobile → Medium
        asteroidBaseRadius = 15;
        rocketWidth = 60;
        rocketHeight = 40;
        speedFactor = 0.35;
        hitboxScale = 0.4; 
    } else {
        maxAsteroids = 25;   // PC → Hard
        asteroidBaseRadius = 30;
        rocketWidth = 100;
        rocketHeight = 80;
        speedFactor = 1;
        hitboxScale = 1;     
    }
// }, 50);


/* ---------------------------------------------------
    GAME VARIABLES
------------------------------------------------------*/
let planet;
let asteroids;
let gameOver;
let win;
let speed = 1.7 * speedFactor;

/* ---------------------------------------------------
    LOAD ROCKET IMAGE
------------------------------------------------------*/
const shipImg = new Image();
// Rocket outline banate waqt:
shipImg.onload = () => {
    rocketOutline = getImageOutline(shipImg, rocketWidth, rocketHeight);
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

    // reset bullets and powerup
    bullets = [];
    bulletsCount = 0;
    bulletPowerUp = null;

    createAsteroids(3);
    setTimeout(() => increaseAsteroids(), 5000);

    spawnBulletPackage(); // ensure a package exists at start

    bgMusic.play().catch(() => { });
    animate();
}


function increaseAsteroids() {
    if (gameOver || win) return;

    let addCount;
    let delay;

    if (screenWidth < 600) {
        // 📱 Mobile = Medium Mode
        addCount = 2;       // ek baar me 2 asteroids
        delay = 9000;       // 9 sec me new asteroids
    } else {
        // 💻 PC = Hard Mode
        addCount = 5;       // ek baar me 5 asteroids
        delay = 5000;       // 5 sec me new asteroids
    }

    createAsteroids(addCount);
    setTimeout(increaseAsteroids, delay);
}


/* ---------------------------------------------------
    ASTEROIDS
------------------------------------------------------*/
function createAsteroids(count) {
    for (let i = 0; i < count; i++) {

        // ⭐ Ye most important line — asteroid limit
        if (asteroids.length >= maxAsteroids) return;

        asteroids.push({
            x: canvas.width + Math.random() * 400,
            y: Math.random() * canvas.height,
            r: Math.random() * asteroidBaseRadius + asteroidBaseRadius / 2, // chhota ya bada radius
            speed: (Math.random() * 4 + 1.5) * speedFactor,  // speed bhi scale hogi
            angle: Math.random() * Math.PI * 2,
            zigzag: Math.random() * 2,
            color: "red",
            hit: 0
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
const fireBtn = document.getElementById("fireBtn");

// mobile ke liye
fireBtn.addEventListener("touchstart", () => {
    shootBullet();
});

// PC ke liye
fireBtn.addEventListener("mousedown", () => {
    shootBullet();
});


function shootBullet() {
    const now = Date.now();
    if (now - lastShot > shotDelay && bulletsCount > 0) {

        bulletSound.currentTime = 0;
        bulletSound.play();

        bullets.push({
            x: planet.x + 40,
            y: planet.y,
            speed: 10,
            w: 22,
            h: 6
        });

        bulletsCount--;
        lastShot = now;
    }
}



window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp") planet.vy = -speed;
    if (e.key === "ArrowDown") planet.vy = speed;
    if (e.key === "ArrowLeft") planet.vx = -speed;
    if (e.key === "ArrowRight") planet.vx = speed;

    // shooting on 'A' only if bullets available and cooldown passed
   if (e.key === "a" || e.key === "A") {
    shootBullet();   // ← yahi call karega bullet fire
   }

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
    ctx.drawImage(shipImg, planet.x - rocketWidth / 2, planet.y - rocketHeight / 2, rocketWidth, rocketHeight);

    ctx.fillStyle = "cyan";
    rocketOutline.forEach(p => {
        ctx.fillRect(planet.x - rocketWidth / 2 + p.x, planet.y - rocketHeight / 2 + p.y, 1.5, 1.5);
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
            a.hit = 0;
        }
    });
}

/* ---------------------------------------------------
    BULLETS: DRAW + UPDATE
------------------------------------------------------*/
function drawBullets() {
    // iterate backwards to safely splice
    for (let i = bullets.length - 1; i >= 0; i--) {
        const b = bullets[i];
        ctx.fillStyle = "yellow";
        ctx.fillRect(b.x, b.y - b.h / 2, b.w, b.h);

        b.x += b.speed;

        if (b.x > canvas.width + 50) {
            bullets.splice(i, 1);
        }
    }
}

/* ---------------------------------------------------
    BULLET PACKAGE (power-up)
------------------------------------------------------*/
function spawnBulletPackage() {
    bulletPowerUp = {
        x: canvas.width + 100,
        y: Math.random() * canvas.height,
        r: 20,
        speed: 2
    };
}

function drawBulletPackage() {
    if (!bulletPowerUp) return;

    ctx.beginPath();
    ctx.fillStyle = "gold";
    ctx.arc(bulletPowerUp.x, bulletPowerUp.y, bulletPowerUp.r, 0, Math.PI * 2);
    ctx.fill();

    // small shine
    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.fillRect(bulletPowerUp.x - 6, bulletPowerUp.y - 6, 4, 4);

    bulletPowerUp.x -= bulletPowerUp.speed;

    if (bulletPowerUp.x < -50) {
        spawnBulletPackage();
    }
}

function checkBulletPackageCollision() {
    if (!bulletPowerUp) return;

    const dx = planet.x - bulletPowerUp.x;
    const dy = planet.y - bulletPowerUp.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < bulletPowerUp.r + 30) {

        // 🔊 Catch sound
        catchSound.currentTime = 0;
        catchSound.play();

        // 🎁 Give 30 bullets
        bulletsCount = 30;
        bulletPowerUp = null;

        // ⏳ Next package spawn after 5 sec
        setTimeout(() => {
            spawnBulletPackage();
        }, 5000);
    }
}


/* ---------------------------------------------------
    BULLET vs ASTEROID COLLISION
------------------------------------------------------*/
function checkBulletCollision() {
    // iterate bullets backwards and asteroids normally (we can splice asteroids safely too)
    for (let bi = bullets.length - 1; bi >= 0; bi--) {
        const b = bullets[bi];
        for (let ai = asteroids.length - 1; ai >= 0; ai--) {
            const a = asteroids[ai];
            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < a.r) {
                a.hit = (a.hit || 0) + 1;

                // thresholds: big 5, small 2 (you had larger numbers; adjust if you want)
                const bigThresh = 5;
                const smallThresh = 2;
                if ((a.r > 25 && a.hit >= bigThresh) || (a.r <= 25 && a.hit >= smallThresh)) {
                    asteroids.splice(ai, 1);
                }

                bullets.splice(bi, 1); // remove bullet and break inner loop
                break;
            }
        }
    }
}

/* ---------------------------------------------------
    COLLISIONS: ROCKET vs ASTEROID (outline)
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
                blastSound.currentTime = 0;
                blastSound.play();
                bgMusic.pause();
                gameOver = true;
                return;
            }
        }
    }
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

    // bullets & collisions
    drawBullets();
    checkBulletCollision();

    // powerup
    drawBulletPackage();
    checkBulletPackageCollision();

    drawBulletBarHorizontal();


    checkCollision();
    checkRocketCollision();

    planet.x += joystickX * speed;
    planet.y += joystickY * speed;

    // draw ammo count for debug
    ctx.fillStyle = "white";
    ctx.font = "16px Arial";
    ctx.fillText("Ammo: " + bulletsCount, 10, 20);

    requestAnimationFrame(animate);
}

restartBtn.addEventListener("click", resetGame);

// start
resetGame();

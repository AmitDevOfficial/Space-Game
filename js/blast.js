let blastingAsteroids = [];
let blastParticles = [];

// spawn 1 blasting asteroid every 5 sec
setInterval(() => {
    blastingAsteroids.push({
        x: canvas.width + 200,
        y: Math.random() * canvas.height,
        r: 30,
        speed: 2,
        rotate: 0,
    });
}, 5000);

// update asteroid movement
function updateBlastingAsteroids(delta) {
    blastingAsteroids.forEach((a) => {
        a.x -= a.speed * delta;
        a.rotate += 0.07 * delta;
    });

    blastingAsteroids = blastingAsteroids.filter(a => a.x > -200);
}

// draw asteroid with rotation
function drawBlastingAsteroids() {
    blastingAsteroids.forEach(a => {
        ctx.save();
        ctx.translate(a.x, a.y);
        ctx.rotate(a.rotate);
        ctx.fillStyle = "#ff7722";

        ctx.beginPath();
        ctx.arc(0, 0, a.r, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    });

    drawBlastParticles();
}

// when bullet hits asteroid
function triggerAsteroidBlast(x, y) {
    for (let i = 0; i < 25; i++) {
        blastParticles.push({
            x,
            y,
            vx: (Math.random() - 0.5) * 6,
            vy: (Math.random() - 0.5) * 6,
            size: Math.random() * 4 + 2,
            life: 40
        });
    }
}

// particle animation
function drawBlastParticles() {
    for (let i = blastParticles.length - 1; i >= 0; i--) {
        let p = blastParticles[i];

        p.x += p.vx;
        p.y += p.vy;
        p.life--;

        ctx.fillStyle = "orange";
        ctx.fillRect(p.x, p.y, p.size, p.size);

        if (p.life <= 0) {
            blastParticles.splice(i, 1);
        }
    }
}

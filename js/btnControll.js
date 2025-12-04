 let joystickX = 0;
        let joystickY = 0;

        const joystick = document.getElementById("joystick");
        const stick = document.getElementById("stick");

        let active = false;
        let centerX = 0;
        let centerY = 0;

        joystick.addEventListener("touchstart", (e) => {
            active = true;
            const rect = joystick.getBoundingClientRect();
            centerX = rect.left + rect.width / 2;
            centerY = rect.top + rect.height / 2;
        });

        joystick.addEventListener("touchmove", (e) => {
            if (!active) return;

            const touch = e.touches[0];

            const dx = touch.clientX - centerX;
            const dy = touch.clientY - centerY;

            const maxDist = 40;
            const dist = Math.min(maxDist, Math.sqrt(dx * dx + dy * dy));
            const angle = Math.atan2(dy, dx);

            // joystick graphic
            stick.style.transform = `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px)`;

            // normalized values -1 to +1
            joystickX = (Math.cos(angle) * dist) / maxDist;
            joystickY = (Math.sin(angle) * dist) / maxDist;
        });

        joystick.addEventListener("touchend", () => {
            active = false;
            stick.style.transform = `translate(0px, 0px)`;
            joystickX = 0;
            joystickY = 0;
        });
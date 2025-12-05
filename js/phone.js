const fullscreenBtn = document.getElementById("fullscreenBtn");

        fullscreenBtn.addEventListener("click", () => {
            const docEl = document.documentElement;

            if (docEl.requestFullscreen) {
                docEl.requestFullscreen();
            } else if (docEl.webkitRequestFullscreen) {
                docEl.webkitRequestFullscreen();
            } else if (docEl.msRequestFullscreen) {
                docEl.msRequestFullscreen();
            }

            fullscreenBtn.classList.add('hidden');
        });

        document.addEventListener('fullscreenchange', () => {
            if (!document.fullscreenElement) {
                fullscreenBtn.classList.remove('hidden');
            }
        });


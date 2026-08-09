
document.querySelectorAll("audio").forEach(audio => {
    audio.addEventListener("play", function () {
        document.querySelectorAll("audio").forEach(other => {
            if (other !== this) {
                other.pause();
                other.currentTime = 0;
            }
        });
    });
});

// ---------------------------------------------
// Όταν πατώ play τότε stop σε όλα τα άλα mp3
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

// ---------------------------------------------
// Μέγεθος γραμματοσειράς

const increaseButton = document.getElementById("increaseFont");
const decreaseButton = document.getElementById("decreaseFont");

let fontSize = localStorage.getItem("fontSize");

if (fontSize === null) {
fontSize = 22;
}

document.body.style.fontSize = fontSize + "px";

increaseButton.addEventListener("click", function () {
fontSize = Number(fontSize) + 2;
document.body.style.fontSize = fontSize + "px";
localStorage.setItem("fontSize", fontSize);
});

decreaseButton.addEventListener("click", function () {
fontSize = Number(fontSize) - 2;
document.body.style.fontSize = fontSize + "px";
localStorage.setItem("fontSize", fontSize);
});

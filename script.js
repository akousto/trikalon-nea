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

// ---------------------------------------------
// Πάτημα στον τίτλο → αναπαραγωγή του MP3

// ---------------------------------------------
// Πάτημα στον τίτλο → αναπαραγωγή του MP3

document.body.style.fontSize = fontSize + "px";
localStorage.setItem("fontSize", fontSize);
});

// ---------------------------------------------
// Πάτημα στον τίτλο → play / stop

document.querySelectorAll(".audio-title").forEach(title => {

    title.addEventListener("click", function () {

        const article = this.closest("article");
        const audio = article.querySelector("audio");

        // Αν αυτό το MP3 παίζει ήδη → STOP
        if (!audio.paused) {
            audio.pause();
            audio.currentTime = 0;
            this.classList.remove("playing");
            return;
        }

        // Σταματάμε οποιοδήποτε άλλο MP3
        document.querySelectorAll("audio").forEach(other => {
            other.pause();
            other.currentTime = 0;
        });

        // Επαναφέρουμε όλους τους τίτλους
        document.querySelectorAll(".audio-title").forEach(otherTitle => {
            otherTitle.classList.remove("playing");
        });

        // Παίζουμε το συγκεκριμένο MP3
        audio.play();
        this.classList.add("playing");

        // Όταν τελειώσει το MP3
        audio.addEventListener("ended", function () {
            title.classList.remove("playing");
        });
    });

});

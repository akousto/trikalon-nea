
console.log("Το script.js φορτώθηκε");

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
        // Οριζόντια κίνηση πάνω στο άρθρο
        // Μετακίνηση σε οποιοδήποτε σημείο του MP3

        document.querySelectorAll("article").forEach(article => {
            article.addEventListener("touchmove", function (event) {
                const audio = article.querySelector("audio");

                // Λειτουργεί μόνο όταν παίζει το συγκεκριμένο MP3
                if (audio.paused) return;

                // Αν δεν γνωρίζουμε ακόμη τη διάρκεια
                if (!audio.duration) return;
                const touch = event.touches[0];
                const rect = article.getBoundingClientRect();

                // Θέση του δαχτύλου μέσα στο πλαίσιο
                let position = touch.clientX - rect.left;

                // Ποσοστό της οριζόντιας θέσης
                let percentage = position / rect.width;

                // Περιορισμός από 0 έως 1
                percentage = Math.max(0, Math.min(1, percentage));

                // Μετακίνηση στο αντίστοιχο σημείο του MP3
                audio.currentTime = audio.duration * percentage;
            }, { passive: true });
        });


    
    
// ---------------------------------------------
// Πάτημα στον τίτλο → αναπαραγωγή του MP3

// ---------------------------------------------
// Πάτημα στον τίτλο → αναπαραγωγή του MP3

document.body.style.fontSize = fontSize + "px";
localStorage.setItem("fontSize", fontSize);
});

// ---------------------------------------------
// Φόρτωση άρθρων από το articles.json

fetch("articles.json")
    .then(response => response.json())
    .then(articles => {

        const container = document.getElementById("articles");

        articles.forEach(articleData => {

            const article = document.createElement("article");

            const title = document.createElement("h2");
            title.className = "audio-title";
            title.textContent = articleData.title;

            const audio = document.createElement("audio");

            const source = document.createElement("source");
            source.src = articleData.audio;
            source.type = "audio/mpeg";

            audio.appendChild(source);
            article.appendChild(title);
            article.appendChild(audio);

            container.appendChild(article);
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

    });

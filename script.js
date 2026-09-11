console.log("Το script.js φορτώθηκε");

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

// ---------------------------------------------
// Φόρτωση άρθρων από το articles.json

fetch("articles.json")
.then(response => response.json())
.then(articles => {

    const container = document.getElementById("articles");


    // ---------------------------------------------
    // Δημιουργία άρθρων
    articles.forEach(articleData => {
        const article = document.createElement("article");

        // Τίτλος
        const title = document.createElement("h2");
        title.className = "audio-title";
        title.textContent = articleData.title;

        // ---------------------------------------------
        // Μπάρα προόδου
        const progressBar = document.createElement("div");
        progressBar.className = "progress-bar";
        const progress = document.createElement("div");
        progress.className = "progress";
        progressBar.appendChild(progress);

        // ---------------------------------------------
        // Audio
        const audio = document.createElement("audio");
        const source = document.createElement("source");
        source.src = articleData.audio;
        source.type = "audio/mpeg";
        audio.appendChild(source);

        // ---------------------------------------------
        // Προσθήκη στο άρθρο
        article.appendChild(title);
        article.appendChild(progressBar);
        article.appendChild(audio);
        container.appendChild(article);
    });

    // ---------------------------------------------
    // Πάτημα στον τίτλο → play / stop
    document.querySelectorAll(".audio-title").forEach(title => {
        title.addEventListener("click", function () {
            const article = this.closest("article");
            const audio = article.querySelector("audio");

            // ---------------------------------------------
            // Αν αυτό το MP3 παίζει ήδη → STOP
            if (!audio.paused) {
                audio.pause();
                audio.currentTime = 0;
                this.classList.remove("playing");
                article.querySelector(".progress").style.width = "0%";
                return;
            }

            // ---------------------------------------------
            // Σταματάμε οποιοδήποτε άλλο MP3
            document.querySelectorAll("audio").forEach(other => {
                other.pause();
                other.currentTime = 0;
            });

            // ---------------------------------------------
            // Επαναφέρουμε όλους τους τίτλους
            document.querySelectorAll(".audio-title").forEach(otherTitle => {
                otherTitle.classList.remove("playing");
            });

            // ---------------------------------------------
            // Αδειάζουμε όλες τις μπάρες
            document.querySelectorAll(".progress").forEach(otherProgress => {
                otherProgress.style.width = "0%";
            });

            // ---------------------------------------------
            // Παίζουμε το συγκεκριμένο MP3
            audio.play();
            this.classList.add("playing");
        });
    });

    // ---------------------------------------------
    // Ενημέρωση της μπάρας όσο παίζει το MP3
    document.querySelectorAll("audio").forEach(audio => {
        audio.addEventListener("timeupdate", function () {
            const article = this.closest("article");
            const progress = article.querySelector(".progress");
            if (this.duration) {
                const percentage =
                    (this.currentTime / this.duration) * 100;
                progress.style.width = percentage + "%";
            }
        });

        // ---------------------------------------------
        // Όταν τελειώσει το MP3
        audio.addEventListener("ended", function () {
            const article = this.closest("article");
            const title = article.querySelector(".audio-title");
            title.classList.remove("playing");
            article.querySelector(".progress").style.width = "100%";
        });
    });

    // ---------------------------------------------
    // Οριζόντια κίνηση πάνω στο άρθρο
    // Μετακίνηση σε οποιοδήποτε σημείο του MP3
    document.querySelectorAll("article").forEach(article => {
        article.addEventListener("touchmove", function (event) {
            const audio = article.querySelector("audio");

            // Λειτουργεί μόνο όταν παίζει
            // το συγκεκριμένο MP3
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
            percentage = Math.max(
                0,
                Math.min(1, percentage)
            );

            // Μετακίνηση στο αντίστοιχο σημείο του MP3
            audio.currentTime =
                audio.duration * percentage;

            // ---------------------------------------------
            // Ενημέρωση της μπάρας αμέσως
            const progress =
                article.querySelector(".progress");
            progress.style.width =
                (percentage * 100) + "%";
        }, { passive: true });
    });
});
});

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

        // ---------------------------------------------
        // Οριζόντια κίνηση πάνω στο άρθρο
        // Μετακίνηση σε οποιοδήποτε σημείο του MP3

// ---------------------------------------------
// Σύρσιμο δακτύλου πάνω στο άρθρο
// Αριστερά - δεξιά = θέση στο MP3
// Πάνω - κάτω = ένταση ήχου

document.querySelectorAll("article").forEach(article => {

    let startX = 0;
    let startY = 0;

    article.addEventListener("touchstart", function (event) {
        const touch = event.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;
    }, { passive: true });

    article.addEventListener("touchmove", function (event) {
        const audio = article.querySelector("audio");

        // Λειτουργεί μόνο όταν παίζει το συγκεκριμένο MP3
        if (audio.paused) return;
        const touch = event.touches[0];
        const moveX = touch.clientX - startX;
        const moveY = touch.clientY - startY;

        // ---------------------------------------------
        // Αν η κίνηση είναι περισσότερο οριζόντια

        if (Math.abs(moveX) > Math.abs(moveY)) {

            // Αν δεν γνωρίζουμε ακόμη τη διάρκεια
            if (!audio.duration) return;
            const rect = article.getBoundingClientRect();
            let position = touch.clientX - rect.left;
            let percentage = position / rect.width;
            percentage = Math.max(0, Math.min(1, percentage));

            // Μετακίνηση στο MP3
            audio.currentTime = audio.duration * percentage;
        }

        // ---------------------------------------------
        // Αν η κίνηση είναι περισσότερο κατακόρυφη

        else {
            // Πάνω = μεγαλύτερη ένταση
            // Κάτω = μικρότερη ένταση
            const change = -moveY / 300;
            let newVolume = audio.volume + change;

            // Περιορισμός από 0 έως 1
            newVolume = Math.max(0, Math.min(1, newVolume));
            audio.volume = newVolume;

            // Νέα αρχική θέση για ομαλή αλλαγή
            startY = touch.clientY;
        }

    }, { passive: true });
});
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
    });

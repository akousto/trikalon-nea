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


// Αύξηση γραμματοσειράς

increaseButton.addEventListener("click", function () {

    fontSize = Number(fontSize) + 2;

    document.body.style.fontSize = fontSize + "px";

    localStorage.setItem("fontSize", fontSize);

});


// Μείωση γραμματοσειράς

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


            // Audio

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
        // Πάτημα στον τίτλο → PLAY / STOP

        document.querySelectorAll(".audio-title").forEach(title => {

            title.addEventListener("click", function () {

                const article = this.closest("article");

                const audio = article.querySelector("audio");


                // ---------------------------------------------
                // Αν το συγκεκριμένο MP3 παίζει → STOP

                if (!audio.paused) {

                    audio.pause();

                    audio.currentTime = 0;

                    this.classList.remove("playing");

                    return;

                }


                // ---------------------------------------------
                // Σταματάμε όλα τα άλλα MP3

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
                // Παίζουμε το συγκεκριμένο MP3

                audio.play();

                this.classList.add("playing");


                // ---------------------------------------------
                // Όταν τελειώσει το MP3

                audio.addEventListener("ended", function () {

                    title.classList.remove("playing");

                });

            });

        });


        // ---------------------------------------------
        // ΚΙΝΗΣΗ ΔΑΚΤΥΛΟΥ ΠΑΝΩ ΣΤΟ ΑΡΘΡΟ
        //
        // Αριστερά - Δεξιά → θέση στο MP3
        //
        // Πάνω - Κάτω → ένταση ήχου


        document.querySelectorAll("article").forEach(article => {

            let startX = 0;

            let startY = 0;


            // ---------------------------------------------
            // Αρχή αγγίγματος

            article.addEventListener("touchstart", function (event) {

                const touch = event.touches[0];

                startX = touch.clientX;

                startY = touch.clientY;

            }, { passive: true });


            // ---------------------------------------------
            // Κίνηση δακτύλου

            article.addEventListener("touchmove", function (event) {

                const audio = article.querySelector("audio");


                // Λειτουργεί μόνο όταν παίζει το MP3

                if (audio.paused) return;


                const touch = event.touches[0];


                // Πόσο κινήθηκε το δάκτυλο

                const moveX = touch.clientX - startX;

                const moveY = touch.clientY - startY;


                // =============================================
                // ΟΡΙΖΟΝΤΙΑ ΚΙΝΗΣΗ
                // Αριστερά - Δεξιά
                // Αλλαγή θέσης στο MP3

                if (Math.abs(moveX) > Math.abs(moveY)) {


                    // Αν δεν γνωρίζουμε τη διάρκεια

                    if (!audio.duration) return;


                    const rect = article.getBoundingClientRect();


                    // Θέση δακτύλου μέσα στο άρθρο

                    let position = touch.clientX - rect.left;


                    // Ποσοστό

                    let percentage = position / rect.width;


                    // Περιορισμός από 0 έως 1

                    percentage = Math.max(
                        0,
                        Math.min(1, percentage)
                    );


                    // Μετακίνηση στο MP3

                    audio.currentTime =
                        audio.duration * percentage;

                }


                // =============================================
                // ΚΑΤΑΚΟΡΥΦΗ ΚΙΝΗΣΗ
                // Πάνω - Κάτω
                // Αλλαγή έντασης

                else {


                    // Πάνω = αύξηση έντασης
                    // Κάτω = μείωση έντασης

                    const change = -moveY / 300;


                    let newVolume =
                        audio.volume + change;


                    // Περιορισμός έντασης
                    // από 0 έως 1

                    newVolume = Math.max(
                        0,
                        Math.min(1, newVolume)
                    );


                    // Νέα ένταση

                    audio.volume = newVolume;


                    // Νέα αρχική θέση
                    // για ομαλή αλλαγή

                    startY = touch.clientY;

                }


            }, { passive: true });


        });


    })

    .catch(error => {

        console.error(
            "Πρόβλημα στη φόρτωση του articles.json:",
            error
        );

    });

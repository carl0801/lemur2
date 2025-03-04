
import { auth, getAuth, onAuthStateChanged, getDatabase, db, ref, set, push, onChildAdded } from './firebase-config.js';

// Add a new score to the scoreboard
function addScore(gameName, score) {
    onAuthStateChanged(auth, (user) => {
        if (!user) {
        window.location.href = "/"; // Redirect to login if not logged in
        }
        else {
            const username = user.displayName || "Anonymous"; // Fallback if displayName is null
            const scoreRef = ref(db, `scoreboard/${gameName}`);
            const newScoreRef = push(scoreRef); // Generates a unique score ID
        
            set(newScoreRef, {
                username: username,
                score: score
            })
            .then(() => {
                console.log("Score added successfully!");
            })
            .catch((error) => {
                console.error("Error adding score:", error);
            });
        }
    });
}

const db = getDatabase(app);
    const scoreboardRef = ref(db, "scoreboard/snake");
    let scores = [];

    function updateScoreboard() {
      scores.sort((a, b) => b.score - a.score);
      const tbody = document.getElementById("scoreboard-body");
      tbody.innerHTML = "";
      ["1st", "2nd", "3rd"].forEach((rank, i) => {
        const row = `<tr><td>${rank}</td><td>${scores[i]?.username || '-'} </td><td>${scores[i]?.score || '-'} </td></tr>`;
        tbody.innerHTML += row;
      });
    }

    onChildAdded(scoreboardRef, (snapshot) => {
      const data = snapshot.val();
      scores.push({ username: data.username, score: data.score });
      updateScoreboard();
});

export { addScore };
  

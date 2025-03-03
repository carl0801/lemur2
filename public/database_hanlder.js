
import { auth, getAuth, getDatabase, db, ref, set, push } from './firebase-config.js';

// Add a new score to the scoreboard
function addScore(gameName, score) {
    const user = auth.currentUser;
    if (!user) {
        console.error("User is not authenticated");
        return;
    }
    
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

export { addScore };
  

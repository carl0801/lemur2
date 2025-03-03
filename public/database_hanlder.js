
import { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, db, ref, set } from './firebase-config.js';


function addScore(gameName, username, score) {
    if (!firebase.auth().currentUser) {
      console.error("User is not authenticated");
      return;
    }
  
    const scoreRef = ref(`scoreboard/${gameName}`);
    const newScoreRef = scoreRef.push(); // Generates a unique score ID
  
    newScoreRef.set({
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
  

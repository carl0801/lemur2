
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

// Fetch user data from the Realtime Database
function getUserData(userId) {
    const userRef = ref(db, 'users/' + userId);
    get(userRef).then((snapshot) => {
      if (snapshot.exists()) {
        const userData = snapshot.val();
        
        return userData;

      } else {
        console.log("No user data found");
      }
    }).catch((error) => {
      console.error("Error fetching user data: ", error);
    });
  }

export { addScore, getUserData };
  

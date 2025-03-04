
import { auth, onAuthStateChanged, push, onChildAdded, db, ref } from './firebase-config.js';
import { logout } from './auth_handler.js';

// Check if user is logged in
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "/"; // Redirect to login if not logged in
  }
  else {
    // Fetch user data from Firebase Realtime Database
    const displayName = user.displayName;
    // Display username next to logout button
    document.getElementById("username-display").textContent = "Welcome " + displayName;
  }
});


let scores = [];
const scoreboardRef = ref(db, "scoreboard/snake");

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

document.getElementById("logout-button").addEventListener("click", logout);




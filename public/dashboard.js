
import { auth, onAuthStateChanged } from './firebase-config.js';


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




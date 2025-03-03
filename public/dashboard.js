
import { auth, onAuthStateChanged, signOut, db, ref, get } from './firebase-config.js';


// Check if user is logged in
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "/"; // Redirect to login if not logged in
  }
  else {
    // Fetch user data from Firebase Realtime Database
    const displayName = user.displayName;
    // Display username next to logout button
    document.getElementById("username-display").textContent = "Welcome" + displayName;
  }
});

// Log out the user when they leave the page
window.addEventListener("beforeunload", () => {
  signOut(auth).catch((error) => {
    console.error("Error logging out:", error);
  });
});

// Example of a logout function
function logout() {
    signOut(auth).then(() => {
      // After logging out, redirect to login page
      window.location.href = "/";
    }).catch((error) => {
      console.error("Error logging out: ", error);
    });
}

export { logout };


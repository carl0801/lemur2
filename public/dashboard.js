
import { auth, onAuthStateChanged, signOut, db, ref } from './firebase-config.js';



// Fetch user data from the Realtime Database
function fetchUserData(userId) {
  const userRef = ref(db, 'users/' + userId);
  get(userRef).then((snapshot) => {
    if (snapshot.exists()) {
      const userData = snapshot.val();
      const username = userData.userData.username;
      
      // Display username next to logout button
      document.getElementById("username-display").textContent = `Welcome, ${username}`;
    } else {
      console.log("No user data found");
    }
  }).catch((error) => {
    console.error("Error fetching user data: ", error);
  });
}

// Check if user is logged in
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "/"; // Redirect to login if not logged in
  }
  else {
    // Fetch user data from Firebase Realtime Database
    fetchUserData(user.uid);
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


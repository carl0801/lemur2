
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";

const auth = getAuth();

// Check if user is logged in
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "/"; // Redirect to login if not logged in
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


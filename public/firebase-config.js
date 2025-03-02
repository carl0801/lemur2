// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, setPersistence, browserSessionPersistence, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-database.js";


const firebaseConfig = {
  apiKey: "AIzaSyDgi-7M-X8NQ_0HG1urQphS0982KrFldsc",
  authDomain: "lemur-c8d6b.firebaseapp.com",
  projectId: "lemur-c8d6b",
  storageBucket: "lemur-c8d6b.appspot.com",
  messagingSenderId: "319892895415",
  appId: "1:319892895415:web:42d10b09975a8f8ddc7f32",
  measurementId: "G-8GPEHHFGK3"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// Set session-based authentication
setPersistence(auth, browserSessionPersistence)
  .then(() => {
    console.log("Session persistence set. User will be logged out when closing the browser.");
  })
  .catch((error) => {
    console.error("Error setting persistence:", error);
  });

const loadingScreen = document.getElementById('loading-screen'); // Ensure this exists in your HTML
const dashboardContent = document.getElementById('dashboard-content'); // The main content

// Show the loading screen while checking auth state
loadingScreen.style.display = 'flex';  // Show the loading screen
dashboardContent.style.display = 'none'; // Hide the content initially

onAuthStateChanged(auth, (user) => {
  if (!user) {
    // If not logged in, redirect to login page
    window.location.href = "/";
  } else {
    // If logged in, show the dashboard content
    dashboardContent.style.display = 'block';
  }

  // Hide the loading screen after checking auth state
  loadingScreen.style.display = 'none';
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

export { logout, auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, db, ref, set };

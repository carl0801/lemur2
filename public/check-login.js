
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
  
const auth = getAuth();
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


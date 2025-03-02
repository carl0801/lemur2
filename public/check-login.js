
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
const auth = getAuth();

// Check if the user is authenticated
onAuthStateChanged(auth, (user) => {
    if (!user) {
    // If no user is signed in, redirect to the login page
    window.location.href = "/index.html";
    }
});

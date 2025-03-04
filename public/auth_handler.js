
import { auth, getAuth, updateProfile, onAuthStateChanged, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from './firebase-config.js';


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
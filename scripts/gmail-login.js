import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  addDoc,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBE7qswXLivIC0VR4BmJBUy6XmbK2cC9uU",
  authDomain: "bitesharechat.firebaseapp.com",
  projectId: "bitesharechat",
  storageBucket: "bitesharechat.firebasestorage.app",
  messagingSenderId: "182207835443",
  appId: "1:182207835443:web:76b2b40fd3acd99d66a246",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Initialize Google Auth Provider
const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: "select_account",
});

// Add event listener to Google Sign-In button
const button = document.getElementById("googleBtn");

button.addEventListener("click", async function (event) {
  event.preventDefault();
  console.log("Google login button clicked");

  try {
    const result = await signInWithPopup(auth, provider);

    console.log("Sign-in result:", result);

    const user = result.user;
    const userEmail = user.email;
    const userDisplayName = user.displayName;
    const userPhotoURL = user.photoURL;

    console.log("User info:", user);
    console.log("User email:", userEmail);
    console.log("User display name:", userDisplayName);
    console.log("User photo URL:", userPhotoURL);

    // Create a new profile entry in Firestore
    console.log("Creating a new profile in Firestore...");
    await addDoc(collection(db, "userProfiles"), {
      uid: user.uid,
      email: userEmail,
      displayName: userDisplayName,
      photoURL: userPhotoURL,
      createdAt: new Date(),
      additionalData: "Default value for additional fields", // Add more fields as necessary
    });

    console.log("New profile created successfully.");

    alert(`Welcome, ${userDisplayName}! Your email is: ${userEmail}`);

    // Save login state in localStorage
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("username", userDisplayName);
    localStorage.setItem("loginType", "google");

    // Redirect user to profile page
    window.location.href = "/html/profile.html";
  } catch (error) {
    console.error("Error during sign-in:", error);
    alert(`Error: ${error.message}`);
  }
});

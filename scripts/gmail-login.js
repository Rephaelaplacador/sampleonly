import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBE7qswXLivIC0VR4BmJBUy6XmbK2cC9uU",
  authDomain: "bitesharechat.firebaseapp.com",
  projectId: "bitesharechat",
  storageBucket: "bitesharechat.firebasestorage.app",
  messagingSenderId: "182207835443",
  appId: "1:182207835443:web:76b2b40fd3acd99d66a246",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

provider.setCustomParameters({
  prompt: "select_account",
});

const button = document.getElementById("googleBtn");

button.addEventListener("click", function (event) {
  event.preventDefault();
  console.log("Google login button clicked");

  signInWithPopup(auth, provider)
    .then((result) => {
      console.log("Sign-in successful:", result);

      const user = result.user;

      const userEmail = user.email;
      const userDisplayName = user.displayName;
      const userPhotoURL = user.photoURL;

      console.log("User info:", user);
      console.log("User email:", userEmail);
      console.log("User display name:", userDisplayName);
      console.log("User photo URL:", userPhotoURL);

      alert(`Welcome, ${userDisplayName}! Your email is: ${userEmail}`);

      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("username", userDisplayName);
      localStorage.setItem("loginType", "google");

      window.location.href = "/html/profile.html";
    })
    .catch((error) => {
      console.error("Error during sign-in:", error);
      alert(`Error: ${error.message}`);
    });
});

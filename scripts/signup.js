document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const inputs = form.querySelectorAll("input");
  
  // Attach event listener for form submission
  form.addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent default form submission

    // Retrieve field values
    const email = inputs[0].value.trim();
    const password = inputs[1].value.trim();
    const fullName = inputs[2].value.trim();
    const username = inputs[3].value.trim();

    // Validate inputs
    if (!email || !password || !fullName || !username) {
      alert("All fields are required!");
      return;
    }

    if (!validateEmail(email)) {
      alert("Please enter a valid email address!");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters long!");
      return;
    }

    // Simulate signup process
    alert(`Signup successful! Welcome, ${fullName}`);
    window.location.href = "/html/profile.html"; // Redirect to home page
  });

  // Function to validate email
  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  // Modals and buttons
  const termsModal = document.getElementById("terms-modal");
  const privacyModal = document.getElementById("privacy-modal");
  const cookiesModal = document.getElementById("cookies-modal");

  const termsLink = document.getElementById("terms-link");
  const privacyLink = document.getElementById("privacy-link");
  const cookiesLink = document.getElementById("cookies-link");

  const closeTerms = document.getElementById("close-terms");
  const closePrivacy = document.getElementById("close-privacy");
  const closeCookies = document.getElementById("close-cookies");

  // Open modals
  termsLink.addEventListener("click", (e) => {
    e.preventDefault();
    termsModal.style.display = "block";
  });

  privacyLink.addEventListener("click", (e) => {
    e.preventDefault();
    privacyModal.style.display = "block";
  });

  cookiesLink.addEventListener("click", (e) => {
    e.preventDefault();
    cookiesModal.style.display = "block";
  });

  // Close modals
  closeTerms.addEventListener("click", () => {
    termsModal.style.display = "none";
  });

  closePrivacy.addEventListener("click", () => {
    privacyModal.style.display = "none";
  });

  closeCookies.addEventListener("click", () => {
    cookiesModal.style.display = "none";
  });

  
  window.addEventListener("click", (e) => {
    if (e.target === termsModal) termsModal.style.display = "none";
    if (e.target === privacyModal) privacyModal.style.display = "none";
    if (e.target === cookiesModal) cookiesModal.style.display = "none";
  });
});


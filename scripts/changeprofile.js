// Variables for "Change Profile Photo" modal
const changePhotoModal = document.getElementById('changePhotoModal');
const profilePicture = document.getElementById('profile-picture');
const pictureInput = document.getElementById('picture-input');

// Open the "Change Profile Photo" modal when the profile picture is clicked
profilePicture.addEventListener('click', () => {
  changePhotoModal.style.display = 'block'; // Show the modal
});

// Close the "Change Profile Photo" modal
function closePhotoModal() {
  changePhotoModal.style.display = 'none'; // Hide the modal
}

// Trigger file upload input
function triggerFileUpload() {
  pictureInput.click(); // Open the file input dialog
}

// Handle file input change (update profile picture)
pictureInput.addEventListener('change', (event) => {
  const file = event.target.files[0]; // Get the uploaded file
  if (file) {
    const reader = new FileReader(); // Use FileReader to preview the image
    reader.onload = (e) => {
      profilePicture.src = e.target.result; // Update the profile picture preview
    };
    reader.readAsDataURL(file); // Read the file as a data URL
  }
  closePhotoModal(); // Close the modal after the photo is selected
});

// Remove the current profile picture
function removeProfilePhoto() {
  profilePicture.src = 'icons/Profilepic.png'; // Reset to default profile picture
  closePhotoModal(); // Close the modal
}

// Close modal when clicking outside the modal content
window.addEventListener('click', (event) => {
  if (event.target === changePhotoModal) {
    closePhotoModal(); // Close the modal if the backdrop is clicked
  }
});

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBE7qswXLivIC0VR4BmJBUy6XmbK2cC9uU",
  authDomain: "bitesharechat.firebaseapp.com",
  projectId: "bitesharechat",
  storageBucket: "bitesharechat.firebasestorage.app",
  messagingSenderId: "182207835443",
  appId: "1:182207835443:web:76b2b40fd3acd99d66a246",
};

// Global variables
let app, storage, db;
let isUploading = false;
const likeStates = new Map(); // Track likes for each image

// Initialize Firebase after DOM loads
document.addEventListener("DOMContentLoaded", function () {
  try {
    app = firebase.initializeApp(firebaseConfig);
    storage = firebase.storage();
    db = firebase.firestore();
    console.log("Firebase initialized successfully");
    loadImagesFromFirebase(); // Load images after Firebase is initialized
  } catch (error) {
    console.error("Firebase initialization error:", error);
    alert("Error initializing app. Please try again later.");
  }
});

// Modal Management Functions
function openModal() {
  document.getElementById("uploadModal").classList.add("show");
}

function closeModal() {
  document.getElementById("uploadModal").classList.remove("show");
  resetUploadView();
}

function resetUploadView() {
  document.querySelector(".upload-placeholder").style.display = "block";
  document.getElementById("preview-container").style.display = "none";
  document.querySelector(".preview-grid").innerHTML = "";
  document.getElementById("file-input").value = "";
  document.querySelector(".recipe-caption").style.display = "none";
  document.querySelector(".recipe-caption").value = "";
  document.getElementById("upload-final").style.display = "none";
  document.querySelector(".user-info").style.display = "none";
  hideBorder();
}

function hideBorder() {
  const div = document.querySelector(".upload-border");
  if (div) div.style.border = "none";
}

// Setup Event Listeners
document.querySelector(".select-btn")?.addEventListener("click", () => {
  document.getElementById("file-input").click();
});

document.querySelector(".add-more-btn")?.addEventListener("click", () => {
  document.getElementById("file-input").click();
});

document
  .getElementById("file-input")
  ?.addEventListener("change", handleFileChange);
document
  .getElementById("upload-final")
  ?.addEventListener("click", handleFinalUpload);

// File Input Change Handler
function handleFileChange(event) {
  if (isUploading) return;
  isUploading = true;

  const files = event.target.files;
  if (!files || files.length === 0) {
    isUploading = false;
    return;
  }

  try {
    document.querySelector(".upload-placeholder").style.display = "none";
    document.getElementById("preview-container").style.display = "block";
    document.querySelector(".recipe-caption").style.display = "block";
    document.getElementById("upload-final").style.display = "block";
    document.querySelector(".user-info").style.display = "flex";

    const previewGrid = document.querySelector(".preview-grid");
    previewGrid.classList.toggle("single-image", files.length === 1);

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = function (e) {
        const previewCard = document.createElement("div");
        previewCard.className = "preview-card";

        const img = document.createElement("img");
        img.src = e.target.result;
        img.alt = "Preview";
        img.className = "preview-image";

        const removeBtn = document.createElement("button");
        removeBtn.textContent = "✕";
        removeBtn.className = "remove-preview";
        removeBtn.onclick = () => {
          previewCard.remove();
          if (previewGrid.children.length === 0) {
            resetUploadView();
          }
        };

        previewCard.appendChild(img);
        previewCard.appendChild(removeBtn);
        previewGrid.appendChild(previewCard);
      };
      reader.readAsDataURL(file);
    });
  } catch (error) {
    console.error("Error handling file selection:", error);
    alert("Error previewing images. Please try again.");
  } finally {
    isUploading = false;
  }
}

// Final Upload Handler
async function handleFinalUpload() {
  if (!storage || !db) {
    alert("Firebase not initialized. Please refresh the page.");
    return;
  }

  const uploadBtn = document.getElementById("upload-final");
  uploadBtn.disabled = true;
  uploadBtn.textContent = "Uploading...";

  try {
    const caption = document.querySelector(".recipe-caption").value;
    const previews = document.querySelectorAll(".preview-card img");

    if (previews.length === 0) {
      alert("Please select at least one image");
      return;
    }

    const uploadPromises = Array.from(previews).map(async (preview) => {
      const file = preview.src;
      const storageRef = storage
        .ref()
        .child(
          `images/${Date.now()}-${Math.random().toString(36).substring(7)}`
        );
      const snapshot = await storageRef.putString(file, "data_url");
      return snapshot.ref.getDownloadURL();
    });

    const urls = await Promise.all(uploadPromises);

    const batch = db.batch();
    urls.forEach((url) => {
      const docRef = db.collection("images").doc();
      batch.set(docRef, {
        image: url,
        caption: caption,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
    });

    await batch.commit();

    // Add images to photo grid
    urls.forEach((url) => addImageToPhotoGrid(url, caption));

    closeModal();
    resetUploadView();
    alert("Upload complete!");
  } catch (error) {
    console.error("Upload error:", error);
    alert("Error uploading images. Please try again.");
  } finally {
    uploadBtn.disabled = false;
    uploadBtn.textContent = "POST";
  }
}

// Add image to photo grid
function addImageToPhotoGrid(imageUrl, caption) {
  const photoGrid = document.querySelector(".photo-grid");
  const photoItem = document.createElement("div");
  photoItem.classList.add("photo-item");

  const img = document.createElement("img");
  img.src = imageUrl;
  img.alt = "Uploaded food photo";

  // Add click handler to open preview modal
  photoItem.addEventListener("click", () => {
    openPreviewModal(imageUrl, caption);
  });

  photoItem.appendChild(img);
  photoGrid.appendChild(photoItem);
}

// Function to open preview modal - update to show caption and handle likes
function openPreviewModal(imageUrl, caption) {
  const previewModal = document.querySelector(".preview-modal");
  const previewImage = previewModal.querySelector(".previewmodal-image img");
  const captionElement = previewModal.querySelector("#imageCaption");
  const likedByText = previewModal.querySelector('.previewliked-by span');
  const username = localStorage.getItem("username") || "Anonymous";

  // Initialize like state for this image if it doesn't exist
  if (!likeStates.has(imageUrl)) {
    likeStates.set(imageUrl, {
      isLiked: false,
      likesCount: 509
    });
  }

  // Get like state for this specific image
  const likeState = likeStates.get(imageUrl);

  // Set image and caption
  previewImage.src = imageUrl;
  captionElement.innerHTML = `<strong>${username}</strong> ${caption}`;
  previewModal.style.display = "block";

  // Load comments for this image
  loadComments(imageUrl);

  // Like Button Functionality
  const likeBtn = document.querySelector(".fa-utensils");
  if (likeBtn) {
    // Remove existing event listeners
    const newLikeBtn = likeBtn.cloneNode(true);
    likeBtn.parentNode.replaceChild(newLikeBtn, likeBtn);
    
    // Update initial button state
    newLikeBtn.style.color = likeState.isLiked ? "#8ab660" : "white";
    likedByText.innerHTML = likeState.isLiked 
      ? `Liked by <strong>you</strong> and <strong>${likeState.likesCount} others</strong>`
      : `Liked by <strong>foodking</strong> and <strong>${likeState.likesCount} others</strong>`;
    
    newLikeBtn.addEventListener("click", function() {
      likeState.isLiked = !likeState.isLiked;
      if (likeState.isLiked) {
        newLikeBtn.style.color = "#8ab660";
        likeState.likesCount++;
      } else {
        newLikeBtn.style.color = "white";
        likeState.likesCount--;
      }
      likedByText.innerHTML = likeState.isLiked 
        ? `Liked by <strong>you</strong> and <strong>${likeState.likesCount} others</strong>`
        : `Liked by <strong>foodking</strong> and <strong>${likeState.likesCount} others</strong>`;
      
      console.log("Like button clicked for image:", imageUrl, "isLiked:", likeState.isLiked, "likesCount:", likeState.likesCount);
    });
  }


  // Add delete button handler
  const deleteBtn = previewModal.querySelector(".delete-btn");
  deleteBtn.onclick = () => {
    deleteImageFromFirebase(imageUrl);
    previewModal.style.display = "none";
  };

  // Close modal when clicking outside
  window.onclick = (event) => {
    if (event.target === previewModal) {
      previewModal.style.display = "none";
    }
  };

  // Setup comment submission
  const commentInput = previewModal.querySelector(".comment-text-input");
  const postButton = previewModal.querySelector(".previewpost-btn");
  
  // Remove existing event listeners
  const newPostButton = postButton.cloneNode(true);
  postButton.parentNode.replaceChild(newPostButton, postButton);
  
  newPostButton.onclick = () => handleCommentSubmit(imageUrl);
  
  commentInput.onkeypress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleCommentSubmit(imageUrl);
    }
  };
}
// Comment handling functions
async function handleCommentSubmit(imageUrl) {
  const commentInput = document.querySelector(".comment-text-input");
  const comment = commentInput.value.trim();
  const username = localStorage.getItem("username") || "Anonymous";

  if (!comment) return;

  try {
    const commentData = {
      username: username,
      text: comment,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      imageUrl: imageUrl,
    };

    await db.collection("comments").add(commentData);
    displayComment(commentData);
    commentInput.value = "";
    console.log("Comment added successfully");
  } catch (error) {
    console.error("Error adding comment:", error);
    alert("Error posting comment. Please try again.");
  }
}

function displayComment(commentData) {
  const commentsContainer = document.createElement("div");
  commentsContainer.className = "comment-container";

  const commentElement = document.createElement("div");
  commentElement.className = "comment";
  commentElement.innerHTML = `
    <strong>${commentData.username}</strong> ${commentData.text}
    <span class="comment-timestamp">${
      commentData.timestamp
        ? new Date(commentData.timestamp.toDate()).toLocaleString()
        : "Just now"
    }</span>
  `;

  commentsContainer.appendChild(commentElement);
  const commentSection = document.querySelector(".previewcomment-section");
  commentSection.insertBefore(commentsContainer, commentSection.firstChild);
}

async function loadComments(imageUrl) {
  try {
    const querySnapshot = await db
      .collection("comments")
      .where("imageUrl", "==", imageUrl)
      .orderBy("timestamp", "desc")
      .get();

    const commentSection = document.querySelector(".previewcomment-section");
    commentSection.innerHTML = "";

    querySnapshot.forEach((doc) => {
      displayComment(doc.data());
    });
  } catch (error) {
    console.error("Error loading comments:", error);
  }
}

// Load images from Firebase
async function loadImagesFromFirebase() {
  if (!db) {
    console.error("Firestore not initialized");
    return;
  }

  try {
    const querySnapshot = await db
      .collection("images")
      .orderBy("timestamp", "desc")
      .get();

    const photoGrid = document.querySelector(".photo-grid");
    photoGrid.innerHTML = "";

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      addImageToPhotoGrid(data.image, data.caption);
    });
  } catch (error) {
    console.error("Error loading images:", error);
  }
}

// Delete image from Firebase
async function deleteImageFromFirebase(imageUrl) {
  if (!storage || !db) {
    alert("Firebase not initialized");
    return;
  }

  try {
    const fileRef = storage.refFromURL(imageUrl);
    await fileRef.delete();

    const querySnapshot = await db
      .collection("images")
      .where("image", "==", imageUrl)
      .get();

    const batch = db.batch();
    querySnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();

    const photoItems = document.querySelectorAll(".photo-item");
    photoItems.forEach((item) => {
      if (item.querySelector("img").src === imageUrl) {
        item.remove();
      }
    });

    alert("Image deleted successfully");
  } catch (error) {
    console.error("Error deleting image:", error);
    alert("Error deleting image. Please try again.");
  }
}
document.addEventListener("DOMContentLoaded", function () {
    const savedPostsGrid = document.getElementById("savedPostsGrid");

    // Retrieve saved posts from localStorage
    const savedPosts = JSON.parse(localStorage.getItem("savedPosts")) || [];

    // If no saved posts
    if (savedPosts.length === 0) {
      savedPostsGrid.innerHTML = "<p>No saved posts found.</p>";
    } else {
      // Display saved posts
      savedPosts.forEach(post => {
        const postElement = document.createElement("div");
        postElement.className = "saved-post-item";

        // Create an image element for the post
        postElement.innerHTML = `
          <img src="${post.mediaUrl}" alt="${post.username}">
          <div class="post-info">
            <p>${post.username}</p>
          </div>
        `;

        // Append the post element to the grid
        savedPostsGrid.appendChild(postElement);
      });
    }
  });
document.addEventListener('DOMContentLoaded', () => {
    const previewModal = document.querySelector('.preview-modal');
    const modalImage = document.querySelector('.previewmodal-image img');
    const modalUsername = document.querySelector('.previewuser-details h3');
    const modalTimestamp = document.querySelector('.timestamp');
    const modalLikes = document.querySelector('.previewlikes span');
    const commentInput = document.querySelector('.comment-text-input');
    const postButton = document.querySelector('.previewpost-btn');
    const photoGrid = document.querySelector('.photo-grid');
    const likedByText = document.querySelector('.previewliked-by span');
    let likesCount = 509; // Initial likes count
    let isLiked = false;

    // Check if photo grid exists and has images
    if (!photoGrid) {
        console.log('Photo grid not found');
        return;
    }

    // Add click event to photo grid images
    photoGrid.addEventListener('click', (e) => {
        const clickedImage = e.target.closest('img');
        if (clickedImage) {
            console.log('Image clicked:', clickedImage.src);
            openPreviewModal({
                src: clickedImage.src,
                username: 'BiteShare',
                timestamp: '3 mins ago',
                likes: `Liked by foodking and ${likesCount} others`
            });
        }
    });

    // Function to open modal with image details
    function openPreviewModal(imageData) {
        if (!imageData) {
            console.error('No image data provided');
            return;
        }

        modalImage.src = imageData.src;
        modalUsername.textContent = imageData.username;
        modalTimestamp.textContent = imageData.timestamp;
        likedByText.innerHTML = `Liked by <strong>foodking</strong> and <strong>${likesCount} others</strong>`;
        
        // Show modal with buttons
        previewModal.style.display = 'flex';
        console.log('Modal opened with image:', imageData.src);

        // Add delete functionality to the delete button
        let deleteButton = document.querySelector('.delete-btn');
        if (!deleteButton) {
            deleteButton = document.createElement('button');
            deleteButton.className = 'delete-btn';
            deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
            deleteButton.style.cssText = 'background: red; color: white; padding: 8px; border: none; border-radius: 4px; cursor: pointer; margin-left: 10px;';
            document.querySelector('.previewuser-info').appendChild(deleteButton);
        }

        deleteButton.onclick = (e) => {
            e.stopPropagation();
            if (confirm('Are you sure you want to delete this image?')) {
                console.log('Deleting image:', modalImage.src);
                const images = photoGrid.querySelectorAll('img');
                images.forEach(img => {
                    if (img.src === modalImage.src) {
                        img.parentElement.remove();
                        console.log('Image removed from grid');
                    }
                });
                previewModal.style.display = 'none';
                console.log('Modal closed after deletion');
            }
        };
    }

    // Close modal when clicking outside
    previewModal.addEventListener('click', (e) => {
        if (e.target === previewModal) {
            previewModal.style.display = 'none';
            console.log('Modal closed');
        }
    });

    // Like button functionality
    const likeBtn = document.querySelector('.previewaction-btn');
    likeBtn.addEventListener('click', function() {
        isLiked = !isLiked;
        if(isLiked) {
            likeBtn.style.color = '#ed4956';
            likesCount++;
            likedByText.innerHTML = `Liked by <strong>you</strong> and <strong>${likesCount} others</strong>`;
        } else {
            likeBtn.style.color = 'white';
            likesCount--;
            likedByText.innerHTML = `Liked by <strong>foodking</strong> and <strong>${likesCount} others</strong>`;
        }
        console.log('Like button clicked, isLiked:', isLiked, 'likesCount:', likesCount);
    });

    // Handle bookmark button
    const bookmarkButton = document.querySelector('.previewaction-buttons .bookmark');
    bookmarkButton?.addEventListener('click', () => {
        const icon = bookmarkButton.querySelector('i');
        icon.classList.toggle('fas');
        icon.classList.toggle('far');
        console.log('Bookmark button toggled');
    });

    // Handle share button
    const shareButton = document.querySelector('.previewaction-buttons .share-btn');
    shareButton?.addEventListener('click', () => {
        console.log('Share clicked');
        alert('Sharing functionality coming soon!');
    });

    // Comment input functionality
    commentInput.addEventListener('input', function() {
        postButton.style.opacity = this.value.length > 0 ? '1' : '0.3';
        console.log('Comment input changed:', this.value);
    });

    // Add comment when Post button is clicked
    postButton.addEventListener('click', function() {
        const commentText = commentInput.value.trim();
        if (commentText) {
            // Create new comment element
            const commentDiv = document.createElement('div');
            commentDiv.className = 'preview-comment';
            commentDiv.innerHTML = `
                <strong>BiteShare</strong> ${commentText}
            `;
            
            // Insert comment before the comment input
            const commentSection = document.querySelector('.previewcomment-section');
            commentSection.insertBefore(commentDiv, document.querySelector('.comment-input'));
            
            // Clear input
            commentInput.value = '';
            postButton.style.opacity = '0.3';
            console.log('New comment posted:', commentText);
        }
    });

    // Handle enter key in comment input
    commentInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            postButton.click();
        }
    });
});
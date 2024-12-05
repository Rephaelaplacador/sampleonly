document.addEventListener('DOMContentLoaded', function() {
    // Form handling
    const profileForm = document.getElementById('profile-form');
    const inputs = profileForm.querySelectorAll('input, textarea, select');

    inputs.forEach(input => {
        input.addEventListener('change', function() {
            console.log(`${input.id} changed to: ${input.value}`);
            // Here you would typically send this data to a server
        });
    });

    // Photo change button
    const changePhotoBtn = document.querySelector('.change-photo-btn');
    const avatarImg = document.getElementById('avatar-img');

    changePhotoBtn.addEventListener('click', function() {
        // Simulate file input click
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';

        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    avatarImg.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });

        fileInput.click();
    });

    // Sidebar buttons
    const sidebarBtns = document.querySelectorAll('.sidebar-btn');
    sidebarBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            console.log(`${btn.textContent} clicked`);
            // Here you would typically handle navigation or actions
        });
    });

    // Logout button
    const logoutBtn = document.querySelector('.logout-btn');
    logoutBtn.addEventListener('click', function() {
        console.log('Logout clicked');
        // Here you would typically handle logout logic
    });
});
document.addEventListener('DOMContentLoaded', function() {
    const input = document.getElementById('input');

    input.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('rawImg', file);

            fetch('/auth/uploadImage', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (response.ok) {
                    console.log('Image uploaded successfully');
                    displayUploadedFile(URL.createObjectURL(file));
                } else {
                    // Handle errors
                    console.error('Error uploading image:', response.statusText);
                }
            })
            .catch(error => {
                console.error('Error uploading image:', error);
            });
        }
    });

    // Function to display the uploaded image
    function displayUploadedFile(fileURL) {
        const container = document.querySelector('.upload-button-container');
        container.innerHTML = '';
        const image = document.createElement('img');
        image.src = fileURL;
        image.classList.add('uploaded-image');
        container.appendChild(image);
    }
});

'use strict';

//! customize the create post container
// make the post button hidden until you write something in textarea
let middleCreatePostBtn = document.getElementById('middle-create-post-btn');
let middleNewPostContentTextarea = document.getElementById('new-post-content');
if (middleCreatePostBtn && middleNewPostContentTextarea) {
  function enableCreatePostBtn() {
    middleCreatePostBtn.disabled = false;
    middleCreatePostBtn.style.backgroundColor = '#423b89';
    middleCreatePostBtn.style.cursor = 'pointer';
  }
  function disableCreatePostBtn() {
    middleCreatePostBtn.disabled = true;
    middleCreatePostBtn.style.backgroundColor = '#4338785e';
    middleCreatePostBtn.style.cursor = 'default';
  }
  middleNewPostContentTextarea.addEventListener('input', (event) => {
    if (middleNewPostContentTextarea.value.trim() === '') {
      disableCreatePostBtn();
    } else {
      enableCreatePostBtn();
    }
  });

  // preview all media which user input to be in post
  const fileInput = document.getElementById('post-media-input');
  const imagePreviewContainer = document.getElementById(
    'new-post-media-container'
  );

  let selectedMedia = [];
  function addInputFileToSelectedMediaIfNotFound(file) {
    let checkIfFileIsEntered = false;
    selectedMedia.forEach((f) => {
      if (f.name === file.name && f.size === file.size) {
        checkIfFileIsEntered = true;
      }
    });
    if (!checkIfFileIsEntered) {
      selectedMedia.push(file);
    }
  }
  function deleteSpecificFileFromSelectedMedia(
    fileName,
    fileSize,
    lastModified
  ) {
    let updatedSelectedMedia = selectedMedia;
    selectedMedia = updatedSelectedMedia.filter((file) => {
      if (
        file.name !== fileName ||
        file.size !== fileSize ||
        lastModified !== file.lastModified
      ) {
        return file;
      }
    });
  }
  fileInput.addEventListener('change', () => {
    addInputFileToSelectedMediaIfNotFound(fileInput.files[0]);

    imagePreviewContainer.innerHTML = '';

    selectedMedia.forEach((file) => {
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();

        reader.onload = (e) => {
          const mediaContainer = document.createElement('div');
          mediaContainer.className = 'media-container';

          const imgElement = document.createElement('img');
          imgElement.src = e.target.result;
          imgElement.className = 'image-preview';

          const cancelButton = document.createElement('button');
          cancelButton.className = 'cancel-button';
          cancelButton.innerHTML = '✖';
          cancelButton.onclick = () => {
            mediaContainer.remove();
            deleteSpecificFileFromSelectedMedia(
              file.name,
              file.size,
              file.lastModified
            );
          };

          mediaContainer.appendChild(imgElement);
          mediaContainer.appendChild(cancelButton);

          imagePreviewContainer.appendChild(mediaContainer);
        };

        reader.readAsDataURL(file);
      } else if (file && file.type.startsWith('video/')) {
        const reader = new FileReader();

        reader.onload = (e) => {
          const mediaContainer = document.createElement('div');
          mediaContainer.className = 'media-container';

          const videoElement = document.createElement('video');
          videoElement.src = e.target.result;
          videoElement.className = 'video-preview';
          videoElement.controls = true;
          videoElement.width = 100;

          const cancelButton = document.createElement('button');
          cancelButton.className = 'cancel-button';
          cancelButton.innerHTML = '✖';
          cancelButton.onclick = () => {
            mediaContainer.remove();
            deleteSpecificFileFromSelectedMedia(
              file.name,
              file.size,
              file.lastModified
            );
          };

          mediaContainer.appendChild(videoElement);
          mediaContainer.appendChild(cancelButton);

          imagePreviewContainer.appendChild(mediaContainer);
        };

        reader.readAsDataURL(file);
      }
    });
  });
  middleCreatePostBtn.addEventListener('click', () => {
    console.log(selectedMedia);
  });
}

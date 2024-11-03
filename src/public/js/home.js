'use strict';

//! make a loader page appear each time we refresh
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    loader.classList.add('hidden');
    loader.addEventListener('transitionend', () => {
      loader.style.display = 'none';
    });
  }, 1000);
});

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

//! hide the post content to specific height if it is too long
let postsContent = document.querySelectorAll('.post-writing-content');
if (postsContent) {
  postsContent.forEach((postContent) => {
    let post = postContent.closest('.post');
    let showPostContentBtn = post.querySelector('.show-post-content-btn');
    // check it the post content
    showPostContentBtn.addEventListener('click', () => {
      if (postContent.classList.contains('isChecked')) {
        postContent.classList.remove('isChecked');
        showPostContentBtn.innerHTML = 'Show More';
      } else {
        postContent.classList.add('isChecked');
        showPostContentBtn.innerHTML = 'Show Less';
      }
    });
    // check if the post written in arabic or english and then set the direction based on this
    const arabicRegex = /[\u0600-\u06FF]/;
    if (
      arabicRegex.test(postContent.innerHTML) ||
      arabicRegex.test(postContent.content)
    ) {
      postContent.setAttribute('dir', 'rtl');
    } else {
      postContent.setAttribute('dir', 'ltr');
    }
    // hide the show btn of  content of the post
    if (postContent.clientHeight > 12 * 16) {
      showPostContentBtn.style.display = 'block';
    } else {
      showPostContentBtn.style.display = 'none';
    }
  });
}

'use strict';

const socket = io({
  auth: {
    serverOffset: 0,
  },
});

let selectedMedia = [];
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

// enable create tweet btn
function enableCreatePostBtn() {
  middleCreatePostBtn.disabled = false;
  middleCreatePostBtn.style.backgroundColor = '#423b89';
  middleCreatePostBtn.style.cursor = 'pointer';
}
// disable create tweet btn
function disableCreatePostBtn() {
  middleCreatePostBtn.disabled = true;
  middleCreatePostBtn.style.backgroundColor = '#4338785e';
  middleCreatePostBtn.style.cursor = 'default';
}
// function to check if the create post button must be disabled or enabled
function checkIFCreateNewPostButtonMustBeEnabled() {
  if (
    selectedMedia.length === 0 &&
    middleNewPostContentTextarea.value.trim() === ''
  ) {
    disableCreatePostBtn();
  } else {
    enableCreatePostBtn();
  }
}
if (middleCreatePostBtn && middleNewPostContentTextarea) {
  middleNewPostContentTextarea.addEventListener('input', (event) => {
    checkIFCreateNewPostButtonMustBeEnabled();
  });

  // preview all media which user input to be in post
  const fileInput = document.getElementById('post-media-input');
  const imagePreviewContainer = document.getElementById(
    'new-post-media-container'
  );

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
  // view the input media in media container while creating the post
  fileInput.addEventListener('change', () => {
    addInputFileToSelectedMediaIfNotFound(fileInput.files[0]);
    checkIFCreateNewPostButtonMustBeEnabled();
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
            checkIFCreateNewPostButtonMustBeEnabled();
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
            checkIFCreateNewPostButtonMustBeEnabled();
          };

          mediaContainer.appendChild(videoElement);
          mediaContainer.appendChild(cancelButton);

          imagePreviewContainer.appendChild(mediaContainer);
        };

        reader.readAsDataURL(file);
      }
    });
  });
}

//! hide the post content to specific height if it is too long
let postsContent = document.querySelectorAll('.post-writing-content');
if (postsContent) {
  postsContent.forEach((postContent) => {
    let post = postContent.closest('.post');
    let showPostContentBtn = post.querySelector('.show-post-content-btn');
    // check if the tweet content height is larger than the normal height
    if (showPostContentBtn) {
      showPostContentBtn.addEventListener('click', () => {
        if (postContent.classList.contains('isChecked')) {
          postContent.classList.remove('isChecked');
          showPostContentBtn.innerHTML = 'Show More';
        } else {
          postContent.classList.add('isChecked');
          showPostContentBtn.innerHTML = 'Show Less';
        }
      });
      // hide the show btn of  content of the post
      if (postContent.clientHeight > 12 * 16) {
        showPostContentBtn.style.display = 'block';
      } else {
        showPostContentBtn.style.display = 'none';
      }
    }
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
    //! make all tweets like button colored if the tweet is liked by currenct user and fire request to like and unlike tweet
    const tweetLikeBtn = post.querySelector('.heart-icon');
    const tweetLikeBtnContainer = post.querySelector('.heart-icon-content');
    tweetLikeBtn.addEventListener('click', async () => {
      const tweetId = post.dataset.tweetId;
      if (!tweetLikeBtnContainer.classList.contains('liked-tweet')) {
        // fire a request to put a like on the tweet
        try {
          const response = await axios.post(
            `http://localhost:3000/tweets/${tweetId}/like`
          );
          if (response.status === 200) {
            // color the like button with liked color
            tweetLikeBtnContainer.classList.toggle('liked-tweet');
            const numberOfLikesOnTweet = tweetLikeBtnContainer.querySelector(
              '.number-of-likes-on-tweet'
            );
            numberOfLikesOnTweet.textContent = response.data.tweetLikesNumber;
          }
        } catch (error) {
          alert('There is an error with likes, Try Again!.');
        }
      } else {
        // fire a request to delete a like on the tweet
        try {
          const response = await axios.delete(
            `http://localhost:3000/tweets/${tweetId}/like`
          );
          if (response.status === 200) {
            // uncolor the like button with liked color
            tweetLikeBtnContainer.classList.toggle('liked-tweet');
            const numberOfLikesOnTweet = tweetLikeBtnContainer.querySelector(
              '.number-of-likes-on-tweet'
            );
            numberOfLikesOnTweet.textContent = response.data.tweetLikesNumber;
          }
        } catch (error) {
          alert('There is an error with likes, Try Again!.');
        }
      }
    });
    // make all tweets bookmark button colored if the tweet bookmarked by current user
    const tweetBookMarkBtn = post.querySelector('.bookmark-icon');
    const tweetBookMarkBtnContainer = post.querySelector(
      '.bookmark-icon-content'
    );
    tweetBookMarkBtn.addEventListener('click', async () => {
      const bookmakrId = post.dataset.tweetId;
      if (!tweetBookMarkBtnContainer.classList.contains('bookmarked-tweet')) {
        //fire a request to bookmark a tweet or a reply
        try {
          const response = await axios.post(
            `http://localhost:3000/users/bookmark/${bookmakrId}`
          );
          if (response.status === 200) {
            tweetBookMarkBtnContainer.classList.toggle('bookmarked-tweet');
          }
        } catch (error) {
          console.log('There is an error with book marks');
        }
      } else {
        //fire a request to remove bookmark from a tweet or a reply
        try {
          const response = await axios.delete(
            `http://localhost:3000/users/bookmark/${bookmakrId}`
          );
          if (response.status === 200) {
            tweetBookMarkBtnContainer.classList.toggle('bookmarked-tweet');
          }
        } catch (error) {
          console.log('There is an error with book marks');
        }
      }
    });
    // make all tweets retweet button colored if the tweet retweeted by the current user
    const tweetRetweetBtn = post.querySelector('.retweet-icon');
    const tweetRetweetBtnContainer = post.querySelector(
      '.retweet-icon-content'
    );
    tweetRetweetBtn.addEventListener('click', () => {
      tweetRetweetBtnContainer.classList.toggle('retweeted-tweet');
    });
  });
}

//! make a request to create new tweet
let createPostBtn = document.getElementById('middle-create-post-btn');
if (createPostBtn) {
  let createPostTextarea = document.getElementById('new-post-content');
  const imagePreviewContainer = document.getElementById(
    'new-post-media-container'
  );

  createPostBtn.addEventListener('click', async (event) => {
    try {
      const formData = new FormData();
      formData.append('content', createPostTextarea.value);
      selectedMedia.forEach((file) => {
        formData.append('url', file);
      });
      const response = await axios.post(
        'http://localhost:3000/users/tweet',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        createPostTextarea.value = '';
        selectedMedia = [];
        checkIFCreateNewPostButtonMustBeEnabled();
        imagePreviewContainer.innerHTML = '';
      }
    } catch (error) {
      console.log(error);
    }
  });
}
//!clickable side nav buttons
let sideNavLinks = document.querySelectorAll('.nav-link a');
if (sideNavLinks) {
  // the function that must be called if the home button clicked
  async function homeCallbackFunction() {
    try {
      let response = await axios.get('http://localhost:3000/home', {
        withCredentials: true,
      });
      if (response.status === 200) {
        window.setTimeout(() => {
          location.assign('/home');
        }, 1000);
      }
    } catch (error) {
      alert('This is an error at rendering home');
    }
  }
  // the function that must be called if the bookmarks button clicked
  async function bookmarksCallbackFunction() {
    try {
      let response = await axios.get('http://localhost:3000/bookmarks', {
        withCredentials: true,
      });
      if (response.status === 200) {
        window.setTimeout(() => {
          location.assign('/bookmarks');
          // const createPostForm = document.getElementById('create-post-form');
          // createPostForm.style.display = 'none';
        }, 1000);
      }
    } catch (error) {
      alert('This is an error at viewing bookmarks');
    }
  }
  sideNavLinks.forEach((navLink) => {
    navLink.addEventListener('click', async (event) => {
      let navLinkId = event.target.closest('a').getAttribute('id');
      switch (navLinkId) {
        case 'home':
          await homeCallbackFunction();
          break;
        case 'explore':
          break;
        case 'notifications':
          break;
        case 'messages':
          break;
        case 'bookmarks':
          await bookmarksCallbackFunction();
          break;
        case 'communities':
          break;
        case 'premium':
          break;
        case 'profile':
          break;
        case 'shops':
          break;
        case 'more':
          break;
      }
    });
  });
}

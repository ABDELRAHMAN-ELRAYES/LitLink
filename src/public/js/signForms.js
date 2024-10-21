'strict mode';

// transform between singin form and signup form
let getLoginFormBtn = document.querySelector('.get-login-form-btn');
let getSignupFormBtn = document.querySelector('.get-signup-form-btn');
if (getLoginFormBtn && getSignupFormBtn) {
  let overlay = document.querySelector('.overlay');
  getSignupFormBtn.addEventListener('click', (event) => {
    event.preventDefault();
    overlay.style.display = 'grid';
  });
  getLoginFormBtn.addEventListener('click', (event) => {
    event.preventDefault();
    overlay.style.display = 'none';
  });
}

// translate quotes in sign forms page

let translateWord = document.querySelectorAll('.translate-word');
if (translateWord) {
  translateWord.forEach((element) => {
    element.addEventListener('click', (event) => {
      let parentQuote = event.target.closest('.quote');
      let englishQuote = parentQuote.querySelector('.english-quote');
      let arabicQuote = parentQuote.querySelector('.arabic-quote');
      let translateContent = event.target.closest('.translate-content');
      if (englishQuote.classList.contains('hide')) {
        arabicQuote.classList.add('hide');
        englishQuote.classList.remove('hide');
        translateContent.style = 'justify-content: flex-end';
        event.target.textContent = 'ترجمة';
      } else {
        arabicQuote.classList.remove('hide');
        englishQuote.classList.add('hide');
        translateContent.style = 'justify-content: flex-start';
        event.target.textContent = 'Translate';
      }
    });
  });
}

// hide and view password

let viewIcon = document.querySelectorAll('.view-password-icon');
if (viewIcon) {
  viewIcon.forEach((element) => {
    element.addEventListener('click', (event) => {
      let parent = event.target.closest('.input-content');
      let input = parent.querySelector('input');
      if (input.type == 'password') {
        input.type = 'text';
        event.target.src = '/img/icons/Show.svg';
      } else {
        input.type = 'password';
        event.target.src = '/img/icons/Hide.svg';
      }
    });
  });
}
// scrolling between quotes
let moveRightBtn = document.querySelector('.move-right-btn');
let moveLeftBtn = document.querySelector('.move-left-btn');
if (moveLeftBtn && moveRightBtn) {
  let firstQuote = document.querySelector('.first-quote-section');
  let secondQuote = document.querySelector('.second-quote-section');
  [moveRightBtn, moveLeftBtn].forEach((btn) => {
    btn.addEventListener('click', (event) => {
      event.preventDefault();
      let targetBtn = event.target.closest('.move-btn');
      if (targetBtn.classList.contains('move-right-btn')) {
        secondQuote.classList.remove('move-right');
        firstQuote.classList.add('move-left');
      }
      if (targetBtn.classList.contains('move-left-btn')) {
        firstQuote.classList.remove('move-left');
        secondQuote.classList.add('move-right');
      }
    });
  });
}
// change the current viewed picture to uploaded one

let uploadBtn = document.getElementById('imageUpload');

function readURL(event) {
  const input = event.target; // Use event.target to get the input element
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const imagePreview = document.getElementById('imagePreview');
      imagePreview.style.backgroundImage = 'url(' + e.target.result + ')';
      imagePreview.style.display = 'none';
      imagePreview.style.display = 'block';
      $(imagePreview).fadeIn(650); // Or use vanilla JavaScript for fade effect
    };
    reader.readAsDataURL(input.files[0]);
  }
}

uploadBtn.addEventListener('change', readURL);

// make a request with axios to login
let loginBtn = document.querySelector('.login-btn');
if (loginBtn) {
  loginBtn.addEventListener('click', async (event) => {
    event.target.textContent = 'Loging in...';
    let parent = event.target.closest('.login-form');
    let usernameOrEmail = parent.querySelector('.email-input').value;
    let password = parent.querySelector('.password-input').value;

    const data = {
      username: usernameOrEmail,
      password,
    };
    try {
      let response = await axios.post(
        'http://127.0.0.1:3000/users/login',
        data
      );
      if (response.status == 200) window.location.href = '/';
    } catch (error) {
      let message = document.getElementById('login-message');
      message.classList.remove('hide');
      message.textContent = error.response.data.message;
      event.target.textContent = 'Log in';
    }
  });
}
// make a request to signup
let signupBtn = document.querySelector('.signup-btn');
if (signupBtn) {
  signupBtn.addEventListener('click', async (event) => {
    event.target.textContent = 'Signing up...';
    let parent = event.target.closest('.signup-form');
    let name = parent.querySelector('.name-input').value;
    let username = parent.querySelector('.username-input').value;
    let confirmPassword = parent.querySelector('.confirm-password-input').value;
    let password = parent.querySelector('.password-input').value;
    let email = parent.querySelector('.email-input').value;
    let birthDate = parent.querySelector('.birthdate-input').value;

    let message = document.getElementById('signup-message');
    if (name && username && confirmPassword && password && email && birthDate) {
      const data = {
        name,
        username,
        password,
        email,
        confirmPassword,
        birthDate: new Date(birthDate).toISOString(),
      };
      try {
        let response = await axios.post(
          'http://127.0.0.1:3000/users/signup',
          data
        );
        if (response.status == 200) window.location.href = '/';
      } catch (error) {
        message.classList.remove('hide');
        message.textContent = error.response.data.message;
        event.target.textContent = 'Sign up';
      }
    } else {
      message.classList.remove('hide');
      message.textContent = 'You must fill all fields!.';
      signupBtn.textContent = 'Sign up';
    }
  });
}

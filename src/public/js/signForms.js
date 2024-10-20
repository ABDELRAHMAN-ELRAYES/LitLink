'strict mode';

// transform between singin form and signup form
let getSigninFormBtn = document.querySelector('.get-signin-form-btn');
let getSignupFormBtn = document.querySelector('.get-signup-form-btn');
if (getSigninFormBtn && getSignupFormBtn) {
  let signinForm = document.querySelector('.signin-form');
  let signupForm = document.querySelector('.signup-form');
  [getSigninFormBtn, getSignupFormBtn].forEach((btn) => {
    btn.addEventListener('click', (event) => {
      event.preventDefault();
      if (event.target === getSigninFormBtn) {
        signinForm.classList.remove('move-left');
        signupForm.classList.add('move-right');
      }
      if (event.target === getSignupFormBtn) {
        signinForm.classList.add('move-left');
        signupForm.classList.remove('move-right');
      }
    });
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

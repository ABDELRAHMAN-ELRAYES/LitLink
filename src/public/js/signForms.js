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

// verification form code
const codes = document.querySelectorAll('.code');
if (codes.length != 0) {
  codes[0].focus();

  codes.forEach((code, idx) => {
    code.addEventListener('keydown', (e) => {
      if (e.key >= 0 && e.key <= 9) {
        codes[idx].value = '';
        if (idx < codes.length - 1) {
          setTimeout(() => codes[idx + 1].focus(), 10);
        }
      } else if (e.key === 'Backspace') {
        if (idx > 0) {
          setTimeout(() => codes[idx - 1].focus(), 10);
        }
      }
    });
  });
}
//! switch between countries flags in phone number input
const selectedFlag = document.getElementById('selected-flag');
const flagDropdown = document.getElementById('flag-dropdown');
const phoneInput = document.getElementById('phone');
const flagIcon = document.getElementById('flag-icon');
const defaultCountry = flagDropdown.querySelector(
  '.flag-option[data-code="20"]'
);
flagIcon.textContent = defaultCountry.getAttribute('data-flag');
phoneInput.value = `+${defaultCountry.getAttribute('data-code')} `;

selectedFlag.addEventListener('click', () => {
  flagDropdown.style.display =
    flagDropdown.style.display === 'none' ? 'block' : 'none';
});

document.addEventListener('click', (event) => {
  if (
    !selectedFlag.contains(event.target) &&
    !flagDropdown.contains(event.target)
  ) {
    flagDropdown.style.display = 'none';
  }
});

flagDropdown.addEventListener('click', (event) => {
  if (event.target.classList.contains('flag-option')) {
    const selectedOption = event.target;
    const countryCode = selectedOption.getAttribute('data-code');
    const flag = selectedOption.getAttribute('data-flag');
    phoneInput.value = `+${countryCode} `;
    flagIcon.textContent = flag;
    flagDropdown.style.display = 'none';
  }
});
//! add the data for birthdate select inputs
window.onload = function () {
  const daySelect = document.getElementById('day');
  const monthSelect = document.getElementById('month');
  const yearSelect = document.getElementById('year');

  const currentYear = new Date().getFullYear();
  const oldestYear = currentYear - 100;

  for (let year = currentYear; year >= oldestYear; year--) {
    const option = document.createElement('option');
    option.value = year;
    option.textContent = year;
    yearSelect.appendChild(option);
  }

  for (let day = 1; day <= 31; day++) {
    const option = document.createElement('option');
    option.value = day;
    option.textContent = day;
    daySelect.appendChild(option);
  }

  monthSelect.addEventListener('change', adjustDays);
  yearSelect.addEventListener('change', adjustDays);

  function adjustDays() {
    const month = monthSelect.value;
    const year = yearSelect.value;
    const daysInMonth = new Date(year, month, 0).getDate();

    const selectedDay = daySelect.value;

    daySelect.innerHTML =
      '<option value="" disabled selected hidden>Day</option>';

    for (let day = 1; day <= daysInMonth; day++) {
      const option = document.createElement('option');
      option.value = day;
      option.textContent = day;
      daySelect.appendChild(option);
    }

    if (selectedDay && selectedDay <= daysInMonth) {
      daySelect.value = selectedDay;
    }
  }
};

//! make a request with axios to login
let loginBtn = document.querySelector('.login-btn');
if (loginBtn) {
  loginBtn.addEventListener('click', async (event) => {
    event.preventDefault();
    event.target.textContent = 'Logging in...';
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
        data,
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        window.setTimeout(() => {
          location.assign('/home');
        }, 1000);
      }
    } catch (error) {
      let message = document.getElementById('login-message');
      message.classList.remove('hide');
      message.textContent =
        error.response?.data?.message || 'An error occurred';
      event.target.textContent = 'Log in';
      if (loader) loader.style.opacity = '0';
    }
  });
}
//! make a request to check user signup data
let signupBtn = document.querySelector('.signup-btn');
let userEmail = '';
let verifiedCode = '';
if (signupBtn) {
  // switch when the user click on signup button after enter his data
  let message = document.getElementById('signup-message');
  let signupForm = document.querySelector('.signup-form');
  let verificationForm = document.querySelector('.verification-container');
  const switchSignupFormAndVerificationForm = function (event) {
    signupForm.style = 'transform: translate(-150%, -50%);';
    verificationForm.style = 'transform: translate(-50%, -50%);';
  };
  signupBtn.addEventListener('click', async (event) => {
    let parent = event.target.closest('.signup-form');
    let name = parent.querySelector('.name-input').value;
    let username = parent.querySelector('.username-input').value;
    let confirmPassword = parent.querySelector('.confirm-password-input').value;
    let password = parent.querySelector('.password-input').value;
    let email = parent.querySelector('.email-input').value;
    let phoneNumber = parent.querySelector('.phone-input').value;
    let message = signupForm.querySelector('#signup-message');
    let profilePicture = document.getElementById('imageUpload');
    let loader = document.getElementById('loader-container');

    // get the value of input date (day ,month , year) and convert it to iso string before sending it in request
    let birthdateDay = document.getElementById('day').value;
    let birthdateMonth = document.getElementById('month').value;
    let birthdateyear = document.getElementById('year').value;

    // check if user choose valid year , day and month (not the word itself)
    if (!birthdateDay || !birthdateMonth || !birthdateyear) {
      message.classList.remove('hide');
      message.textContent =
        'You must choose a valid Year , Month and Day of birthdate.';
      loader.style.opacity = '0';
      return;
    }
    const dayNumber = parseInt(birthdateDay, 10);
    const monthNumber = parseInt(birthdateMonth, 10);
    const yearNumber = parseInt(birthdateyear, 10);

    let birthDate = new Date(
      yearNumber,
      monthNumber - 1,
      dayNumber
    ).toISOString();

    // hide error message after each submit
    message.classList.add('hide');
    loader.style.opacity = '1';

    //enforce user to use gmail while signup
    const gmailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

    if (!gmailPattern.test(email)) {
      message.classList.remove('hide');
      message.textContent =
        'Your entered Email is not valid!, choose valid one and try again.';
      loader.style.opacity = '0';
      return;
    }

    //check username pattern
    const usernamePattern = /^[a-zA-Z][a-zA-Z0-9_]*$/;

    if (
      !name ||
      !username ||
      !confirmPassword ||
      !password ||
      !email ||
      !birthDate ||
      !phoneNumber
    ) {
      message.classList.remove('hide');
      message.textContent = 'You must fill all fields!';
      loader.style.opacity = '0';
      return;
    }

    if (!usernamePattern.test(username)) {
      message.classList.remove('hide');
      message.textContent =
        'Invalid username! Username should start with a letter and contain only letters, numbers, or underscores.';
      loader.style.display = 'none';
      return;
    }

    if (/\s/.test(username)) {
      message.classList.remove('hide');
      message.textContent = 'Username should not contain spaces!';
      loader.style.display = 'none';
      return;
    }

    const data = {
      name,
      username,
      password,
      email,
      confirmPassword,
      birthDate,
      phoneNumber,
      profilePicture: profilePicture.files[0] || 'default-user.png',
    };

    //convert data to form format
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('username', data.username);
    formData.append('password', data.password);
    formData.append('email', data.email);
    formData.append('confirmPassword', data.confirmPassword);
    formData.append('birthDate', data.birthDate);
    formData.append('phoneNumber', data.phoneNumber);
    formData.append('profilePicture', data.profilePicture);

    try {
      let response = await axios.post(
        'http://127.0.0.1:3000/users/verify',
        formData,
        {
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      if (response.status === 200) {
        userEmail = response.data.email;
        verifiedCode = response.data.verifiedCode;
        loader.style.display = 'none';
        switchSignupFormAndVerificationForm();
      }
    } catch (error) {
      message.classList.remove('hide');
      message.textContent =
        error.response?.data?.message || 'An error occurred during signup!';
      if (loader) loader.style.opacity = '0';
      signupBtn.textContent = 'Sign up';
    }
  });

  // signup user if he entered correct verification code
  let verificationCodeInputs = document.querySelectorAll('.code');
  let verificationBtn = document.querySelector('.verify-account-btn');
  if (verificationCodeInputs.length != 0 && verificationBtn) {
    message = verificationBtn
      .closest('.verification-container')
      .querySelector('#signup-message');
    verificationBtn.addEventListener('click', async (event) => {
      // get the loader inside verification button
      let loader = document.getElementById('loader-container');

      let verificationCode = Array.from(verificationCodeInputs).reduce(
        (acc, element) => {
          return acc + element.value;
        },
        ''
      );
      loader.style.display = 'grid';
      event.preventDefault();
      event.target.textContent = 'Verifying...';
      try {
        let response = await axios.post(
          'http://127.0.0.1:3000/users/signup',
          {
            email: userEmail,
            enteredCode: verificationCode,
            verifiedCode,
          },
          {
            withCredentials: true,
          }
        );

        if (response.status === 200) {
          loader.style.display = 'none';
          window.location.href = '/home';
        }
      } catch (error) {
        loader.style.display = 'none';
        message.classList.remove('hide');
        message.textContent =
          'The verification code is not correct, Try Again!';
        event.target.textContent = 'Verify';
      }
    });
  }
}

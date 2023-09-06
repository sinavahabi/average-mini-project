"use strict";

// Get elements with DOM searching
const submitBtn = document.querySelector("button.submit-btn");
const form = document.querySelector("form");
const inputs = document.querySelectorAll("input");
const checkPassBtn = document.querySelector("button.check-pass");
const messages = document.querySelectorAll("div.message");


// Change password check button icon when clicked 
checkPassBtn.addEventListener("click", e => {
  // Change password check icon by toggling its elements class name
  e.target.classList.toggle("fa-eye-slash");
  e.target.classList.toggle("fa-eye");

  // Check if input type is password or text and change it accordingly
  const passInput = e.target.parentElement.previousSibling.previousSibling;

  if (passInput.type === "password") {
    passInput.type = "text";
  } else {
    passInput.type = "password";
  }
});


// Prevent default action of form submit button
submitBtn.addEventListener("click", e => {
  e.preventDefault();
  handleLogin();
});

// Define an asynchronous function to check user password and email
async function handleLogin() {
  const emailVal = inputs[0].value;
  const passVal = inputs[1].value;

  try {
    const user = await getUserEmail(emailVal);
    if (user && user.password === passVal) {
      // Hide incorrect email or password message and show success submit message
      messages[2].style.opacity = 0;
      messages[1].style.opacity = 1;
      submitBtn.disabled = true;

      setTimeout(() => {
        form.submit();
      }, 2000);
    } else {
      // Show incorrect email or password message
      messages[2].style.opacity = 1;
    }
  } catch (error) {
    // When there is something wrong with server or etc. "Login failed" message will be shown
    messages[0].style.opacity = 1;
    submitBtn.disabled = true;
  }
}

// Define an asynchronous function to get all user emails and return the email value if it exists
async function getUserEmail(email) {
  try {
    const response = await fetch('https://64f85855824680fd217f6f48.mockapi.io/users', {
      method: "GET",
      headers: { "content-type": "application/json" },
    });

    if (!response.ok) {
      throw new Error("an error occurred");
    }

    // Find and return email to check its value beside the current inserted password value for full sign-in match
    const data = await response.json();
    return data.find((user) => user.email === email);
  } catch (error) {
    throw new Error("Failed to retrieve user data!");
  }
}

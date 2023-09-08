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
    // Assign "getUserEmail" function return value to check if email was found or not
    const user = await getUserEmail(emailVal);

    if (user && user.password === passVal) {
      // Assign "isLogged" function return value to check if user data was (loggedIn property) updated successfully or not
      const log = await isLogged(user.id);

      if (log) {
        // Hide incorrect email or password message and show success submit message
        messages[2].style.opacity = 0;
        messages[1].style.opacity = 1;
        submitBtn.disabled = true;

        setTimeout(() => {
          form.submit();
        }, 2000);
      }
    } else {
      // Show incorrect email or password message
      messages[2].style.opacity = 1;
    }
  } catch (error) {
    // Hide incorrect email or password error message (when loggedIn update fails)
    messages[2].style.opacity = 0;
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

// Define a function to update user data when they are logged in for further process
async function isLogged(userId) {
  try {
    const response = await fetch(`https://64f85855824680fd217f6f48.mockapi.io/users/${userId}`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ loggedIn: true })
    });

    // If code below result become false, any codes after that will be skipped and program will jump to catch condition
    if (!response.ok) {
      throw new Error("an error occurred");
    }

    // Return true when response was Ok and data updated successfully
    return true;
  } catch (error) {
    // By throwing an error this function return value will become false automatically
    throw new Error("Failed to update user data!");
  }
}

"use strict";

// Access elements with DOM searching
const registerMenu = document.querySelector("nav div.register");
const exitMenu = document.querySelector("nav div.exit");
const exitBtn = document.querySelector("nav div.exit button.exit");
const pagesContent = document.querySelectorAll(".page-content");
const qContainer = document.querySelector("div.question-container");
const notLoggedInContent = document.querySelector("div.not-logged-in");
const loginContainer = document.querySelector("div.login-container");
const loginLink = document.querySelector("a.not-logged-in");
const loginSpanElem = document.querySelector("span.not-logged-in");
const pageFooter = document.querySelector("div.footer");
const dropdownButton = document.querySelector("div.dropdown-menu button.dropdown-btn");
const logoutErr = document.querySelector("div.logout-failed");
const loginCheckErr = document.querySelector("div.login-fetch-err");
const logoutSuccessMsg = document.querySelector("div.logout-process");


// Login link actions
loginLink.addEventListener("click", e => {
  // Prevent anchor default action to stop redirecting for a short delay 
  e.preventDefault();
  document.body.style.overflowY = "hidden";

  // Modify element styles
  loginContainer.style.transform = "translateY(1300%)";
  loginLink.style.position = "absolute";
  loginLink.style.transform = "translateX(530%)";
  loginSpanElem.style.opacity = 0;

  // Redirect to target page after 4.5 seconds
  setTimeout(() => {
    window.location.href = "sign-in.html";
  }, 4500);
});


// Logout user when this button menu is clicked
exitBtn.addEventListener("click", () => {
  logoutUser();
});


function handlePageContent(notLoggedInContentVal, pageFooterVal, dropdownButtonVal, exitMenuVal, registerMenuVal, pageContentVal1, pageContentVal2, qContainerVal) {
  // Modify page styles and use display property to show or hide page content accordingly
  notLoggedInContent.style.display = notLoggedInContentVal;
  pageFooter.style.display = pageFooterVal;
  dropdownButton.disabled = dropdownButtonVal;

  exitMenu.hidden = exitMenuVal;
  registerMenu.hidden = registerMenuVal;

  pagesContent.forEach(content => {
    if (content.tagName === "DIV") {
      content.style.display = pageContentVal1;
    } else {
      content.style.display = pageContentVal2;
    }
  });

  if (qContainer) {
    qContainer.style.display = qContainerVal;
  }
}

// Create an asynchronous function to logout the exact logged in user properly
async function logoutUser() {
  try {
    // Find the logged-in user and get their ID
    const response = await fetch('https://64f85855824680fd217f6f48.mockapi.io/users', {
      method: "GET",
      headers: { 'content-type': 'application/json' }
    });

    if (!response.ok) {
      throw new Error("an error occurred!");
    }

    // Find user object dada if exists
    const data = await response.json();
    const loggedInUser = data.find(item => item.loggedIn === true);

    // Use user data to capture user ID
    if (loggedInUser) {
      const userId = loggedInUser.id;

      // Update the logged-in user's status
      const logoutResponse = await fetch(`https://64f85855824680fd217f6f48.mockapi.io/users/${userId}`, {
        method: "PUT",
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ loggedIn: false })
      });

      if (!logoutResponse.ok) {
        throw new Error("an error occurred!");
      }

      // Show logout message
      logoutSuccessMsg.style.width = "20%";
      logoutSuccessMsg.style.backgroundColor = "#14bdff";
      logoutSuccessMsg.style.color = "#fff";
      logoutSuccessMsg.style.minHeight = "50px";

      // Update the UI
      setTimeout(() => {
        logoutSuccessMsg.style.display = "none";
        userLoginCheck();
      }, 2000);
    }
  } catch (error) {
    // When logout request data or data updating encounter issues from server, following actions will occur
    logoutErr.style.transform = "translateY(-40%)";
    // Logout button will be disabled for at least 8 seconds ==> 1.5s until error message transform showing complete + 5s static error message on UI + 1.5s until error message transform hiding complete 
    exitBtn.disabled = true;

    setTimeout(() => {
      logoutErr.style.transform = "translateY(-130%)";
    }, 6500);

    setTimeout(() => {
      exitBtn.disabled = false;
    }, 8000);
  }
}

/* User login check */
async function userLoginCheck() {
  try {
    const response = await fetch('https://64f85855824680fd217f6f48.mockapi.io/users', {
      method: "GET",
      headers: { 'content-type': 'application/json' }
    });

    if (!response.ok) {
      throw new Error("an error occurred!");
    }

    // Check user login status with "some" method boolean return value
    const data = await response.json();
    const isLoggedIn = data.some(item => item.loggedIn === true);

    if (isLoggedIn) {
      handlePageContent("none", "block", false, false, true, "flex", "block", "block");
    } else {
      handlePageContent("block", "block", true, true, false, "none", "none", "none");
    }
  } catch (error) {
    // Fetch error message which will cause whole page content breakdown 
    loginCheckErr.style.display = "block";
    dropdownButton.disabled = true;
  }
}

// Initial check for user login status
userLoginCheck();

"use strict";

// Access desired elements by DOM searching
const navbarContainer = document.querySelector("div.navbar-container");
const menuLists = document.querySelectorAll("ul.nav-list");
const dropdownBtn = document.querySelector("button.dropdown-btn");
const dropdownContainer = document.querySelector("div.dropdown-container");
const handleIcon = document.querySelector("i.dropdown");
const selectContainer = document.querySelector("div.select");
const customizeOptions = document.querySelectorAll("input[data-customize]");
const themeContainer = document.querySelector("div.theme-container");
const menuColorContainer = document.querySelector("div.menu-color-container");
const themeOptions = document.querySelectorAll("input[data-theme]");
const colorOptions = document.querySelectorAll("input[data-color]");
const lightThemeElements = document.querySelectorAll(".dark");
const elementsAffected = document.querySelectorAll(".theme-effective");
const activeList = document.querySelector("li.active a");
const mainCalculateContainer = document.querySelector("div.calculate");
const calculateInputs = document.querySelectorAll("div.form-container div.input-group input");
const customizeFailedErr = document.querySelector("div.customize-failed");

// Color map object constant
const colorMapObj = {
  yellow: { backgroundColor: 'rgb(255, 242, 0)', menuClass: 'yellow' },
  purple: { backgroundColor: '#835acd', menuClass: 'purple' },
  blue: { backgroundColor: '#0070ff', menuClass: 'blue' },
  red: { backgroundColor: '#ff285a', menuClass: 'red' },
};

// Use a counter to notice whether a dropdown menu should hide or show each time the dropdown button is clicked
let counter = 0;
let themeOptionCounter = 0;
let menuColorOptionCounter = 0;

// Initialize an empty variable to store each user specific object response
let userObjResponse;

// Disable dropdown input options until user decides to click on dropdown button to start customization
customizeOptions.forEach(option => {
  option.disabled = true;
  option.style.cursor = "default";
});

// Create an arrow function to handle which option menu is disabled in different circumstances
const handleOptions = (menuOption, disableVal, cursorVal) => {
  menuOption.forEach(option => {
    option.disabled = disableVal;
    option.style.cursor = cursorVal;
  });
};


// Actions defined for dropdown button 
dropdownBtn.addEventListener("click", () => {
  counter++;
  // Show or hide dropdown and button style modifications
  if (counter % 2 === 0) {
    dropdownContainer.style.opacity = 0;
    dropdownBtn.style.transform = "rotate(0deg)";

    // Disable dropdown input options when dropdown menu is closed
    handleOptions(customizeOptions, true, "default");
    handleOptions(themeOptions, true, "default");
    handleOptions(colorOptions, true, "default");
  } else {
    dropdownContainer.style.opacity = 1;
    dropdownBtn.style.transform = "rotate(90deg)";

    // Enable dropdown input options when dropdown menu is opened
    handleOptions(customizeOptions, false, "pointer");
    handleOptions(themeOptions, false, "pointer");
    handleOptions(colorOptions, false, "pointer");
  }
});


// Set customize option menu actions
customizeOptions.forEach(option => {
  option.addEventListener("click", e => {
    if (e.target.dataset.customize === "theme") {
      // Hide color menu option when theme option is chosen
      menuColorContainer.hidden = true;
      e.target.nextSibling.nextSibling.nextSibling.nextSibling.style.borderBottom = "none";
      // Reset color menu counter 
      menuColorOptionCounter = 0;
      // Plus theme option counter by one 
      themeOptionCounter++;

      // Check whether to open or hide theme option menu each time it's being clicked
      if (themeOptionCounter % 2 === 0) {
        themeContainer.hidden = true;
      } else {
        themeContainer.hidden = false;
      }

    } else {
      // Hide theme menu option when color menu option is chosen
      themeContainer.hidden = true;
      // Reset theme option counter
      themeOptionCounter = 0;
      // Plus color menu counter by one 
      menuColorOptionCounter++;

      // Check whether to open or hide color menu option each time it's being clicked additionally change some styles
      if (menuColorOptionCounter % 2 === 0) {
        menuColorContainer.hidden = true;
        e.target.style.borderBottom = "none";
      } else {
        menuColorContainer.hidden = false;

        // Modify some styles for color menu option when theme is light
        if (e.target.classList[2] === "light") {
          e.target.style.borderBottom = "2px solid #333";
        } else {
          e.target.style.borderBottom = "2px solid #fff";
        }
      }
    }
  });
});


/* HANDLE CUSTOMIZATIONS */
// Define an asynchronous function to handle most part of repetitive API requests
async function handleUserCustomization(method = "GET", keyValue = "", keyProp = "") {
  try {
    const response = await fetch('https://64f85855824680fd217f6f48.mockapi.io/users', {
      method: 'GET',
      headers: { 'content-type': 'application/json' }
    });

    if (!response.ok) {
      throw new Error('An error occurred while fetching user data.');
    }

    const data = await response.json();
    // Find online (logged in) user
    const loggedInUser = data.find((item) => item.loggedIn === true);

    if (loggedInUser) {
      // Access the user ID when there is true value returned
      const userId = loggedInUser.id;

      // Use methods and handle their requests accordingly
      if (method === "GET") {
        // Handle "GET" method
        userObjResponse = await fetch(`https://64f85855824680fd217f6f48.mockapi.io/users/${userId}`, {
          method: method,
          headers: { 'content-type': 'application/json' }
        });
      } else {
        // Handle "PUT" method
        userObjResponse = await fetch(`https://64f85855824680fd217f6f48.mockapi.io/users/${userId}`, {
          method: method,
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ [keyProp]: keyValue }),
        });
      }

      if (!userObjResponse.ok) {
        throw new Error('An error occurred while updating user color.');
      }

      const userData = await userObjResponse.json();
      // "initializeThemeColor" and "initializeNavbarColor" have to wait for "handleUserCustomization" function tasks to be completed
      await Promise.all([initializeThemeColor(userData), initializeNavbarColor(userData)]);
    } else {
      // List item with active class list color style modification needed for the time user logs out
      activeList.style.color = "red";
    }
  } catch (error) {
    // Show error message and hide it after 10 seconds
    customizeFailedErr.style.opacity = 1;

    setTimeout(() => {
      customizeFailedErr.style.opacity = 0;
    }, 10000);

    // When "response" constant is not ok!
    if (error.message === "An error occurred while fetching user data.") {
      customizeFailedErr.innerText = "An unexpected error occurred! The customization option may not update correctly at the moment...";
    } else {
      // When "userObjResponse" variable is not ok!
      customizeFailedErr.style.left = "unset";
      customizeFailedErr.style.right = "1%";
      customizeFailedErr.innerText = "We're having some difficulties! The customization option is disabled at the moment...";
      dropdownBtn.disabled = true;
      handleIcon.innerText = "block"
      selectContainer.style.display = "none";
    }
  }
}


/* HANDLE THEME COLOR */
// Set theme color option actions
themeOptions.forEach(themeOption => {
  themeOption.addEventListener("click", e => {
    if (e.target.dataset.theme === "light") {
      // When chosen theme is "light"
      updateUserTheme("light", "#fff", "#333", true);
      // Disable light theme button after user chose light theme
      e.target.disabled = true;
      // Enable dark theme button after user chose light theme
      e.target.previousSibling.previousSibling.previousSibling.previousSibling.disabled = false;
    } else {
      // When chosen theme is "dark"
      updateUserTheme("dark", "#333", "#fff", false);
      // Disable dark theme button after user chose dark theme
      e.target.disabled = true;
      // Enable light theme button after user chose dark theme
      e.target.nextSibling.nextSibling.nextSibling.nextSibling.disabled = false;
    }
  });
});

// Define an asynchronous function to handle user's theme color choice
async function updateUserTheme(themeChoice, backgroundColorVal, colorVal, isLight) {
  handleUserCustomization("PUT", themeChoice, "theme");
  // Call "handleTheme" function to handle UI elements color style modifications 
  handleTheme(themeChoice, backgroundColorVal, colorVal, isLight);
}

// Create an asynchronous function to get theme color data from the server and handle UI modifications accordingly
async function initializeThemeColor(userData) {
  if (userData.theme === "light") {
    handleTheme("light", "#fff", "#333", true);
  } else {
    handleTheme("dark", "#333", "#fff", false);
  }
}

// Define a function to handle theme option style modifications
function handleTheme(themeChoice, backgroundColorVal, colorVal, isLight) {
  document.body.style.backgroundColor = backgroundColorVal;
  document.body.style.color = colorVal;

  // Use all elements with "dark" class name value in order to modify styles further || This includes all pages with dropdown menu
  lightThemeElements.forEach(elem => {
    if (isLight) {
      elem.classList.remove("dark");
      elem.classList.add(themeChoice);
    } else {
      elem.classList.remove("light");
      elem.classList.add(themeChoice);
    }
  });

  // This includes all pages that have following  elements || University and School page
  if (isLight) {
    mainCalculateContainer && mainCalculateContainer.classList.add("main-light");
  } else {
    mainCalculateContainer && mainCalculateContainer.classList.remove("main-light");
  }

  calculateInputs && calculateInputs.forEach(input => {
    if (isLight) {
      input.classList.add("main-light");
    } else {
      input.classList.remove("main-light");
    }
  });

  // Use all elements with "theme-effective" class name value in order to modify styles further || This includes only home page elements
  elementsAffected && elementsAffected.forEach(affected => {
    if (isLight) {
      affected.classList.remove("dark");
      affected.classList.add(themeChoice);
    } else {
      affected.classList.remove("light");
      affected.classList.add(themeChoice);
    }
  });
}


/* HANDLE NAVBAR COLOR */
// Define an asynchronous function to handle user's navbar color choice
async function updateUserColor(choice) {
  handleUserCustomization("PUT", choice, "color");
  // Call "handleMenuColor" function to handle UI elements color style modifications 
  handleMenuColor(choice);
}

// Create a function to change UI styles by adding or removing specific elements class names 
function handleMenuColor(colorChoice) {
  const { menuClass } = colorMapObj[colorChoice];
  activeList.classList.remove(...Object.values(colorMapObj).map((color) => color.menuClass));
  activeList.classList.add(menuClass);

  menuLists.forEach((menuList) => {
    menuList.classList.remove(...Object.values(colorMapObj).map((color) => color.menuClass));
    menuList.classList.add(menuClass);
  });
}

// Set navbar color option actions
colorOptions.forEach(colorOption => {
  colorOption.addEventListener('click', e => {
    // Here is where user choose desired navbar color shown by dropdown button and menu color option below
    const colorChoice = e.target.dataset.color;

    // Modifying navbar color accordingly 
    if (colorChoice && colorMapObj[colorChoice]) {
      navbarContainer.style.backgroundColor = colorMapObj[colorChoice].backgroundColor;
      updateUserColor(colorChoice);
    }
  });
});

// Create an asynchronous function to get navbar color data from the server and handle UI modifications accordingly
async function initializeNavbarColor(userData) {
  // Modifying navbar color accordingly 
  if (userData.color && colorMapObj[userData.color]) {
    const { backgroundColor } = colorMapObj[userData.color];
    navbarContainer.style.backgroundColor = backgroundColor;
    handleMenuColor(userData.color);
  }
}

// Finally invoke "handleUserCustomization" function to handle API requests for user's customization choices
handleUserCustomization();

/* Footer date */
const footerDate = document.querySelector("footer div.date p");
const date = new Date();
const shortDate = String(date).slice(0, 15);
footerDate.innerHTML = `${shortDate}`;

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
const activeList = document.querySelector("li.active a");

// Use a counter to notice whether a dropdown menu should hide or show each time the dropdown button is clicked
let counter = 0;
let themeOptionCounter = 0;
let menuColorOptionCounter = 0;

// Disable dropdown input options until user decides to click on dropdown button to start customization
customizeOptions.forEach(option => {
  option.disabled = true;
  option.style.cursor = "default";
});

const handleOptions = (menuOption, disableVal, cursorVal) => {
  menuOption.forEach(option => {
    option.disabled = disableVal;
    option.style.cursor = cursorVal;
  });
}; 


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

        // Modify some styles fore color menu option when theme is light
        if (e.target.classList[2] === "light") {
          e.target.style.borderBottom = "2px solid #333";
        } else {
          e.target.style.borderBottom = "2px solid #fff";
        }
      }
    }
  });
});


themeOptions.forEach(themeOption => {
  themeOption.addEventListener("click", e => {
    if (e.target.dataset.theme === "light") {
      // When chosen theme is "light"
      handleTheme("#fff", "#333", true);
      // Disable light theme button after user chose light theme
      e.target.disabled = true;
      // Enable dark theme button after user chose light theme
      e.target.previousSibling.previousSibling.previousSibling.previousSibling.disabled = false;
    } else {
      // When chosen theme is "dark"
      handleTheme("#333", "#fff", false);
      // Disable dark theme button after user chose dark theme
      e.target.disabled = true;
      // Enable light theme button after user chose dark theme
      e.target.nextSibling.nextSibling.nextSibling.nextSibling.disabled = false;
    }
  });
});

colorOptions.forEach(colorOption => {
  colorOption.addEventListener("click", e => {
    switch (e.target.dataset.color) {
      case "yellow":
        navbarContainer.style.backgroundColor = "rgb(255, 242, 0)";
        handleMenuColor("purple", "blue", "red", "yellow");
        break;
      case "purple":
        navbarContainer.style.backgroundColor = "#835acd";
        handleMenuColor("yellow", "blue", "red", "purple");
        break;
      case "blue":
        navbarContainer.style.backgroundColor = "#0070ff";
        handleMenuColor("yellow", "purple", "red", "blue");
        break;
      default:
        navbarContainer.style.backgroundColor = "#ff285a";
        handleMenuColor("yellow", "purple", "blue", "red");
        break;
    }
  });
});

// Define a function to handle theme option style modifications
function handleTheme(backgroundColorVal, colorVal, isLight) {
  document.body.style.backgroundColor = backgroundColorVal;
  document.body.style.color = colorVal;

  // Use all elements with "dark" class name value in order to modify styles further
  lightThemeElements.forEach(elem => {
    if (isLight) {
      elem.classList.remove("dark");
      elem.classList.add("light");
    } else {
      elem.classList.remove("light");
      elem.classList.add("dark");
    }
  });
}

function handleMenuColor(removeClassVal1, removeClassVal2, removeClassVal3, addClassVal) {
  // Change "a" element with active class styles, by class name elimination and addition  
  activeList.classList.remove(removeClassVal1, removeClassVal2, removeClassVal3);
  activeList.classList.add(addClassVal);
  // Change "li" elements hover property styles, by class name elimination and addition 
  menuLists.forEach(menuList => {
    menuList.classList.remove(removeClassVal1, removeClassVal2, removeClassVal3);
    menuList.classList.add(addClassVal);
  }); 
}

// Footer date
const footerDate = document.querySelector("footer div.date p");
const date = new Date();
const shortDate = String(date).slice(0, 15);
footerDate.innerHTML = `${shortDate}`;

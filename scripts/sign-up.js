"use strict";

// Get elements by DOM searching
const form = document.querySelector("form");
const submitBtn = document.querySelector("button.submit-btn");
const inputs = document.querySelectorAll("input");
const submitError = document.querySelector("div.submit-error");
const submitSuccess = document.querySelector("div.submit-success");
const closeBtn = document.querySelector("button.close");
const handleIcon = document.querySelector("button.close i");
const checkPassBtn = document.querySelector("button.check-pass");
const handlePassIcon = document.querySelector("button.check-pass i");

// Create form validator error element
const errorContainer = document.createElement("div");

// Define function to handle error messages
const handleError = (classNameValue, innerTextValue, inputElem, inputElemContainer) => {
  errorContainer.className = `${classNameValue}`;

  // Change element inner text based on class name value to show relevant error messages
  if (classNameValue.length === 35 && classNameValue.slice(6, 14) === "password") {
    errorContainer.innerHTML = `<p class=${classNameValue}>Password should contain at least one uppercase letter, one lowercase letter, one number, and a range between 8 to 16 characters. Notice that no special characters are allowed!</p>`;
  }
  else if (classNameValue.length === 36 && classNameValue.slice(6, 15) === "last-name") {
    errorContainer.innerHTML = `<p class=${classNameValue}>Invalid last name format!</p>`;
  }
  else if (classNameValue.length === 37 && classNameValue.slice(6, 16) === "first-name") {
    errorContainer.innerHTML = `<p class=${classNameValue}>Invalid first name format!</p>`;
  } else {
    errorContainer.innerHTML = `<p class=${classNameValue}>${innerTextValue}</p>`;
  }

  // Modify specified input element border styles, the input's parent element (container) and the previous element margin styles accordingly 
  inputElem.style.border = "3px solid #ff2e2e";
  inputElemContainer.before(errorContainer);
  inputElemContainer.style.margin = ".5em 0 1.5em 0";
  inputElemContainer.previousElementSibling.previousElementSibling.style.margin = "1.5em 0 .5em 0";
}


form.addEventListener("input", e => {
  const input = e.target;
  // Check essential validity objects and use handle error function with various arguments based on different conditions
  if (input.validity.valueMissing) {
    handleError(`error ${input.className}-error empty-value`, "This field cannot be empty!", input, input.parentElement);
  }
  if (input.validity.typeMismatch) {
    handleError(`error ${input.className}-error invalid-type`, "Email is not valid!", input, input.parentElement);
  }
  if (input.validity.patternMismatch) {
    handleError(`error ${input.className}-error invalid-format`, "Invalid format!", input, input.parentElement);
  }
  if (input.validity.tooShort) {
    handleError(`error ${input.className}-error short-value`, "Minimum of 3 characters is required!", input, input.parentElement);
  }
  if (input.validity.tooLong) {
    handleError(`error ${input.className}-error long-value`, "Maximum character for this filed is satisfied!", input, input.parentElement);
  }
  // Finally remove error message element and make previous style changes back to default
  if (input.checkValidity()) {
    document.querySelector("div.error") && document.querySelector("div.error").remove();
    input.style.border = "3px solid #464646";
    input.parentElement.previousElementSibling.style.margin = "1.5em 0";
  }
});


// Change password check button icon when clicked 
checkPassBtn.addEventListener("click", e => {
  // Change password check icon by toggling its elements class name
  e.target.classList.toggle("fa-eye-slash");
  e.target.classList.toggle("fa-eye");

  // Check if input type is password or text and change it accordingly
  const passInput = e.target.parentElement.previousElementSibling;
  if (passInput.type === "text") {
    passInput.type = "password";
  } else {
    passInput.type = "text";
  }
})


// Change close button icon when mouse hovers on the element
closeBtn.addEventListener("mouseover", () => {
  handleIcon.classList.toggle("fa-chevron-circle-down");
  handleIcon.classList.toggle("fa-chevron-circle-up");
});


// Change close button icon when mouse hovers on the element
closeBtn.addEventListener("mouseout", () => {
  handleIcon.classList.toggle("fa-chevron-circle-up");
  handleIcon.classList.toggle("fa-chevron-circle-down");

});


// Move the submit error message container to the top where user is not able to see nicely by CSS transition property
closeBtn.addEventListener("click", e => {
  e.target.parentElement.parentElement.style.top = "-100px";
})


// Check form submit validation
submitBtn.addEventListener("click", e => {
  // Show success sing-up message when form values are valid
  if (form.checkValidity()) {
    // Prevent button default submit action 
    e.preventDefault();

    // Hide submit error message
    submitError.style.display = "none";
    submitSuccess.style.top = "0";
    // Disable submit button
    e.target.disabled = true;

    // Submit form after 3 seconds and undo submit button prevent default action
    setTimeout(() => {
      form.submit();
    }, 3000)
  } else {
    // Display error message on UI and prevent default action of submit button on form element
    e.preventDefault();
    submitError.style.display = "flex";
    submitError.style.top = "0";
  }
});


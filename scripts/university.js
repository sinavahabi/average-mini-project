"use strict";

// Get elements by DOM searching
const startButton = document.querySelector("button.start");
const tipsContainer = document.querySelector("div.tips");
const tipsList = document.querySelector("ul.tips-list");
const questionContainer = document.querySelector("div.question");
const calculateContainer = document.querySelector("div.calculate");
const addButton = document.querySelector("button.add");
const calculateButton = document.querySelector("button.calculate-average");
const mainFormsContent = document.querySelector("div.forms");
const topContainer = document.querySelector("div.top");
const bottomContainer = document.querySelector("div.bottom");

/* Create error message for calculation process */
// Div element
const errorContainer = document.createElement("div");
errorContainer.className = "error calculate-error";

// P element
const errorText = document.createElement("p");
errorText.classList = "text error-text";
errorText.innerHTML = "Fix invalid values and <span class=\"save-text\">save</span> changes!";
errorContainer.append(errorText);

// Button element
const closeButton = document.createElement("button");
closeButton.classList = "close close-button";
closeButton.innerHTML = "<i class=\"material-icons\" title=\"close\">close</i>";
errorContainer.append(closeButton);

// Counter that will increase by one each time "Add New Lesson" button is clicked  
let num = 0;
let errorFlag = true;

// Initialize an empty array check inputs with readonly attribute
let checkInputs = [];

// Initialize array and number variables for calculation process
let marksValue = [];
let unitsValue = [];
let multipliedArray = [];
let sumUnit = 0;
let sumResult = 0;


// Actions defined for "Let's Do It" button
startButton.addEventListener("click", () => {
  questionContainer.style.top = "1px";
  questionContainer.style.opacity = 0;

  setTimeout(() => {
    tipsContainer.style.borderColor = "#fff";
    calculateContainer.style.borderColor = "#fff";
    questionContainer.remove();
  }, 4000);

  tipsContainer.style.width = "96%";
  tipsContainer.style.minHeight = "449px";
  tipsContainer.style.height = "auto";

  calculateContainer.style.width = "80%";
  calculateContainer.style.minHeight = "449px";
  calculateContainer.style.height = "auto";



  setTimeout(() => {
    tipsList.style.display = "block";
    topContainer.style.display = "block";
    bottomContainer.style.display = "block";
  }, 6000);
})


// Actions defined for "Add New Lesson" button
addButton.addEventListener("click", () => {
  num++;
  calculateButton.disabled = false;
  calculateButton.style.opacity = 1;
  calculateButton.style.cursor = "pointer";
  // Create form element
  const createForm = document.createElement("form");
  createForm.id = `form-${num}`
  // Create form "innerHTML" value
  const formContent = `
    <div class="form-container">
      <div class="clear-btn">
        <button type="reset" class="clear" title="clear form values">Clear</button>
      </div>
      <div class="input-group">
        <div className="title">
          <label for="title-${num}">Lesson Title:</label>
          <input id="title-${num}" class="title" type="text" maxLength="50" title="enter lesson title">
          <div class="icon-container">
            <i class="fas fa-exclamation-circle title-error-icon"></i>
            <i class="fas fa-check-circle title-valid-icon"></i>
          </div>
        </div>
        <div className="mark">
          <label for="mark-${num}">Lesson Mark:</label>
          <input id="mark-${num}" class="mark" type="number" title="enter lesson mark number">
          <div class="icon-container">
            <i class="fas fa-exclamation-circle mark-error-icon"></i>
            <i class="fas fa-check-circle mark-valid-icon"></i>
          </div>
        </div>
        <div className="unit">
          <label for="unit-${num}">Unit Count:</label>
          <input id="unit-${num}" class="unit" type="number" title="enter lesson unit count">
          <div class="icon-container">
            <i class="fas fa-exclamation-circle unit-error-icon"></i>
            <i class="fas fa-check-circle unit-valid-icon"></i>
          </div>
        </div>
      </div>
      <div class="button-group">
        <button type="button" class="save" onclick="saveForm(event)">Save</button>
        <button type="button" class="edit" onclick="editForm(event)">Edit</button>
        <button type="button" class="delete" title="delete lesson" onclick="delForm(this)">Delete</button>
      </div>
    </div>
    `;
  createForm.innerHTML = formContent;
  mainFormsContent.append(createForm);
});


// Define this function to handle hiding/showing error messages dynamically for each specific input
function errorMessage(element, Color, borderWidth, iconFlag) {
  // create error icons constants by DOM navigation
  const errorIcon = element.nextSibling.nextSibling.childNodes[1];
  const checkIcon = element.nextSibling.nextSibling.childNodes[3];
  // Change input styles dependence to function arguments
  element.style.color = Color;
  element.style.borderColor = Color;
  element.style.borderWidth = borderWidth;
  element.style.padding = ".2em 1.9em .2em .2em";

  // When icon flag argument boolean value is true, error icon will be shown and check icon will be hidden
  if (iconFlag) {
    errorIcon.style.display = "inline-block";
    checkIcon.style.display = "none";
  } else {
    // When icon flag argument boolean value is false, check icon will be shown and error icon will be hidden
    checkIcon.style.display = "inline-block";
    errorIcon.style.display = "none";
    // Also input readonly attribute will be set true for "Calculate Average Mark" button validation later on
    element.readOnly = true;
  }
}

// Function below will be used for title input validation
function textValidator(inputValue, inputElem) {
  if (inputValue.length < 3) {
    // Invalid value message will be shown
    errorMessage(inputElem, "#ff2e2e", "3px", true);
  } else {
    // Valid value message will be shown
    errorMessage(inputElem, "#1ee61e", "3px", false);
  }
}

// Function below will be used for numeric inputs validation
function numberValidator(inputValue, inputElem, num) {
  const invalidNumber = Number(inputValue);
  if (!invalidNumber) {
    // Invalid value message be shown
    errorMessage(inputElem, "#ff2e2e", "3px", true);
  }
  else if (inputValue > num || inputValue < 0) {
    // Invalid value message be shown
    errorMessage(inputElem, "#ff2e2e", "3px", true);
  } else {
    // Valid value message will be shown
    errorMessage(inputElem, "#1ee61e", "3px", false);
  }
}

// "Save" button actions
const saveForm = e => {
  // Form validation and data saving
  const inputGroup = e.target.parentElement.previousSibling.previousSibling.childNodes;
  // Accessing each form element by DOM navigation 
  inputGroup.forEach(element => {
    // Accessing each form input element by DOM navigation 
    if (element.tagName === "DIV") {
      const inputElem = element.childNodes[3];

      // Title input element 
      if (inputElem.className === "title") {
        const titleInput = inputElem;
        textValidator(titleInput.value, titleInput);
      }

      // Mark input element
      if (inputElem.className === "mark") {
        const markInput = inputElem;
        numberValidator(markInput.value, markInput, 20);
      }

      // Unit input element
      if (inputElem.className === "unit") {
        const unitInput = inputElem;
        numberValidator(unitInput.value, unitInput, 5);
      }
    }
  });
};

// "Edit" button actions
const editForm = e => {
  // Make inputs value editable when clicked by DOM navigation
  const inputGroup = e.target.parentElement.previousSibling.previousSibling.childNodes;
  // Accessing each form element by DOM navigation 
  inputGroup.forEach(element => {
    // Accessing each form input element by DOM navigation 
    if (element.tagName === "DIV") {
      const inputElem = element.childNodes[3];
      // Change relevant form input element styles and setting readonly attribute to false
      inputElem.readOnly = false;
      inputElem.style.color = "#fff";
      inputElem.style.borderColor = "#fff";
      inputElem.style.borderWidth = "2px";
      inputElem.style.padding = ".2em";
      // Also hide wether error icon or check icon if their displayed
      inputElem.nextSibling.nextSibling.childNodes[1].style.display = "none";
      inputElem.nextSibling.nextSibling.childNodes[3].style.display = "none";
    }
  });
};

// "Delete" button actions
const delForm = elem => {
  // Remove relevant node (form element)
  const targetForm = elem.closest("form");
  targetForm.remove();
};


// Actions defined after "Calculate Average Mark" clicked
calculateButton.addEventListener("click", () => {
  // Get all available inputs the moment this button is clicked
  const allInputs = document.querySelectorAll("input");
  if (document.querySelector("form")) {
    // Iterate over input list to check if input valid values are saved or not
    allInputs.forEach(input => {
      if (input && !input.readOnly) {
        // Add them to an array if they're not saved yet with valid values
        checkInputs.push(input);
      }
    });

    // When there is no index left on the array error flag will be false and calculation process begins
    if (checkInputs.length === 0) {
      errorFlag = false;
    } else {
      // If not, error flag will stay true and error message will be shown to user
      errorFlag = true;
    }

    showCalculateError();
    // Clear array values to avoid logical bug for next click
    checkInputs = [];
  } else {
    calculateButton.disabled = true;
    calculateButton.style.opacity = .6;
    calculateButton.style.cursor = "default";
  }

});


function showCalculateError() {
  if (errorFlag) {
    if (!document.querySelector("div.calculate-error")) {
      // Add calculation error message to DOM
      topContainer.append(errorContainer);
    }
  } else {
    // Remove calculation error message to DOM
    document.querySelector("div.calculate-error") && document.querySelector("div.calculate-error").remove();
    console.log(handleCalculation());
  }
}

// Define calculation function
function handleCalculation() {
  const marksInput = document.querySelectorAll("input.mark");
  const unitsInput = document.querySelectorAll("input.unit");

  marksInput.forEach(input => {
    marksValue.push(Number(input.value));
  });

  unitsInput.forEach(input => {
    unitsValue.push(Number(input.value));
  });

  // Multiplying each mark number to each relevant unit count
  for (let i = 0; i < marksValue.length; i++) {
    multipliedArray.push(marksValue[i] * unitsValue[i]);
  }

  // Sum above result values "multipliedArray" together
  multipliedArray.forEach(result => {
    sumResult += result;
  });

  // Sum unit count values together
  unitsValue.forEach(unit => {
    sumUnit += unit;
  });

  // Divide --> |sum (mark number * unit count) / sum (unit count)|
  const finalOutput = sumResult / sumUnit;
  return finalOutput;
}


// Close button action for calculation error message
closeButton.addEventListener("click", e => {
  // Find target element with DOM navigation and remove error message
  e.target.parentElement.parentElement.remove();
});


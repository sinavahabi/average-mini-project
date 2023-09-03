"use strict";

// Get elements by DOM searching
const startButton = document.querySelector("button.start");
const asideElem = document.querySelector("aside");
const mainElem = document.querySelector("main");
const tipsContainer = document.querySelector("div.tips");
const tipsList = document.querySelector("ul.tips-list");
const questionContainer = document.querySelector("div.question");
const calculateContainer = document.querySelector("div.calculate");
const addButton = document.querySelector("button.add");
const calculateButton = document.querySelector("button.calculate-average");
const progressElem = document.querySelector("progress.calculate");
const outputText = document.querySelector("p.output-text");
const mainFormsContent = document.querySelector("div.forms");
const topContainer = document.querySelector("div.top");
const bottomContainer = document.querySelector("div.bottom");
const resultContainer = document.querySelector("div.result");
const resultTexts = document.querySelectorAll("div.result span.result");
const resultSpan = document.querySelector("div.result span.final");
const againButtonContainer = document.querySelector("div.again-container");
const againButton = document.querySelector("div.again-container a");

// Access to current page URL
const currentURL = window.location.href;
const pathChars = currentURL.split("/");
const fileName = pathChars[pathChars.length - 1];

/* Light theme constant */
const themeMenuOptions = document.querySelectorAll("input[data-theme]");

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

// Boolean variables to check some conditions
let errorFlag = true;
let calculationIsDone = false;

// Initialize an empty array check inputs with readonly attribute
let checkInputs = [];

// Initialize array and number variables for university calculation process
let marksValue = [];
let unitsValue = [];
let multipliedArray = [];
let sumUnit = 0;
let sumResult = 0;

// Initialize number variable for school calculation process
let schoolMarkSum = 0;

// Define a function  to disable or enable a specific button element on different circumstances
function buttonHandler(buttonElem, disabledVal, opacityVal, cursorVal) {
  buttonElem.disabled = disabledVal;
  buttonElem.style.opacity = opacityVal;
  buttonElem.style.cursor = cursorVal;
}

// Disable calculate button when program starts
buttonHandler(calculateButton, true, .6, "default");
//Disable "Add New Lesson" button until it appears on UI 
buttonHandler(addButton, true, 1, "default");
// Disable "Calculate Another Average" button until calculation process is done and final result is shown on UI
buttonHandler(againButton, true, 1, "default");
// Disable the link as well
againButton.href = "javascript:void(0)";
resultContainer.style.cursor = "default";


// Actions defined for "Let's Do It" button
startButton.addEventListener("click", () => {
  // Light theme style modifications
  handleMainTheme();
  // Move the element to the top with CSS transition property, Then disappear slowly
  questionContainer.style.top = "0";
  questionContainer.style.opacity = 0;

  // Both containers will not be displayed until previous element vanishes (takes 4 seconds until previous element action is done) 
  setTimeout(() => {
    tipsContainer.style.boxShadow = "0 0 10px rgba(16, 16, 16, .6)";
    calculateContainer.style.boxShadow = "0 0 10px rgba(16, 16, 16, .6)";
    questionContainer.remove();
  }, 4000);

  // Style tips container as it should look like 
  tipsContainer.style.width = "80%";
  tipsContainer.style.minHeight = "449px";
  tipsContainer.style.height = "auto";

  // Style tips container as it should look like 
  calculateContainer.style.width = "80%";
  calculateContainer.style.minHeight = "449px";
  calculateContainer.style.height = "auto";

  // Display containers content after all previous actions are done
  setTimeout(() => {
    tipsList.style.display = "block";
    topContainer.style.display = "block";
    bottomContainer.style.display = "block";
    // Enable "Add New Lesson" button when calculation container appears on UI
    buttonHandler(addButton, false, 1, "pointer");
  }, 6000);
})


// Actions defined for "Add New Lesson" button
addButton.addEventListener("click", () => {
  num++;

  // Enable calculate button if calculation process hasn't started yet
  if (!calculationIsDone) {
    buttonHandler(calculateButton, false, 1, "pointer");
  }

  if (fileName === "university.html") {
    handleFormContent(
      "title-error-icon",
      "title-valid-icon",
      "mark-error-icon",
      "mark-valid-icon",
      "Engineering-Mathematics",
      `
      <div className="unit">
        <label for="unit-${num}">Unit Count:</label>
        <input id="unit-${num}" class="unit" type="number" title="enter lesson unit count" placeholder="3">
        <div class="icon-container">
          <i class="fas fa-exclamation-circle unit-error-icon"></i>
          <i class="fas fa-check-circle unit-valid-icon"></i>
        </div>
      </div>
      `
    );
  } else {
    handleFormContent("school-title-error", "school-title-valid", "school-mark-error", "school-mark-valid", "Math");
  }

  // Light theme style modifications
  handleMainTheme();
});


// Create and add input forms accordingly to current page URL
function handleFormContent(titleErrorIcon, titleValidIcon, markErrorIcon, markValidIcon, placeholderVal, inputContent = "") {
  // Create form element
  const createForm = document.createElement("form");
  createForm.id = `form-${num}`;

  // Create form "innerHTML" value
  const formContent = `
      <div class="form-container">
        <div class="clear-btn">
          <button type="reset" class="clear" title="clear form values">Clear</button>
        </div>
        <div class="input-group">
          <div className="title">
            <label for="title-${num}">Lesson Title:</label>
            <input id="title-${num}" class="title" type="text" maxLength="50" title="enter lesson title" placeholder=${placeholderVal}>
            <div class="icon-container">
              <i class="fas fa-exclamation-circle ${titleErrorIcon}"></i>
              <i class="fas fa-check-circle ${titleValidIcon}"></i>
            </div>
          </div>
          <div className="mark">
            <label for="mark-${num}">Lesson Mark:</label>
            <input id="mark-${num}" class="mark" type="number" title="enter lesson mark number" placeholder="17.5">
            <div class="icon-container">
              <i class="fas fa-exclamation-circle ${markErrorIcon}"></i>
              <i class="fas fa-check-circle ${markValidIcon}"></i>
            </div>
          </div>
          ${inputContent}
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
}

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
      if (inputElem.className === "title" || inputElem.className === "title main-light") {
        const titleInput = inputElem;
        textValidator(titleInput.value, titleInput);
      }

      // Mark input element
      if (inputElem.className === "mark" || inputElem.className === "mark main-light") {
        const markInput = inputElem;
        numberValidator(markInput.value, markInput, 20);
      }

      // Unit input element
      if (inputElem.className === "unit" || inputElem.className === "unit main-light") {
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
      inputElem.style.borderWidth = "2px";
      inputElem.style.padding = ".2em";
      // Also hide whether error icon or check icon if their displayed
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

  // Disable calculation button when there is no form left
  const forms = document.querySelectorAll("form");
  if (forms && forms.length === 0) {
    buttonHandler(calculateButton, true, .6, "default");
  }
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
    buttonHandler(calculateButton, true, .6, "default");
  }

});


// Close button action for calculation error message
closeButton.addEventListener("click", e => {
  // Find target element with DOM navigation and remove error message
  e.target.parentElement.parentElement.remove();
});


// Show calculation error or successful result message
function showCalculateError() {
  if (errorFlag) {
    if (!document.querySelector("div.calculate-error")) {
      // Add calculation error message to DOM
      topContainer.append(errorContainer);
    }
  } else {
    // Remove calculation error message to DOM
    document.querySelector("div.calculate-error") && document.querySelector("div.calculate-error").remove();

    // Set boolean variable to true when calculation is happening successfully
    calculationIsDone = true;

    // Disable calculate button and add new lesson when calculation process begins
    buttonHandler(calculateButton, true, .6, "default");
    buttonHandler(addButton, true, .6, "default");

    // Do output math
    handleCalculation();

    // Show output on UI
    showOutput();
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

  // When page URL is "university.html" file name
  if (fileName === "university.html") {
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
    let finalOutput = sumResult / sumUnit;
    handleOutputResult(finalOutput, 12);

  } else {
    // When page URL is "school.html" file name
    marksValue.forEach(schoolMark => {
      schoolMarkSum += schoolMark;
    });

    let schoolFinalOutput = schoolMarkSum / Number(marksInput.length);
    handleOutputResult(schoolFinalOutput, 10);
  }

}

// Create following function to implement same styles for both university and school final outputs
function handleOutputResult(finalOutputVal, checkNum) {
  // Change output display colors on UI accordingly 
  if (finalOutputVal >= 17) {
    resultSpan.style.color = "#1ee61e";
  }
  else if (finalOutputVal < 17 && finalOutputVal >= checkNum) {
    resultSpan.style.color = "#0064ff";
  } else {
    resultSpan.style.color = "tomato";
  }

  // Make output number length limited to 5 characters
  finalOutputVal = String(finalOutputVal).slice(0, 5);
  resultSpan.innerHTML = `${finalOutputVal}`;
  return resultSpan;
}

// Define output styles modifications function
function showOutput() {
  // Disable all input buttons
  const clearButton = document.querySelectorAll("div.clear-btn button.clear");
  const buttonsGroup = document.querySelectorAll("div.button-group button");

  clearButton.forEach(button => {
    button.disabled = true;
  });

  buttonsGroup.forEach(button => {
    button.disabled = true;
  });
  // UI changes after calculation process successfully begins
  calculateButton.style.margin = "6rem auto";
  calculateButton.style.transform = "rotate(720deg)";
  calculateButton.style.transition = "transform 3s";
  // Show progress bar styles modifications
  progressElem.hidden = false;
  outputText.hidden = false;

  const progressInterval = setInterval(() => {
    progressElem.value += .1655;
  }, 450);

  setTimeout(() => {
    clearInterval(progressInterval);
    outputText.innerText = "Done ✔️";;
    progressElem.value = 1;
  }, 3000);

  // Disappear all elements to show final output after
  calculateContainer.style.opacity = 0;
  tipsContainer.style.opacity = 0;
  resultContainer.style.width = "50%";

  // Show output  result in UI
  resultTexts.forEach(span => {
    span.style.opacity = 1;
  });

  setTimeout(() => {
    calculateContainer.innerHTML = "";
    asideElem.remove();
    mainElem.style.width = "100%";
    resultContainer.style.height = "65px";
    resultContainer.style.borderColor = "slateblue";
  }, 7000);

  setTimeout(() => {
    // Enable "Calculate Another Average" button and link reference
    buttonHandler(againButton, false, 1, "pointer");

    if (fileName === "university.html") {
      againButton.href = "university.html";
    } else {
      againButton.href = "school.html";
    }

    againButton.title = "wanna go again for another calculation average mark?";
  }, 18000);

  resultContainer.style.top = "-450px";
  againButtonContainer.style.opacity = 1;
  againButtonContainer.style.top = "-350px";
}


// Light theme style modifications
themeMenuOptions.forEach(themeOption => {
  themeOption.addEventListener("click", e => {
    if (e.target.dataset.theme === "light") {
      // When chosen theme is "light"
      handleMainTheme();
    } else {
      // When chosen theme is "dark"
      handleMainTheme();
    }
  });
});

// Create function to handle university and school page theme changes
function handleMainTheme() {
  // Create a constant array of all form inputs
  const darkInputs = document.querySelectorAll("div.calculate input");
  // Access to body element by DOM searching to check whether theme is light or dark with body background color property
  const bodyElemStyle = document.body.style.backgroundColor;

  // When body style background color is light
  if (bodyElemStyle && bodyElemStyle === "rgb(255, 255, 255)") {
    calculateContainer.classList.add("main-light");
    darkInputs.forEach(darkInput => {
      darkInput.classList.add("main-light");
    });
    // When body style background color is dark
  } else {
    calculateContainer.classList.remove("main-light");
    darkInputs.forEach(darkInput => {
      darkInput.classList.remove("main-light");
    });
  }
}

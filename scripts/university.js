"use strict";

// Counter that will increase by one each time "Add New Lesson" button is clicked  
let num = 0;
let markNumberFlag = false;
let markRangeFlag = false;
let unitNumberFlag = false;
let unitRangeFlag = false;
let textFlag = false;

// Get elements by DOM searching
const addButton = document.querySelector("button.add");

// Actions defined for "Add New Lesson" button
addButton.addEventListener("click", () => {
  num++;
  const createForm = document.createElement("form");
  createForm.id = `form-${num}`
  // Create form "innerHTML" value
  const formContent = `
    <div class="form-container">
      <div class="clear-btn">
        <button type="reset" class="clear" title="clear form values">Clear</button>
      </div>
      <div class="input-group">
        <label for="title-${num}">Lesson Title:</label>
        <input id="title-${num}" class="title" type="text" maxLength="50" title="enter lesson title">
        <label for="mark-${num}">Lesson Mark:</label>
        <input id="mark-${num}" class="mark" type="number" title="enter lesson mark number">
        <label for="unit-${num}">Unit Count:</label>
        <input id="unit-${num}" class="unit" type="number" title="enter lesson unit count">
      </div>
      <div class="button-group">
        <button type="button" class="save" onclick="saveForm(event)">Save</button>
        <button type="button" class="edit" onclick="editForm(event)">Edit</button>
        <button type="button" class="delete" title="delete lesson" onclick="delForm(this)">Delete</button>
      </div>
    </div>
    `;
  createForm.innerHTML = formContent;
  addButton.after(createForm);
});

// Number type validation
function numberValidator(inputValue, inputElem, className) {
  // Create a constant to check number type validity
  const validNumber = Number(inputValue);
  // When input value type is not a number
  if (!validNumber) {
    // Check if the error message already exists to avoid error messages overflow on DOM 
    if (!document.querySelector(`small.invalid-${className}-number`)) {
      // Create error message when it doesn't exists on DOM
      const invalidNumber = document.createElement("div");
      const invalidNumberMessage = document.createElement("small");
      invalidNumber.append(invalidNumberMessage);
      invalidNumberMessage.innerText = "Please enter a valid number";
      invalidNumberMessage.className = `error invalid-${className}-number`;
      inputElem.after(invalidNumber);

      // Check class name to change boolean value based on relevant flag
      if (className === "mark") {
        // When each flag is false, it means there's an error and input values cannot be saved
        markNumberFlag = false;
      } else {
        unitNumberFlag = false;
      }
    }
  } else {
    // Clear error message from UI when input value is valid
    document.querySelector(`small.invalid-${className}-number`) && document.querySelector(`small.invalid-${className}-number`).remove();

    // Check class name to change boolean value based on relevant flag
    if (className === "mark") {
      // When each flag is true, it means there's no error and input values can be saved
      markNumberFlag = true;
    } else {
      unitNumberFlag = true;
    }
  }
}

// Number range validation
function rangeValidator(inputValue, inputElem, className, num1, num2) {
  // When numbers are not in a valid range
  if (inputValue < num1 || inputValue > num2) {
    // Check if the error message already exists to avoid error messages overflow on DOM 
    if (!document.querySelector(`small.invalid-${className}`)) {
      // Create error message when it doesn't exists on DOM
      const invalidMark = document.createElement("div");
      const invalidMarkMessage = document.createElement("small");
      invalidMark.append(invalidMarkMessage);
      invalidMarkMessage.innerText = `Number range must be between ${num1}-${num2}!`;
      invalidMarkMessage.className = `error invalid-${className}`;
      inputElem.after(invalidMark);

      // Check class name to change boolean value based on relevant flag
      if (className === "mark") {
        // When each flag is false, it means there's an error and input values cannot be saved
        markRangeFlag = false;
      } else {
        unitRangeFlag = false;
      }
    }
  } else {
    // Clear error message from UI when input value is valid
    document.querySelector(`small.invalid-${className}`) && document.querySelector(`small.invalid-${className}`).remove();

    // Check class name to change boolean value based on relevant flag
    if (className === "mark") {
      // When each flag is true, it means there's no error and input values can be saved
      markRangeFlag = true;
    } else {
      unitRangeFlag = true;
    }
  }
}

// Title text validation
function textValidator(inputValue, inputElem, className1, className2, num1, num2, textContent1, textContent2) {
  // When input text value is empty
  if (inputValue.length === num1) {
    // First check and delete short value error message
    document.querySelector(`small.short-${className2}`) && document.querySelector(`small.short-${className2}`).remove();
    // Check if the error message already exists to avoid error messages overflow on DOM 
    if (!document.querySelector(`small.empty-${className1}`)) {
      // Create error message when it doesn't exists on DOM
      const emptyValue = document.createElement("div");
      const emptyValueMessage = document.createElement("small");
      emptyValue.append(emptyValueMessage);
      emptyValueMessage.innerText = textContent1;
      emptyValueMessage.className = `error empty-${className1}`;
      inputElem.after(emptyValue);
      // Flag is false when there is text input value error 
      textFlag = false;
    }
  }
  // When input text value characters are less than 3
  else if (inputValue.length < num2) {
    // First check and delete empty value error message
    document.querySelector(`small.empty-${className1}`) && document.querySelector(`small.empty-${className1}`).remove();
    // Check if the error message already exists to avoid error messages overflow on DOM 
    if (!document.querySelector(`small.short-${className2}`)) {
      // Create error message when it doesn't exists on DOM
      const shortLength = document.createElement("div");
      const shortLengthMessage = document.createElement("small");
      shortLength.append(shortLengthMessage);
      shortLengthMessage.innerText = textContent2;
      shortLengthMessage.className = `error short-${className2}`;
      inputElem.after(shortLength);
      // Flag is false when there is text input value error 
      textFlag = false;
    }
  } else {
    // Clear error messages from UI when all input values are valid
    document.querySelector(`small.empty-${className1}`) && document.querySelector(`small.empty-${className1}`).remove();
    document.querySelector(`small.short-${className2}`) && document.querySelector(`small.short-${className2}`).remove();
    // Flag is true when there is no text input value error 
    textFlag = true;
  }
}

// "Save" button actions
const saveForm = e => {
  // Form validation and data saving
  const inputs = e.target.parentElement.previousSibling.previousSibling.childNodes;
  inputs.forEach(input => {
    // Number input validator
    if (input.tagName === "INPUT" && input.className === "mark") {
      numberValidator(input.value, input, "mark");
      rangeValidator(input.value, input, "mark", 0, 20);
      console.log(`number flag: ${markNumberFlag}, range flag: ${markRangeFlag}`);

      // Check and save relevant input value when all flags are true
      if (markNumberFlag && markRangeFlag) {
        input.readOnly = true;
      }
    }
    if (input.tagName === "INPUT" && input.className === "unit") {
      numberValidator(input.value, input, "unit");
      rangeValidator(input.value, input, "unit", 0, 5);
      console.log(`number flag: ${unitNumberFlag}, range flag: ${unitRangeFlag}`);

      // Check and save relevant input value when all flags are true
      if (unitNumberFlag && unitRangeFlag) {
        input.readOnly = true;
      }
    }

    // Title input validator
    if (input.tagName === "INPUT" && input.type === "text") {
      textValidator(input.value, input, "value", "length", 0, 3, "This field cannot be empty!", "Must be more than 3 characters!");
      console.log("text flag:", textFlag);

      // Check and save relevant input value when flag is true
      if (textFlag) {
        input.readOnly = true;
      }
    }
  });
};



// "Edit" button actions
const editForm = e => {
  // Make inputs value editable when clicked
  const inputs = e.target.parentElement.previousSibling.previousSibling.childNodes;
  inputs.forEach(input => {
    if (input.tagName === "INPUT" && input.readOnly) {
      input.readOnly = false;
    }
  });
};

// "Delete" button actions
const delForm = elem => {
  const targetForm = elem.closest("form");
  targetForm.remove();
};

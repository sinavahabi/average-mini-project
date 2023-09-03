"use strict";

// Get elements by DOM searching
const sidebar = document.querySelector("div.sidebar-menu");
const universityBtn = document.querySelector("button.university");
const schoolBtn = document.querySelector("button.school");
const universityMainElem = document.querySelector("main.university");
const schoolMainElem = document.querySelector("main.school");
const universityList = document.querySelector("ul.university-scores");
const schoolList = document.querySelector("ul.school-scores");
const errorContainer = document.querySelector("div.err-container");
const closeError = document.querySelector("button.close-err");
const waitMessage = document.querySelector("div.wait-message");

// Initialize an empty variable
let loadingMessage;
// Create boolean variables to check whether another task (API request) is done 
let isSchoolDone = true;
let isUniversityDone = true;

// Define a function to handle API response messages
function handleMessage(className, innerContent, innerText, elemPos) {
  // Create loading message or error message accordingly
  const message = document.createElement("div");
  message.classList.add("response-message", className);
  message.innerHTML = `<p class=${innerContent}>${innerText}</p>`;
  elemPos.prepend(message);
}

// Handle which request is applied by clicking on the activity button
const handleRequest = (path, mainElem, listElem, isUniversity) => {
  // Using setTimeout with 100ms delay to have access on loading message properly
  setTimeout(() => {
    if (isUniversity) {
      // Check the condition to detect the result container that the request was applied to
      loadingMessage = document.querySelector("div.loading-message-university");
    } else {
      loadingMessage = document.querySelector("div.loading-message-school");
    }
  }, 100);

  // Define an asynchronous function use API
  async function requestData() {
    try {
      // Requesting API from server with 'POST' method
      const response = await fetch(`https://64f35596edfa0459f6c6808d.mockapi.io/${path}`, {
        method: 'GET',
        headers: { 'content-type': 'application/json' },
      });

      if (response.ok) {
        // Remove loading message if the response is successful
        loadingMessage.remove();

        // Here program decides which activity task (API request) is done and will let the other button work completely
        if (isUniversity) {
          isUniversityDone = true;
        } else {
          isSchoolDone = true;
        }
      } else {
        // Program will stop using catch statement by throwing an error 
        throw new Error("an error occurred!");
      }

      // Parsing returned response to JSON
      const data = await response.json();

      // Handle received data and add it to DOM
      setTimeout(() => {
        data.map((item, index) => {
          const newListItem = document.createElement("li");
          newListItem.classList = `list-score-${index + 1}`;
          newListItem.innerHTML = `
          <h4 class="score-title">${item.title} ${index + 1}: </h4>
          <p class="score-number">${item.score}</p>
        `;

          listElem.append(newListItem);
        });
      }, 500)

    } catch (error) {
      // Remove loading message and show fetch error message when response is unsuccessful
      loadingMessage.remove();
      errorContainer.hidden = false;
      // "waiting message for the other activity" will go back (hide) again
      waitMessage.style.transform = "translateX(100%)";

      // Add error message in relevant result container when response is unsuccessful
      handleMessage("error-message", "error-text", "Your request couldn't satisfy...", mainElem);
    }
  }

  // Invoke function
  requestData();
};


// Actions defined for activity button related to university result container
universityBtn.addEventListener("click", e => {
  // First university task check will be set to false, meaning that university task is not done yet!
  isUniversityDone = false;

  /* 
    When school task (the other activity button) is done, then university task will have permission to start
    Note: Basically when page loads up for the first time both button boolean checkers are set to true. This code snippet will only be useful when 
    the other button is used prior to this one. In that case, then this code will keep user waiting until the other button activity is done.
  */
  if (isSchoolDone) {
    // Applying style modifications and button disability
    e.target.disabled = true;
    e.target.style.opacity = 0;

    // Removing the button completely after it's hidden on the UI 
    setTimeout(() => {
      e.target.remove();
    }, 1500);

    handleRequest("university-scores", universityMainElem, universityList, true);
    // Create and show loading message on UI when relevant button is clicked
    handleMessage("loading-message-university", "loading-text", "Loading...", universityMainElem);
    // Waiting message will hide again when the other button activity is done and actions related to this result container are performing
    waitMessage.style.transform = "translateX(100%)";
  } else {
    // While school task is not done, waiting message will be shown on UI
    waitMessage.style.transform = "translateX(8%)";
  }
});


// Actions defined for activity button related to school result container
schoolBtn.addEventListener("click", e => {
  // First school task check will be set to false, meaning that school task is not done yet!
  isSchoolDone = false;

  /* 
    When school task (the other activity button) is done, then school task will have permission to start
    Note: Basically when page loads up for the first time both button boolean checkers are set to true. This code snippet will only be useful when 
    the other button is used prior to this one. In that case, then this code will keep user waiting until the other button activity is done.
  */
  if (isUniversityDone) {
    // Applying style modifications and button disability
    e.target.disabled = true;
    e.target.style.opacity = 0;

    // Removing the button completely after it's hidden on the UI 
    setTimeout(() => {
      e.target.remove();
    }, 1500);

    handleRequest("school-scores", schoolMainElem, schoolList, false);
    // Create and show loading message on UI when relevant button is clicked
    handleMessage("loading-message-school", "loading-text", "Loading...", schoolMainElem);
    // Waiting message will hide again when the other button activity is done and actions related to this result container are performing
    waitMessage.style.transform = "translateX(100%)";
  } else {
    // While university task is not done, waiting message will be shown on UI
    waitMessage.style.transform = "translateX(8%)";
  }
});


// Actions defined for close error button
closeError.addEventListener("click", e => {
  const errContainer = e.target.parentElement.parentElement;
  errContainer.style.bottom = "20px";
});


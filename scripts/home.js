"use strict";

// Get elements by DOM searching
const sidebar = document.querySelector("div.sidebar-menu");
const sidebarList = document.querySelectorAll("div.sidebar-menu ul.sidebar-list li");
const sidebarBtn = document.querySelector("button.sidebar-btn");
const menuIcon = document.querySelector("i.fa-angle-double-right");
const resultContainers = document.querySelectorAll("div.result-container");
const h2Titles = document.querySelectorAll("h2.h2-title");
const resultFooters = document.querySelectorAll("footer.result-footer");
const universityBtn = document.querySelector("button.university");
const schoolBtn = document.querySelector("button.school");
const messagesIcon = document.querySelectorAll("div.msg p");
const universityMainElem = document.querySelector("main.university");
const schoolMainElem = document.querySelector("main.school");
const universityList = document.querySelector("ul.university-scores");
const schoolList = document.querySelector("ul.school-scores");
const emptyUniversityRecord = document.querySelector("li.empty-university");
const emptySchoolRecord = document.querySelector("li.empty-school");
const universityTitles = document.querySelector("main.university li.list-title.intro");
const schoolTitles = document.querySelector("main.school li.list-title.intro");
const errorContainer = document.querySelector("div.err-container");
const closeError = document.querySelector("button.close-err");
const waitMessage = document.querySelector("div.wait-message");
const universityUpdate = document.querySelector("div.university-update");
const schoolUpdate = document.querySelector("div.school-update");
const universityUpdateErr = document.querySelector("div.university-update-err");
const schoolUpdateErr = document.querySelector("div.school-update-err");

/* Light theme constant */
const themeMenuOps = document.querySelectorAll("input[data-theme]");

// Variable for sidebar menu move counts
let menuMoves = 0;

// Initialize an empty variable to handle loading messages
let loadingMessage;

// Create boolean variables to check whether another task (API request) is done 
let isSchoolDone = true;
let isUniversityDone = true;

// Initialize empty variables for inputs 
let schoolInputs;
let universityInputs;
let id = 0;

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
        // Program will stop because of catch statement usage by throwing an error 
        throw new Error("an error occurred!");
      }

      // Parsing returned response to JSON
      const data = await response.json();

      // Handle received data and add it to DOM
      setTimeout(() => {
        // When there is no recent data on server
        if (data.length === 0) {
          if (isUniversity) {
            // When this state happens on university data record
            emptyUniversityRecord.style.display = "block";
          } else {
            // When this state happens on university data record
            emptySchoolRecord.style.display = "block";
          }
        } else {
          // Show titles and data 
          if (isUniversity) {
            universityTitles.style.display = "flex";
          } else {
            schoolTitles.style.display = "flex";
          }
          data.map((item, index) => {
            const newListItem = document.createElement("li");
            newListItem.classList = `list-score-${index + 1}`;
            newListItem.innerHTML = `
              <h4 class="score-title">
                <input title="edit title" class="items-title input-${item.id}" type="text" value="${item.title}"/>
              </h4>
              <p class="score-number">${item.score}</p>
              <span class="counter">
                <i class='fas fa-circle'></i>${index + 1}
              </span>
            `;

            listElem.append(newListItem);
          });
        }
      }, 500);

      // Using input elements to modify each average mark calculation record by user choice
      setTimeout(() => {
        if (isUniversity) {
          // Use university result container when input title edition is happening on that container
          universityInputs = document.querySelectorAll("main.university h4.score-title input");
          handleUpdates(universityInputs, "university-scores", universityUpdate, universityUpdateErr);
        } else {
          // Use university result container when input title edition is happening on that container
          schoolInputs = document.querySelectorAll("main.school h4.score-title input");
          handleUpdates(schoolInputs, "school-scores", schoolUpdate, schoolUpdateErr);
        }
      }, 1000);

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

    setTimeout(() => {
      waitMessage.style.transform = "translateX(100%)";
    }, 10000);
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

    setTimeout(() => {
      waitMessage.style.transform = "translateX(100%)";
    }, 10000);
  }
});


// Actions defined for close error button
closeError.addEventListener("click", e => {
  const errContainer = e.target.parentElement.parentElement;
  errContainer.style.bottom = "20px";
});


// Actions defined for sidebar button 
sidebarBtn.addEventListener("click", () => {
  menuMoves++;

  // Go back outside UI
  if (menuMoves % 2 === 0) {
    sidebar.style.transform = "translateX(-100%)";
    menuIcon.classList.remove("fa-angle-double-left");
    menuIcon.classList.add("fa-angle-double-right");
  } else {
    sidebar.style.transform = "translateX(0%)";
    menuIcon.classList.remove("fa-angle-double-right");
    menuIcon.classList.add("fa-angle-double-left");
  }
});

// Create function to handle "PUT" method on different result container input elements
function handleUpdates(inputsList, path, updateMessage, updateMessageErr) {
  // Actions defined on input titles
  inputsList && inputsList.forEach(input => {
    // Basically when focus from input element is out, title edition will occur and save using API
    input.addEventListener("focusout", e => {
      // Capturing each object "ID" by adding it to each input class name first and capturing it here again second
      const stringVal = e.target.classList[1];
      const stringLength = stringVal.length;

      switch (stringLength) {
        case 7:
          id = stringVal.slice(stringLength - 1, stringLength);
          break;
        case 8:
          id = stringVal.slice(stringLength - 2, stringLength);
          break;
        case 9:
          id = stringVal.slice(stringLength - 3, stringLength);
          break;
        default:
          id = stringVal.slice(stringLength - 4, stringLength);
          break;
      }
      // Above statement helps to identify each object precisely to perform edition by user and saving it correctly

      async function updateTitle() {
        try {
          // Requesting API from server with 'POST' method
          const response = await fetch(`https://64f35596edfa0459f6c6808d.mockapi.io/${path}/${id}`, {
            method: 'PUT',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ title: e.target.value })
          });

          // Success title update message will be shown for a short period of time when "PUT" method worked correctly
          if (response.ok) {
            updateMessage.style.transform = "translate(-10%)";

            setTimeout(() => {
              updateMessage.style.transform = "translate(-100%)";
            }, 2000);
          } else {
            // Program will stop because of catch statement usage by throwing an error 
            throw new Error("an error occurred!");
          }
        } catch (error) {
          // Unsuccess title update error message will be shown for a short period of time when "PUT" method didn't work correctly
          updateMessageErr.style.transform = "translate(10%)";

          setTimeout(() => {
            updateMessageErr.style.transform = "translate(100%)";
          }, 2000);
        }
      }

      updateTitle();
    });
  });
}

// Light theme style modifications
themeMenuOps.forEach(themeOption => {
  themeOption.addEventListener("click", e => {
    if (e.target.dataset.theme === "light") {
      // When chosen theme is "light"
      handleHomeTheme(true);
    } else {
      // When chosen theme is "dark"
      handleHomeTheme(false);
    }
  });
});

// Create function to toggle target elements class name to modify color styles based on current theme
function toggleElements(elements, isLight) {
  elements.forEach(element => {
    if (isLight) {
      element.classList.add("light");
      element.classList.remove("dark");
    } else {
      element.classList.remove("light");
      element.classList.add("dark");
    }
  });
}

function handleHomeTheme(isLight) {
  const elementsToToggle = [
    sidebar,
    sidebarBtn,
    menuIcon,
    ...sidebarList,
    ...resultContainers,
    ...h2Titles,
    ...resultFooters,
    ...messagesIcon,
  ];
  // Use "..." operator in order to expand arrays to more elements (inside indexes elements)

  toggleElements(elementsToToggle, isLight);
}

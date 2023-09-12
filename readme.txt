Average Mark Calculation Website

Languages: JavaScript, HTML, CSS 

Topics: Vanilla JS, API, JSON, Parallax web page, Theme customize, customizable, Error handling, User interaction, User management, Form validation, Responsive website, Responsive design, Bootstrap5, Font awesome, Git

"Note: The main page is "index.html" file for user to begin with."

At the beginning user will face a parallax web page which will have small UI modifications by scrolling vertically. When the user reaches the bottom of the web page there is a "Let's Start" button waiting to be clicked in order to navigate user to the home page.
Be aware that the only page that doesn't include a responsive design concept is this one "index.html".
After all mentioned processes worked successfully and a user was navigated to the home page, they either should be logged in with their information or not. 
So in this state, they will face a message that guides them to the login page by default. all menu options are disabled in this state such as the customization option at the top right side of the navbar container.
Even if they try to be navigated to the university or school page they will face a similar message to the home page which asks them to log in for website features and services.
They are also able to choose either sign-up or sign-in shown at the center of the navbar menu.
For the first time, they need to sign up first and sign in second. On the sign-up page user has to fill the form correctly.
The sign-up page includes a strong form validator with designed error messages that will pop up on the DOM as long as a user is not behaving as expected.
There are error messages and success messages which will be shown on UI according to different circumstances. Also they have to insert an unique email, otherwise sign up process will not continue until they insert an valid unique email address.
When everything worked fine they will be redirected to the login page after successful submit message pops up with a short delay.
On the login page user needs to fill up the form correctly based on registered an unique email with a strong password.
Like the other designed pages, there will be successful login message or the other error messages based on different circumstances.
After user data was send to a free JSON server with API, on login page they are used to validate user info with another boolean object property called loggedIn.
This will help to check whether user a specific user is logged in or not at the moment to behave and show UI options accordingly.
When they go through a successful login process, they are redirected to the home page and when they boolean object property called loggedIn was true, they can start using website features and services.
There is a sidebar at the left side of the web page which includes some tips and guidance for user to use website services more efficiently. This sidebar job is simple and translates smoothly on UI. Users can choose whether to use the sidebar button in order to show or hide the sidebar menu.
There are two result containers for both university and school GPA records. When they don't have any previous usage of university or school page features and services, a different message will be shown on the UI with an empty container.
But if they do, All previously calculated GPA records will be shown after they click on the "Show Activity" button. With a short delay and a "Loading..." message, they should have their results right away.
Otherwise based on server or internet issues there might be error messages accordingly on the UI. Because the result of previous records will be an asynchronous process which will get data from the server with API methods.
Users can customize the page theme and navbar color with the customize option available on all main pages such as the home page, university and school page as long as the user is logged in. All asynchronous processes are handled properly with success or unsuccess messages that will pop up on UI based on different circumstances.
The university and school pages are most likely working with familiar states. Their feature for user is GPA "Grade Point Average" calculation with a simple form.
Tips are shown on the UI beside the form which handles the calculation part based on inserted input values by the user. I also need to mention that both university and school page forms contain a very accurate form validator.
Each lesson form has 3 or 2 inputs based on page content (school forms only contain lesson titles and marks but university on the other hand also includes unit count input as well).
After user fills the form correctly and saves all form values, calculation process can begin. All designed pages contain error handling on each term to avoid probable bugs as much as possible.
Technologies used in this project were: Pure JavaScript (Vanilla JS), HTML5, Pure CSS3, Bootstrap5 for the help page, and the other technologies and concepts mentioned at the top level of the "readme.txt" file.

Note: All pages follow the responsive design concept except "index.html" which only works perfectly on desktop devices.
Note: This mini project was completely handled by git.
Note: Codes documentation and descriptions are more obvious in comments among the codes on each file.

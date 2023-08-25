"use strict";

// Footer date
const footerDate = document.querySelector("footer div.date p");
const date = new Date();
const shortDate = String(date).slice(0,15);
footerDate.innerHTML = `${shortDate}`;

'use strict';

// Accessing to necessary elements by DOM searching
const firstPage = document.querySelector('.firstpage');
const secondPage = document.querySelector('.secondpage');
const thirdPage = document.querySelector('.thirdpage');
const mainTitle = document.querySelector('.firstpage h1');
const background = document.querySelector('.background');
const foreground = document.querySelector('.foreground');
const middleGround = document.querySelector('.middleground');
const spans = document.querySelectorAll('.secondpage h1 span');
const FIRST_PAGE_MAX_SCROLL = 500;
const FIRST_TRANS_MIN = 400;
const FIRST_TRANS_MAX = 600;
const SECONDPAGE_BR = 1100;

// Third page will stay hidden until page scroll reach to desired position
thirdPage.style.opacity = 0;

document.addEventListener("scroll", () => {
  let scrollOffset = window.pageYOffset;

  if (scrollOffset <= FIRST_PAGE_MAX_SCROLL) {
    secondPage.style.opacity = 0;
    firstPage.style.opacity = 1;
    let p = scrollOffset / FIRST_PAGE_MAX_SCROLL;

    mainTitle.style.transform = `scale(${1 + (0.1 + p)})`;
    background.style.transform = `scale(${1 + (0.6 * p)})`;
    foreground.style.transform = `scale(${1 + p})`;
    middleGround.style.transform = `scale(${1 + (0.4 * p)})`;
  }

  if (scrollOffset > FIRST_TRANS_MIN && scrollOffset <= FIRST_TRANS_MAX) {
    let op = scrollOffset / FIRST_TRANS_MAX;
    firstPage.style.opacity = 1 - op;
    secondPage.style.opacity = op;
  } else if (scrollOffset > FIRST_TRANS_MAX && scrollOffset <= SECONDPAGE_BR) {
    let yChanger = scrollOffset - FIRST_TRANS_MAX;

    spans[0].style.transform = `translate3d(0, ${yChanger}px,0)`;
    spans[2].style.transform = `translate3d(0, -${yChanger}px,0)`;
  } else {
    let thirdScroll = scrollOffset - SECONDPAGE_BR;
    thirdPage.style.opacity = 1;

    app.style.transform = `translate3d(0, -${thirdScroll}px,0)`;
  }
});

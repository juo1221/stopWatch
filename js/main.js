"use strict";

const button = document.querySelector(".btn-start");
const autoBtn = document.querySelector(".btns-auto");

const studyTime = document.querySelector(".main-time--time-study");
const playTime = document.querySelector(".main-time--time-play");
const input = document.querySelector("#input");
const form = document.querySelector("#form");
let studyInterval;
let playInterval;
let studyCount = 0;
let playCount = 0;

function init() {
  playSound();
  onClick();
}
function playSound() {
  //
}
function onClick() {
  button.classList.toggle("focused");
  autoBtn.style.display = "none";

  if (button.matches(".focused")) {
    clearInterval(playInterval);
    button.innerHTML = "play";
    studyInterval = setInterval(() => {
      studyCount++;
      createTime(studyTime, studyCount);
    }, 1000);
  } else {
    clearInterval(studyInterval);
    button.innerHTML = "study";
    playInterval = setInterval(() => {
      playCount++;
      createTime(playTime, playCount);
    }, 1000);
  }
}

function createTime(time, count) {
  const hour = parseInt(count / 3600);
  const min = parseInt(count / 60);
  const sec = count;

  const SH2 = parseInt(hour / 10) % 2;
  const SH1 = hour % 10;

  const SM2 = parseInt(min / 10) % 6;
  const SM1 = min % 10;

  const SS2 = parseInt(sec / 10) % 6;
  const SS1 = sec % 10;

  time.innerHTML = `${SH2}${SH1} : ${SM2}${SM1} : ${SS2}${SS1}`;
}

function onSubmit(e, text) {
  e.preventDefault();
  if (text === "" || text !== "finish") {
    initiateInput();
    return;
  }
  initiateInput();
  studyCount = playCount = 0;
  clearInterval(studyInterval);
  clearInterval(playInterval);
  studyTime.innerHTML = `00 : 00 : 00`;
  playTime.innerHTML = `00 : 00 : 00`;
}

function initiateInput() {
  input.value = "";
  input.focus();
}

button.addEventListener("click", () => {
  init();
});

form.addEventListener("submit", (e) => onSubmit(e, input.value));

export { studyCount, playCount, studyTime, playTime, autoBtn, createTime };

"use strict";
import { createTime, playTime, studyTime } from "./main.js";
const autoBtn = document.querySelector(".btns-auto");
const button = document.querySelector(".btn-start");
const video = document.querySelector("#video");
const overay = document.querySelector("#overay");
const videoWrapper = document.querySelector("#video-wrapper");
const faceDetectorOptions = new faceapi.TinyFaceDetectorOptions({
  inputSize: 160,
});

let studyCount2 = 0;
let playCount2 = 0;
let stopAutoTime;

const withFaceLandmarksTinyModel = true;

function init() {
  videoWrapper.classList.remove("remove");
  removeBtn();
  run();
}

async function run() {
  await Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri("/weights"),
    faceapi.nets.faceExpressionNet.loadFromUri("/weights"),
    faceapi.nets.faceLandmark68TinyNet.loadFromUri("/weights"),
  ]);

  const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
  video.srcObject = stream;

  video.addEventListener("play", detect);
}

function removeBtn() {
  button.classList.add("remove");
  autoBtn.classList.add("invisible");
}

function detect() {
  stopAutoTime = setTimeout(async () => {
    const results = await faceapi
      .detectSingleFace(video, faceDetectorOptions)
      .withFaceLandmarks(withFaceLandmarksTinyModel)
      .withFaceExpressions();

    if (results === undefined) {
      playCount2++;
      createTime(playTime, playCount2);
      requestAnimationFrame(detect);
    } else {
      const dims = faceapi.matchDimensions(overlay, video, true);
      const resizedResults = faceapi.resizeResults(results, dims);
      faceapi.draw.drawDetections(overlay, resizedResults);

      studyCount2++;
      createTime(studyTime, studyCount2);
      requestAnimationFrame(detect);
    }
  }, 1000);
}

autoBtn.addEventListener("click", init);

export { stopAutoTime };

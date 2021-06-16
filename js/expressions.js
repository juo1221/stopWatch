"use strict";
import { createTime, playTime, studyTime, autoBtn } from "./main.js";
const button = document.querySelector(".btn-start");
const video = document.querySelector("#video");
const overay = document.querySelector("#overay");
const faceDetectorOptions = new faceapi.TinyFaceDetectorOptions({
  inputSize: 160,
});

let studyCount2 = 0;
let playCount2 = 0;

const withFaceLandmarksTinyModel = true;

async function run() {
  removeBtn();
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
  button.style.display = "none";
  autoBtn.style.visibility = "hidden";
}

function detect() {
  setTimeout(async () => {
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

autoBtn.addEventListener("click", run);

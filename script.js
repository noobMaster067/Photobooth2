alert("slot test 3.1");

const video = document.getElementById("camera");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const button = document.getElementById("btn");
const countdown = document.getElementById("countdown");

const TOTAL_PHOTOS = 3;
let photos = [];

// Load template FIRST
const template = new Image();
template.src = "template.png";

template.onload = () => {
  console.log("Template loaded:", template.width, template.height);
};

// Start camera
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => video.srcObject = stream)
  .catch(() => alert("Camera permission denied"));

// Capture photo
function capturePhoto() {
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = video.videoWidth;
  tempCanvas.height = video.videoHeight;
  tempCanvas.getContext("2d").drawImage(video, 0, 0);
  photos.push(tempCanvas.toDataURL("image/png"));
}

// Countdown
function startSession(photoIndex = 0) {
  let count = 3;
  countdown.style.display = "block";
  countdown.innerText = count;

  const timer = setInterval(() => {
    count--;
    countdown.innerText = count;

    if (count === 0) {
      clearInterval(timer);
      countdown.style.display = "none";
      capturePhoto();

      if (photoIndex + 1 < TOTAL_PHOTOS) {
        setTimeout(() => startSession(photoIndex + 1), 500);
      } else {
        drawTemplate();
      }
    }
  }, 1000);
}

// Draw result
function drawTemplate() {
  // FORCE canvas size
  canvas.width = 1200;
  canvas.height = 3600;

  // Draw template
  ctx.drawImage(template, 0, 0);

  const slots = [
    { x: 129, y: 120, w: 940, h: 940},
    { x: 129, y: 1170, w: 940, h: 940},
    { x: 129, y: 2220, w: 940, h: 940}
  ];

  photos.forEach((src, i) => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      ctx.drawImage(img, slots[i].x, slots[i].y, 940, 940);
    };
  });

  // Show canvas
  canvas.style.display = "flex";
}

// Button
button.onclick = () => {
  photos = [];
  canvas.style.display = "none";
  startSession();
};
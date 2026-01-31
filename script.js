const video = document.getElementById("camera");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const button = document.getElementById("btn");
const countdown = document.getElementById("countdown");

const template = new Image();
template.src = "template.png";

const TOTAL_PHOTOS = 3;
let photos = [];

// Start camera
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => video.srcObject = stream)
  .catch(() => alert("Camera permission denied"));

// Capture a photo
function capturePhoto() {
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = video.videoWidth;
  tempCanvas.height = video.videoHeight;
  tempCanvas.getContext("2d").drawImage(video, 0, 0);
  photos.push(tempCanvas.toDataURL("image/png"));
}

// Countdown + photo logic
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

// Draw photos on template
function drawTemplate() {
  canvas.width = template.width;
  canvas.height = template.height;
  ctx.drawImage(template, 0, 0);

  const slots = [
    { x: 40, y: 80 },
    { x: 40, y: 420 },
    { x: 40, y: 760 }
  ];

  photos.forEach((src, i) => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      ctx.drawImage(img, slots[i].x, slots[i].y, 360, 280);
    };
  });

  canvas.style.display = "block";
  photos = [];
}

// Button click
button.onclick = () => {
  canvas.style.display = "none";
  photos = [];
  startSession();
};
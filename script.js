alert("test ver2.0")
const video = document.getElementById("camera");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const button = document.getElementById("btn");
const countdown = document.getElementById("countdown");

const template = new Image();
template.src = "template.png";
template.crossOrigin = "anonymous";

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

// Countdown + capture
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
        setTimeout(() => startSession(photoIndex + 1), 1000);
      } else {
        drawTemplate();
      }
    }
  }, 1000);
}

// Draw template + photos
function drawTemplate() {
  if (!template.complete) {
    template.onload = drawTemplate;
    return;
  }

  canvas.width = 1200;
  canvas.height = 3600;
  canvas.style.display = "block";

  ctx.drawImage(template, 0, 0, canvas.width, canvas.height);

  const slots = [
    { x: 126, y: 124, w: 940, h: 940 },
    { x: 126, y: 1174, w: 940, h: 940 },
    { x: 126, y: 2224, w: 940, h: 940 }
  ];

  photos.forEach((src, i) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;
    img.onload = () => {
      ctx.drawImage(img, slots[i].x, slots[i].y, slots[i].w, slots[i].h);
    };
  });

  photos = [];
}

// Button
button.onclick = () => {
  canvas.style.display = "none";
  photos = [];
  startSession();
};
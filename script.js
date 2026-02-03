alert("test 3.6");

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

  const tctx = tempCanvas.getContext("2d");

  // Mirror capture (same as preview)
  tctx.translate(tempCanvas.width, 0);
  tctx.scale(-1, 1);
  tctx.drawImage(video, 0, 0);

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
  canvas.width = 1200;
  canvas.height = 3600;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(template, 0, 0, canvas.width, canvas.height);

  const slots = [
    { x: 129, y: 120, w: 940, h: 940 },
    { x: 129, y: 1170, w: 940, h: 940 },
    { x: 129, y: 2220, w: 940, h: 940 }
  ];

  let loadedCount = 0;

  photos.forEach((src, i) => {
    const img = new Image();
    img.src = src;

    img.onload = () => {
      // crop to square (no squish)
      const size = Math.min(img.width, img.height);
      const sx = (img.width - size) / 2;
      const sy = (img.height - size) / 2;

      ctx.drawImage(
        img,
        sx, sy, size, size,
        slots[i].x, slots[i].y,
        slots[i].w, slots[i].h
      );

      loadedCount++;

      // ✅ ONLY redirect when ALL photos are drawn
      if (loadedCount === photos.length) {
        const finalImage = canvas.toDataURL("image/png");
        sessionStorage.setItem("finalPhoto", finalImage);
        window.location.href = "preview.html";
      }
    };
  });
}

// Button
button.onclick = () => {
  photos = [];
  canvas.style.display = "none";
  startSession();
};
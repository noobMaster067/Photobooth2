alert("test ver2.4")
// Elements
const video = document.getElementById("camera");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const button = document.getElementById("btn");
const countdown = document.getElementById("countdown");

// Template
const template = new Image();
template.src = "template.png";
template.crossOrigin = "anonymous";

// Settings
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

// Countdown + capture sequence
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
        // Small delay before next photo
        setTimeout(() => startSession(photoIndex + 1), 1000);
      } else {
        drawTemplate();
      }
    }
  }, 1000);
}

// Draw template + photos
function drawTemplate() {
  canvas.width = 1200;
  canvas.height = 3600;
  canvas.style.display = "block";

  // Wait for template to load
  const loadTemplate = new Promise((resolve, reject) => {
    if (template.complete) resolve();
    else template.onload = () => resolve();
    template.onerror = () => reject("Template failed to load");
  });

  // Wait for all photos to load
  const loadPhotos = photos.map(src => new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;
    img.onload = () => resolve(img);
    img.onerror = () => reject("Photo failed to load");
  }));

  // Draw everything once all loaded
  Promise.all([loadTemplate, ...loadPhotos])
    .then(loaded => {
      // First item is template
      ctx.drawImage(template, 0, 0, canvas.width, canvas.height);

      // Define slots
      const slots = [
        { x: 126, y: 124, w: 940, h: 940 },
        { x: 126, y: 1174, w: 940, h: 940 },
        { x: 126, y: 2224, w: 940, h: 940 }
      ];

      // Draw each photo
      loaded.slice(1).forEach((img, i) => {
        ctx.drawImage(img, slots[i].x, slots[i].y, slots[i].w, slots[i].h);
      });

      // Clear photos array
      photos = [];
    })
    .catch(err => console.error(err));
}

// Button click
button.onclick = () => {
  canvas.style.display = "none";
  photos = [];
  startSession();
};
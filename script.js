alert("test ver3.0")
const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const countdown = document.getElementById("countdown");
const startBtn = document.getElementById("start");

let photos = [];

navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => video.srcObject = stream);

startBtn.onclick = async () => {
  photos = [];
  for (let i = 0; i < 3; i++) {
    await runCountdown();
    takePhoto();
  }
  localStorage.setItem("photos", JSON.stringify(photos));
  window.location.href = "result.html";
};

function runCountdown() {
  return new Promise(resolve => {
    let time = 3;
    countdown.textContent = time;
    const interval = setInterval(() => {
      time--;
      countdown.textContent = time;
      if (time === 0) {
        clearInterval(interval);
        countdown.textContent = "";
        resolve();
      }
    }, 1000);
  });
}

function takePhoto() {
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  photos.push(canvas.toDataURL("image/png"));
}
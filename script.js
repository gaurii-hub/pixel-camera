const video = document.getElementById("video");

const captureButton =
  document.getElementById("capture");

const downloadButton =
  document.getElementById("download");

const downloadBig =
  document.getElementById("downloadBig");

const restartButton =
  document.getElementById("restart");

const mirrorButton =
  document.getElementById("mirror");

const flash =
  document.getElementById("flash");

const filterLabel =
  document.getElementById("filterLabel");

const filters =
  document.querySelectorAll(".filter");

const result =
  document.getElementById("result");

const photo =
  document.getElementById("photo");

const closeResult =
  document.getElementById("closeResult");


let stream = null;

let mirrored = true;

let selectedFilter = "normal";

let capturedPhoto = null;


/* =========================
   CAMERA
========================= */

async function startCamera() {

  try {

    if (stream) {

      stream.getTracks().forEach(
        track => track.stop()
      );

    }

    stream =
      await navigator.mediaDevices.getUserMedia({

        video: {
          facingMode: "user",

          width: {
            ideal: 1280
          },

          height: {
            ideal: 720
          }
        },

        audio: false

      });

    video.srcObject = stream;

    video.style.transform =
      mirrored
        ? "scaleX(-1)"
        : "scaleX(1)";

  }

  catch (error) {

    console.error(error);

    alert(
      "Camera access was blocked. Please allow camera access in your browser."
    );

  }

}


/* =========================
   START CAMERA
========================= */

startCamera();


/* =========================
   FILTERS
========================= */

filters.forEach(button => {

  button.addEventListener(
    "click",
    () => {

      filters.forEach(
        item =>
          item.classList.remove("active")
      );

      button.classList.add("active");

      selectedFilter =
        button.dataset.filter;

      filterLabel.textContent =
        button.dataset.name;

      video.style.filter =
        getFilterCSS(selectedFilter);

    }
  );

});


function getFilterCSS(filter) {

  switch (filter) {

    case "y2k":

      return `
        saturate(1.6)
        contrast(1.1)
        hue-rotate(15deg)
        brightness(1.05)
      `;

    case "dreamy":

      return `
        brightness(1.15)
        saturate(1.25)
        contrast(.88)
      `;

    case "noir":

      return `
        grayscale(1)
        contrast(1.35)
      `;

    case "vhs":

      return `
        saturate(1.45)
        contrast(1.2)
        sepia(.2)
      `;

    case "warm":

      return `
        sepia(.25)
        saturate(1.4)
        brightness(1.05)
      `;

    case "cyber":

      return `
        saturate(2)
        contrast(1.25)
        hue-rotate(280deg)
      `;

    default:

      return "none";

  }

}


/* =========================
   MIRROR
========================= */

mirrorButton.addEventListener(
  "click",
  () => {

    mirrored = !mirrored;

    video.style.transform =
      mirrored
        ? "scaleX(-1)"
        : "scaleX(1)";

  }
);


/* =========================
   TAKE PHOTO
========================= */

captureButton.addEventListener(
  "click",
  takePhoto
);


function takePhoto() {

  if (!video.videoWidth) {

    alert("Camera isn't ready yet.");

    return;

  }


  /* FLASH */

  flash.classList.remove("active");

  void flash.offsetWidth;

  flash.classList.add("active");


  /* CANVAS */

  const canvas =
    document.createElement("canvas");

  canvas.width =
    video.videoWidth;

  canvas.height =
    video.videoHeight;


  const ctx =
    canvas.getContext("2d");


  /* MIRROR */

  if (mirrored) {

    ctx.translate(
      canvas.width,
      0
    );

    ctx.scale(-1, 1);

  }


  /* FILTER */

  ctx.filter =
    getCanvasFilter(selectedFilter);


  /* DRAW */

  ctx.drawImage(
    video,
    0,
    0,
    canvas.width,
    canvas.height
  );


  /* RESET FILTER */

  ctx.filter = "none";


  /* SAVE */

  capturedPhoto =
    canvas.toDataURL(
      "image/png"
    );


  photo.src =
    capturedPhoto;


  result.classList.remove(
    "hidden"
  );

}


/* =========================
   CANVAS FILTERS
========================= */

function getCanvasFilter(filter) {

  switch (filter) {

    case "y2k":

      return `
        saturate(1.6)
        contrast(1.1)
        hue-rotate(15deg)
        brightness(1.05)
      `;

    case "dreamy":

      return `
        brightness(1.15)
        saturate(1.25)
        contrast(.88)
      `;

    case "noir":

      return `
        grayscale(1)
        contrast(1.35)
      `;

    case "vhs":

      return `
        saturate(1.45)
        contrast(1.2)
        sepia(.2)
      `;

    case "warm":

      return `
        sepia(.25)
        saturate(1.4)
        brightness(1.05)
      `;

    case "cyber":

      return `
        saturate(2)
        contrast(1.25)
        hue-rotate(280deg)
      `;

    default:

      return "none";

  }

}


/* =========================
   DOWNLOAD
========================= */

function downloadPhoto() {

  if (!capturedPhoto) {

    return;

  }


  const link =
    document.createElement("a");

  link.href =
    capturedPhoto;

  link.download =
    `pixel-${selectedFilter}.png`;

  link.click();

}


downloadButton.addEventListener(
  "click",
  downloadPhoto
);

downloadBig.addEventListener(
  "click",
  downloadPhoto
);


/* =========================
   RESTART CAMERA
========================= */

restartButton.addEventListener(
  "click",
  startCamera
);


/* =========================
   CLOSE PHOTO
========================= */

closeResult.addEventListener(
  "click",
  () => {

    result.classList.add(
      "hidden"
    );

  }
);

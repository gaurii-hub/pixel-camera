const video =
  document.getElementById("video");

const canvas =
  document.getElementById("canvas");

const captureButton =
  document.getElementById("capture");

const restartButton =
  document.getElementById("restart");

const mirrorButton =
  document.getElementById("mirror");

const quickDownload =
  document.getElementById("quickDownload");

const flash =
  document.getElementById("flash");

const countdown =
  document.getElementById("countdown");

const currentFilter =
  document.getElementById("currentFilter");

const filters =
  document.querySelectorAll(".filter");

const modal =
  document.getElementById("modal");

const closeModal =
  document.getElementById("closeModal");

const capturedPhoto =
  document.getElementById("capturedPhoto");

const caption =
  document.getElementById("caption");

const captionPreview =
  document.getElementById("captionPreview");

const dateText =
  document.getElementById("dateText");

const polaroid =
  document.getElementById("polaroid");

const downloadPolaroid =
  document.getElementById("downloadPolaroid");

const stickerLayer =
  document.getElementById("stickerLayer");

const colorButtons =
  document.querySelectorAll(".color");

const stickerButtons =
  document.querySelectorAll(".sticker");


let stream = null;

let mirrored = true;

let selectedFilter = "normal";

let selectedColor = "classic";

let capturedImage = null;


/* =====================================
   START CAMERA
===================================== */

async function startCamera() {

  try {

    if (stream) {

      stream
        .getTracks()
        .forEach(
          track => track.stop()
        );

    }


    stream =
      await navigator.mediaDevices
        .getUserMedia({

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


    video.srcObject =
      stream;


    video.style.transform =
      mirrored
        ? "scaleX(-1)"
        : "scaleX(1)";

  }

  catch (error) {

    console.error(error);

    alert(
      "Please allow camera access to use the photo booth ♡"
    );

  }

}


startCamera();


/* =====================================
   FILTERS
===================================== */

filters.forEach(button => {

  button.addEventListener(
    "click",
    () => {

      filters.forEach(
        item =>
          item.classList.remove(
            "active"
          )
      );


      button.classList.add(
        "active"
      );


      selectedFilter =
        button.dataset.filter;


      currentFilter.textContent =
        button.dataset.name;


      video.style.filter =
        getFilter(selectedFilter);

    }

  );

});


function getFilter(filter) {

  switch (filter) {

    case "pink":

      return `
        brightness(1.08)
        saturate(1.3)
        contrast(.95)
        sepia(.08)
        hue-rotate(330deg)
      `;


    case "strawberry":

      return `
        saturate(1.6)
        contrast(1.03)
        sepia(.1)
        hue-rotate(345deg)
      `;


    case "bubblegum":

      return `
        brightness(1.12)
        saturate(1.55)
        contrast(.88)
        hue-rotate(320deg)
      `;


    case "y2k":

      return `
        saturate(1.7)
        contrast(1.12)
        brightness(1.04)
        hue-rotate(12deg)
      `;


    case "fairy":

      return `
        brightness(1.16)
        saturate(1.15)
        contrast(.84)
        blur(.1px)
      `;


    case "vhs":

      return `
        saturate(1.5)
        contrast(1.2)
        sepia(.2)
        hue-rotate(350deg)
      `;


    case "warm":

      return `
        sepia(.25)
        saturate(1.35)
        brightness(1.08)
        contrast(.95)
      `;


    case "cozy":

      return `
        sepia(.18)
        saturate(.85)
        brightness(1.04)
        contrast(.92)
      `;


    case "cherry":

      return `
        saturate(1.7)
        contrast(1.1)
        sepia(.12)
        hue-rotate(345deg)
      `;


    case "ice":

      return `
        saturate(1.15)
        brightness(1.08)
        contrast(1.05)
        hue-rotate(175deg)
      `;


    case "noir":

      return `
        grayscale(1)
        contrast(1.35)
      `;


    default:

      return "none";

  }

}


/* =====================================
   MIRROR
===================================== */

mirrorButton.addEventListener(
  "click",
  () => {

    mirrored =
      !mirrored;


    video.style.transform =
      mirrored
        ? "scaleX(-1)"
        : "scaleX(1)";

  }
);


/* =====================================
   COUNTDOWN
===================================== */

function runCountdown() {

  return new Promise(resolve => {

    let number = 3;


    countdown.textContent =
      number;

    countdown.style.opacity =
      "1";


    const interval =
      setInterval(() => {

        number--;


        if (number <= 0) {

          clearInterval(interval);

          countdown.textContent =
            "";

          countdown.style.opacity =
            "0";

          resolve();

          return;

        }


        countdown.textContent =
          number;

      }, 800);

  });

}


/* =====================================
   TAKE PHOTO
===================================== */

captureButton.addEventListener(
  "click",
  async () => {

    if (!video.videoWidth) {

      alert(
        "Camera is still loading ♡"
      );

      return;

    }


    captureButton.disabled =
      true;


    await runCountdown();


    takePhoto();


    captureButton.disabled =
      false;

  }
);


/* =====================================
   TAKE PHOTO FUNCTION
===================================== */

function takePhoto() {

  const width =
    video.videoWidth;

  const height =
    video.videoHeight;


  canvas.width =
    width;

  canvas.height =
    height;


  const ctx =
    canvas.getContext("2d");


  /*
    Mirror image
  */

  if (mirrored) {

    ctx.translate(
      width,
      0
    );

    ctx.scale(
      -1,
      1
    );

  }


  /*
    Apply filter
  */

  ctx.filter =
    getFilter(selectedFilter);


  /*
    Draw image
  */

  ctx.drawImage(
    video,
    0,
    0,
    width,
    height
  );


  /*
    Reset transformations
  */

  ctx.setTransform(
    1,
    0,
    0,
    1,
    0,
    0
  );


  ctx.filter =
    "none";


  /*
    Convert to image
  */

  capturedImage =
    canvas.toDataURL(
      "image/png"
    );


  /*
    Show flash
  */

  flash.classList.remove(
    "active"
  );

  void flash.offsetWidth;

  flash.classList.add(
    "active"
  );


  /*
    Put image in Polaroid
  */

  capturedPhoto.src =
    capturedImage;


  /*
    Date
  */

  const now =
    new Date();


  dateText.textContent =
    now
      .toLocaleDateString(
        "en-US",
        {
          month: "short",
          day: "numeric",
          year: "numeric"
        }
      )
      .toUpperCase();


  /*
    Caption
  */

  captionPreview.textContent =
    caption.value ||
    "pretty girl era ♡";


  /*
    Open editor
  */

  modal.classList.remove(
    "hidden"
  );

}


/* =====================================
   CAPTION
===================================== */

caption.addEventListener(
  "input",
  () => {

    captionPreview.textContent =
      caption.value ||
      "pretty girl era ♡";

  }
);


/* =====================================
   POLAROID COLORS
===================================== */

colorButtons.forEach(button => {

  button.addEventListener(
    "click",
    () => {

      colorButtons.forEach(
        item =>
          item.classList.remove(
            "active"
          )
      );


      button.classList.add(
        "active"
      );


      selectedColor =
        button.dataset.color;


      polaroid.className =
        "polaroid";


      if (
        selectedColor !==
        "classic"
      ) {

        polaroid.classList.add(
          selectedColor
        );

      }

    }
  );

});


/* =====================================
   STICKERS
===================================== */

stickerButtons.forEach(button => {

  button.addEventListener(
    "click",
    () => {

      const sticker =
        document.createElement(
          "div"
        );


      sticker.className =
        "photo-sticker";


      sticker.textContent =
        button.dataset.sticker;


      /*
        Random position
      */

      const left =
        10 +
        Math.random() *
        70;


      const top =
        10 +
        Math.random() *
        70;


      sticker.style.left =
        left + "%";


      sticker.style.top =
        top + "%";


      sticker.style.transform =
        `rotate(${
          Math.random() * 30 - 15
        }deg)`;


      stickerLayer.appendChild(
        sticker
      );

    }
  );

});


/* =====================================
   CLOSE MODAL
===================================== */

closeModal.addEventListener(
  "click",
  () => {

    modal.classList.add(
      "hidden"
    );

  }
);


/* =====================================
   DOWNLOAD POLAROID
===================================== */

downloadPolaroid.addEventListener(
  "click",
  downloadPolaroidImage
);


async function downloadPolaroidImage() {

  if (!capturedImage) {

    return;

  }


  const image =
    new Image();


  image.src =
    capturedImage;


  await new Promise(
    resolve => {

      image.onload =
        resolve;

    }
  );


  /*
    Polaroid dimensions
  */

  const width =
    1200;

  const photoSize =
    900;

  const bottom =
    270;

  const height =
    photoSize +
    bottom;


  const output =
    document.createElement(
      "canvas"
    );


  output.width =
    width;

  output.height =
    height;


  const ctx =
    output.getContext("2d");


  /*
    Background color
  */

  ctx.fillStyle =
    getPolaroidColor(
      selectedColor
    );


  ctx.fillRect(
    0,
    0,
    width,
    height
  );


  /*
    Shadow-like border
  */

  ctx.fillStyle =
    "rgba(0,0,0,.05)";


  ctx.fillRect(
    45,
    45,
    1110,
    1110
  );


  /*
    PHOTO
  */

  ctx.drawImage(
    image,
    60,
    60,
    1080,
    1080
  );


  /*
    Caption
  */

  ctx.fillStyle =
    "#4d303b";


  ctx.font =
    "42px Georgia";


  ctx.fillText(
    caption.value ||
      "pretty girl era ♡",
    60,
    1215
  );


  /*
    DATE
  */

  ctx.fillStyle =
    "#987887";


  ctx.font =
    "18px monospace";


  ctx.fillText(
    dateText.textContent,
    60,
    1250
  );


  /*
    Small decorative hearts
  */

  ctx.font =
    "35px serif";


  ctx.fillStyle =
    "#ff5da2";


  ctx.fillText(
    "♡",
    1040,
    1240
  );


  /*
    Download
  */

  const link =
    document.createElement(
      "a"
    );


  link.download =
    "my-pixel-polaroid.png";


  link.href =
    output.toDataURL(
      "image/png"
    );


  link.click();

}


/* =====================================
   POLAROID COLORS FOR DOWNLOAD
===================================== */

function getPolaroidColor(
  color
) {

  switch (color) {

    case "pink":

      return "#ffd8e8";


    case "lavender":

      return "#e7dcff";


    case "blue":

      return "#d9efff";


    case "cream":

      return "#fff0c9";


    default:

      return "#fffdf9";

  }

}


/* =====================================
   QUICK DOWNLOAD
===================================== */

quickDownload.addEventListener(
  "click",
  () => {

    if (!capturedImage) {

      alert(
        "Take a photo first ♡"
      );

      return;

    }


    downloadPolaroidImage();

  }
);


/* =====================================
   CLEANUP
===================================== */

window.addEventListener(
  "beforeunload",
  () => {

    if (stream) {

      stream
        .getTracks()
        .forEach(
          track => track.stop()
        );

    }

  }
);

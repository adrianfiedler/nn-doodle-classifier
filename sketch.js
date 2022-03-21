let dataTrees;
let dataBirds;
let dataApples;
let dataLoaded = 0;
let done = false;
let total = 1000;
let bytesPerImage = 784;
let headerBytes = 0;
let outArray = new Uint8Array(new ArrayBuffer(total*bytesPerImage));
let imageNo = 0;
let outByteIndex = 0;

function preload() {
  dataTrees = loadBytes("data/trees1000.bin", loadingDone);
  dataBirds = loadBytes("data/birds1000.bin", loadingDone);
  dataApples = loadBytes("data/apples1000.bin", loadingDone);
}
function loadingDone() {
  dataLoaded++;
  console.log("data loaded");
  // console.log("Amount images: " + (data.bytes.length - headerBytes) / bytesPerImage); // 28 x 28 pixels - 80 header bytes
}

function setup() {
  createCanvas(400, 400);
  background(255);
}

function draw() {
  if (dataLoaded >= 3 && !done) {
    let start = headerBytes;
    let img = createImage(28, 28);
    img.loadPixels();
    let index = start + imageNo * bytesPerImage;
    for (let i = 0; i < img.width; i++) {
      for (let j = 0; j < img.height; j++) {
        let r = data.bytes[index];
        let col = color(255 - r, 255 - r, 255 - r);
        img.set(j, i, col);
        index++;
        outArray[outByteIndex++] = r;
      }
    }
    img.updatePixels();
    image(img, 0, 0, 28, 28);
    console.log(imageNo);
    if (imageNo++ >= total) {
      console.log("DONE: passed " + total + " images");
      done = true;
      // downloadBlob();
    }
  }
}

function downloadBlob() {
  let blob = new Blob([outArray], { type: "application/octet-stream" });
  downloadFile(blob, "trees1000.bin");
}

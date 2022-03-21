let trees;
let birds;
let apples;

let dataLoaded = 0;
let done = false;
// let total = 1000;
let bytesPerImage = 784;
let headerBytes = 0;
// let outArray = new Uint8Array(new ArrayBuffer(total*bytesPerImage));
let imageNo = 0;
let outByteIndex = 0;

function preload() {
  trees = loadBytes("data/trees1000.bin", loadingDone);
  birds = loadBytes("data/birds1000.bin", loadingDone);
  apples = loadBytes("data/apples1000.bin", loadingDone);
}
function loadingDone() {
  dataLoaded++;
  console.log("data loaded");
  // console.log("Amount images: " + (data.bytes.length - headerBytes) / bytesPerImage); // 28 x 28 pixels - 80 header bytes
}

function setup() {
  createCanvas(280, 280);
  background(0);

  let total = 100;
  for (let n = 0; n < total; n++) {
    let img = createImage(28, 28);
    img.loadPixels();
    let offset = n * bytesPerImage;
    for (let i = 0; i < bytesPerImage; i++) {
      let val = 255 - trees.bytes[i + offset];
      img.pixels[i * 4 + 0] = val;
      img.pixels[i * 4 + 1] = val;
      img.pixels[i * 4 + 2] = val;
      img.pixels[i * 4 + 3] = 255;
    }
    img.updatePixels();
    let x = (n % 10) * 28;
    let y = floor(n / 10) * 28;
    image(img, x, y);
  }
}

function draw() {
  /*
  if (dataLoaded >= 3 && !done) {
    let start = headerBytes;
    let img = createImage(28, 28);
    img.loadPixels();
    let index = start + imageNo * bytesPerImage;
    for (let i = 0; i < img.width; i++) {
      for (let j = 0; j < img.height; j++) {
        let r = dataTrees.bytes[index];
        let col = color(r, r, r);
        img.set(j, i, col);
        index++;
        // outArray[outByteIndex++] = r;
      }
    }
    img.updatePixels();
    image(img, 0, 0, 28, 28);
    console.log(imageNo);
    if (imageNo++ >= total - 1) {
      console.log("DONE: passed " + total + " images");
      done = true;
      // downloadBlob();
    }
  }
  */
}

function downloadBlob() {
  let blob = new Blob([outArray], { type: "application/octet-stream" });
  downloadFile(blob, "trees1000.bin");
}

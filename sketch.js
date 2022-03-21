let trees_data;
let birds_data;
let apples_data;

let trees_training = [];
let trees_testing = [];
let birds_training = [];
let birds_testing = [];
let apples_training = [];
let apples_testing = [];

let trees = { training: [], testing: [] };
let birds = { training: [], testing: [] };
let apples = { training: [], testing: [] };

let dataLoaded = 0;
let done = false;
let total = 1000;
let total_data = 1000;
let bytesPerImage = 784;
let headerBytes = 0;
// let outArray = new Uint8Array(new ArrayBuffer(total*bytesPerImage));
let imageNo = 0;
let outByteIndex = 0;
const trainingRatio = 0.8; // 80% training data, 20% testing data

let nn;
const TREE = 0;
const BIRD = 1;
const APPLE = 2;

function preload() {
  trees_data = loadBytes("data/trees1000.bin", loadingDone);
  birds_data = loadBytes("data/birds1000.bin", loadingDone);
  apples_data = loadBytes("data/apples1000.bin", loadingDone);
}
function loadingDone() {
  dataLoaded++;
  console.log("data loaded");
  // console.log("Amount images: " + (data.bytes.length - headerBytes) / bytesPerImage); // 28 x 28 pixels - 80 header bytes
}

function setup() {
  createCanvas(280, 280);
  background(0);
  prepareData(trees, trees_data, TREE);
  prepareData(birds, birds_data, BIRD);
  prepareData(apples, apples_data, APPLE);

  nn = new NeuralNetwork(784, 64, 3);

  let training = [];
  training = training.concat(trees.training);
  training = training.concat(birds.training);
  training = training.concat(apples.training);

  shuffle(training, true);
  // console.log(training);

  // Train for one epoch
  for (let i = 0; i < training.length; i++) {
    let inputs = [];
    let data = training[i];
    for (let j = 0; j < data.length; j++) {
      inputs[j] = data[j] / 255.0;
    }
    let label = training[i].label;
    let targets = [0, 0, 0];
    targets[label] = 1;
    nn.train(inputs, targets);
  }

  console.log('trained for one epoch');
  // printDoodles();
}

function prepareData(category, data, label) {
  for (let i = 0; i < total_data; i++) {
    let offset = i * bytesPerImage;
    let threshold = floor(trainingRatio * total_data);
    if (i < threshold) {
      category.training[i] = takeData(
        data.bytes,
        offset,
        offset + bytesPerImage
      );
      category.training[i].label = label;
    } else {
      category.testing[i - threshold] = takeData(
        data.bytes,
        offset,
        offset + bytesPerImage
      );
      category.testing[i - threshold].label = label;
    }
  }
}

function takeData(bytearray, begin, end) {
  return bytearray.subarray(begin, end);
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

function printDoodles() {
  // let total = 100;
  for (let n = 0; n < total; n++) {
    let img = createImage(28, 28);
    img.loadPixels();
    let offset = n * bytesPerImage;
    for (let i = 0; i < bytesPerImage; i++) {
      let val = 255 - trees_data.bytes[i + offset];
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

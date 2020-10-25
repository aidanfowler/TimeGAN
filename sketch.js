let current_image;
let old_image;
let new_image;
let model;
let wakingUp = true;
let bg;
let imageWidth = 512*1.5;
let imageHeight = 698*1.5;

function setup() {
  fullscreen(true);
  bg = loadImage('/assets/gradientMeshSmall.jpg');
  createCanvas(windowWidth, windowHeight);
  model = new rw.HostedModel({
    url: "https://timemagazinegan-portraits.hosted-models.runwayml.cloud/v1/",
  });
  generateImage();
}

function generateImage() {
  const z = [];
  for (let i = 0; i < 512; i++) {
    z[i] = map(noise(i, 0.01 * frameCount), 0, 1, -0.05, 0.05);
  }
  const data = {
    z: z,
    truncation: 0.4
  };
  model.query(data).then(outputs => {
    const {
      image
    } = outputs;
    new_image = loadImage(image);
    if (!current_image) {
      current_image = new_image;
      wakingUp = false;
    }
  });
}

function draw() {
  if (wakingUp) {
    text('Waking Up Model...', 10, 10);
  }
  else if (frameCount % 255 > 0) {
    background(bg);
    //image(bg,0,0,displayWidth, displayHeight);
    if (old_image) {
      tint(255, 255 - (frameCount % 255));
      image(old_image, displayWidth/2-imageWidth/2, displayHeight/2-imageHeight/2, imageWidth, imageHeight);
    }
    if (current_image) {
      tint(255, frameCount % 255);
      image(current_image, displayWidth/2-imageWidth/2, displayHeight/2-imageHeight/2, imageWidth, imageHeight);
    }
  }
  if (frameCount % 100 == 0) {
    generateImage();
  }
  if (frameCount % 255 == 0) {
    old_image = current_image;
    current_image = new_image;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
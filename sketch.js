let current_image;
let old_image;
let new_image;
let model;
let wakingUp = true;
let bg;
let imageWidth = 512*1.5;
let imageHeight = 698*1.5;
let url;
let showOneFrame = false;
let oneFrameLoaded = false;

function setup() {
  url = getURL(); 
  if(url.indexOf('frame') != -1){
    showOneFrame = true;
  }
  console.log(url.indexOf('frame'));
  //fullscreen(true);
  bg = loadImage('gradientMeshSmall.jpg');
  createCanvas(windowWidth, windowHeight);
  model = new rw.HostedModel({
    url: "https://timemagazinegan-portraits.hosted-models.runwayml.cloud/v1/",
  });
  generateImage();
}

function generateImage() {
  const z = [];
  for (let i = 0; i < 512; i++) {
    z[i] = map(noise(i, 0.01 * frameCount), 0, 1, -1, 1);
  }
  const data = {
    z: z,
    truncation: 0.6
  };
  model.query(data).then(outputs => {
    const {
      image
    } = outputs;
    new_image = loadImage(image);
    if (!current_image) {
      current_image = new_image;
      wakingUp = false;
      justWokeUp = true;
    }
  });
}

function draw() {
  if (wakingUp) {
    text('Waking Up Model...', 10, 10);
  }
  else if (showOneFrame){
    console.log('show one frame only');
    if(!oneFrameLoaded){
      background(bg);
      image(new_image, displayWidth/2-imageWidth/2, displayHeight/2-imageHeight/2, imageWidth, imageHeight);
      oneFrameLoaded = true;
    }
  }
  else{
    if (frameCount % 255 > 0) {
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
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
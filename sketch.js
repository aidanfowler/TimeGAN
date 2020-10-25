let current_image; //image that is displayed
let old_image; //image that is fading away
let new_image; //load new image before switching between current and old so there is no glitch when switching
let model; //runway model
let wakingUp = true; //display message if model is not activated
let bg; //background image
let imageWidth;
let imageHeight;
let showOneFrame = false; //track if we are running in generative mode or one frame mode
let oneFrameLoaded = false; //only show frame one time if in one frame mode

function setup() {
  //if url contains frame, only generate one image and keep it on page
  let url = getURL(); 
  if(url.indexOf('frame') != -1){
    showOneFrame = true;
  }
  bg = loadImage('gradientMeshSmall.jpg'); //load background image
  createCanvas(windowWidth, windowHeight); //make canvas size of window
  imageHeight = windowHeight*.8;
  imageWidth = imageHeight*.7335;
  model = new rw.HostedModel({ 
    url: "https://timemagazinegan-portraits.hosted-models.runwayml.cloud/v1/",
  }); //initialize runway model
  generateImage(); //generate first image
  switchImages();//save first image
}

//create z vector, pass to runway, get back generated image, save in new image
function generateImage() {
  const z = [];
  for (let i = 0; i < 512; i++) {
    z[i] = map(noise(i, 0.01 * frameCount), 0, 1, -1, 1);
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
      justWokeUp = true;
    }
  });
}

function draw() {
  //tell user model is waking up if runway has been sleeping
  if (wakingUp) {
    text('Waking Up Model... this can take some time if the endpoint has been sleeping', windowWidth/3, windowHeight/2);
  }
  //this will run one time if we are only generating one frame
  else if (showOneFrame){
    if(!oneFrameLoaded){
      background(bg);
      image(new_image, windowWidth/2-imageWidth/2, (windowHeight/2-imageHeight/2), imageWidth, imageHeight);
      oneFrameLoaded = true;
    }
  }
  //fade between new image and prior image forever
  else{
    if (frameCount % 255 > 0) {
      background(bg,0,0,windowWidth,windowHeight);
      if (old_image) {
        tint(255, 255 - (frameCount % 255));
        image(old_image, windowWidth/2-imageWidth/2, (windowHeight/2-imageHeight/2), imageWidth, imageHeight);
      }
      if (current_image) {
        tint(255, frameCount % 255);
        image(current_image, windowWidth/2-imageWidth/2, (windowHeight/2-imageHeight/2), imageWidth, imageHeight);
      }
    }
    if (frameCount % 100 == 0) {
      generateImage();
    }
    if (frameCount % 255 == 0) {
      switchImages();
    }
  }
}

function switchImages(){
  old_image = current_image;
  current_image = new_image;
}
//if resizing window, change canvas dimensions 
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  imageHeight = windowHeight*.8;
  imageWidth = imageHeight*.7335;
}
let video;
let poseNet;
let pose;
let skeleton;
let moves = ['m','w','t'];
let ind = 0;
let cycle = 0;

let brain;
let poseLabel = "x";
var triangle_img;
var mountain_img;
var warrior_img;

let mistake = [];
let input = [];
let angle = [];
let trainer = [];
let trainer_mountain = [30.45242649, 145.84614669, 23.25842514, 151.11132076, 23.22319168, 139.48228441, 26.32634444, 160.57276106, 27.72291028, 133.90626204, 59.30151697, 167.53179885, 58.27675824, 120.49382718, 103.61828859, 179.71662021, 101.60519711, 115.44972614, 
                        135.64747669, 181.38221129, 133.46043004, 119.98960586, 131.63728949, 162.21449088, 132.4855525, 134.23675728, 191.9740218, 164.93618276, 195.33186915, 144.4141998, 252.04009725, 166.83729087, 251.74319125, 143.69758459];
let trainer_warrior = [159.7538716, 272.49517039, 154.17561197, 278.36960454, 154.79880476, 272.30715687, 156.77489161, 298.89912032, 155.72926617, 271.16484463, 184.20345497, 314.30178001, 184.20345497, 314.30178001, 185.8148098, 273.84443804, 
                      188.35194874, 370.50863577, 185.65981531, 223.33534197, 180.19069338, 422.91692237, 182.20827961, 169.19184802, 277.50813532, 307.07514148, 279.30760813, 263.54235665, 342.01312208, 334.44770026, 296.18261719, 197.0968483, 388.55173779, 356.60994367, 373.72463608, 190.86086285];
let trainer_triangle = [28.01343931, 539.1596987, 25.62287765, 541.67887231, 25.4576291, 537.53957129, 27.71545912, 544.70112082, 26.89856668, 537.92427605, 36.67162082, 547.68845081, 36.31675738, 532.68752976, 46.45278191, 557.60935963, 42.67576742, 528.38580761, 39.63916708, 566.5920889, 
                        40.01541111, 521.24766781, 67.88751252, 543.43806842, 67.13776699, 532.17813002, 85.2875806, 551.64076666, 81.93624545, 515.00926542, 106.97128952, 554.11001544, 110.9346756, 508.35411508];

let timer = 10;

// A sound file object
let dingdong;
let count = 0;

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function setup() {
  triangle_img = loadImage('YogaPoseImages/Triangle2.png');
  mountain_img = loadImage('YogaPoseImages/Mountain2.png');
  warrior_img = loadImage('YogaPoseImages/warrior2.png');

  soundFormats('mp3', 'ogg');
  dingdong = loadSound('2989.mp3');
  
  createCanvas(windowWidth, windowHeight);
  video = createCapture(VIDEO);
  video.hide();
  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on('pose', gotPoses);

  let options = {
    inputs: 34,
    outputs: 3,
    task: 'classification',
    debug: true
  }
  brain = ml5.neuralNetwork(options);
  const modelInfo = {
    model: 'NeuralNetworkModel/model.json',
    metadata: 'NeuralNetworkModel/model_meta.json',
    weights: 'NeuralNetworkModel/model.weights.bin',
  };
  brain.load(modelInfo, brainLoaded);
}

function brainLoaded() {
  console.log('App Ready!');
  classifyPose();
}

function classifyPose() {
  if (pose) {
    let inputs = [];
    for (let i = 0; i < pose.keypoints.length; i++) {
      let x = pose.keypoints[i].position.x;
      let y = pose.keypoints[i].position.y;
      inputs.push(x);
      inputs.push(y);
    }
    brain.classify(inputs, gotResult);
  } else {
    setTimeout(classifyPose, 100);
  }
}

function gotResult(error, results) {
  
  if (results[0].confidence > 0.85) {
    poseLabel = results[0].label;
    setTimeout(savePose, 5000);
  }
  else{
    poseLabel = "x";
  }
  //console.log(results[0].confidence);
  classifyPose();
}


function gotPoses(poses) {
  if (poses.length > 0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
  }
}


function modelLoaded() {
  console.log('PoseNet ready');
}

function preload(){
  bg = loadImage("./yoga2.jpg")
}

function playSound(){
  dingdong.play();
  count = count + 1;
}

function draw() {
  background(bg);
  push();
  translate(video.width, 0);
  scale(-1, 1);
  image(video, -(windowWidth/6), windowHeight/6, video.width, video.height);

  if (pose) {
    for (let i = 0; i < skeleton.length; i++) {
      let a = skeleton[i][0];
      let b = skeleton[i][1];
      strokeWeight(3);
      stroke(173,217,230);

      line(a.position.x-(windowWidth/6), a.position.y+(windowHeight/6), b.position.x-(windowWidth/6), b.position.y+(windowHeight/6));
    }
    for (let i = 0; i < pose.keypoints.length; i++) {
      let x = pose.keypoints[i].position.x-(windowWidth/6);
      let y = pose.keypoints[i].position.y+windowHeight/6;
      fill(173,217,230);
      stroke(0);
      ellipse(x, y, 16, 16);
      if (mistake.includes(i)) {
        fill(255, 0, 0);
        ellipse(x, y, 20, 20);
        if (i == 5){
          push();
          scale(-1, 1);
          fill(255, 0, 0);
          textSize(20);
          text('Left arm and upper body', windowWidth/5.5, windowHeight/1.26);
          pop();
        }
        if (i == 6){
          push();
          scale(-1, 1);
          fill(255, 0, 0);
          textSize(20);
          text('Right arm and upper body', windowWidth/5.5, windowHeight/1.23);
          pop();
        }
        if (i == 7){
          push();
          scale(-1, 1);
          fill(255, 0, 0);
          textSize(20);
          text('Left elbow', windowWidth/5.5, windowHeight/1.2);
          pop();
        }
        if (i == 8){
          push();
          scale(-1, 1);
          fill(255, 0, 0);
          textSize(20);
          text('Right elbow', windowWidth/5.5, windowHeight/1.17);
          pop();
        }
        if (i == 11){
          push();
          scale(-1, 1);
          fill(255, 0, 0);
          textSize(20);
          text('Left upper and lower body', windowWidth/5.5, windowHeight/1.14);
          pop();
        }
        if (i == 12){
          push();
          scale(-1, 1);
          fill(255, 0, 0);
          textSize(20);
          text('Right upper and lower body', windowWidth/5.5, windowHeight/1.11);
          pop();
        }
        if (i == 13){
          push();
          scale(-1, 1);
          fill(255, 0, 0);
          textSize(20);
          text('Left knee', windowWidth/5.5, windowHeight/1.08);
          pop();
        }
        if (i == 14){
          push();
          scale(-1, 1);
          fill(255, 0, 0);
          textSize(20);
          text('Right knee', windowWidth/5.5, windowHeight/1.05);
          pop();
        }
      }
    }
  }
  pop();

  let m = moves[ind % 3];
  if (poseLabel == m && count == 0){
    fill(0, 128, 0);
    textSize(40);
    textAlign(LEFT, CENTER);
    textStyle(BOLD);
    text('Nice Job!', windowWidth/3.5, windowHeight/9);
    playSound();
  }

  if (poseLabel == m && count != 0){
    fill(0, 128, 0);
    textSize(40);
    textAlign(LEFT, CENTER);
    textStyle(BOLD);
    text('Nice Job!', windowWidth/3.5, windowHeight/9);
  }
  
  else {
    count = 0;
    fill(204, 0, 0);
    noStroke();
    textSize(30);
    textAlign(CENTER, CENTER);
    textStyle(BOLD)
    text('Match the pose on the Right', windowWidth/3, windowHeight/14)
  }
  interface(m);
  
  
  if (frameCount % 20 == 0 && timer > 0 && poseLabel == m) { // if the frameCount is divisible by 60, then a second has passed. it will stop at 0
    timer --;
  } 
  
  if (timer == 0){
    ind++;
    timer = 10;
  }

  fill (255, 204, 0);
  noStroke();
  textSize(40);
  textAlign(CENTER, CENTER);
  text(timer, 850, 200);
}

function savePose() {
  input = [];
  for (let i = 0; i < pose.keypoints.length; i++) {
    let x = pose.keypoints[i].position.x;
    let y = pose.keypoints[i].position.y;
    input.push(x);
    input.push(y);
  }
  calcAngle();
}

function calcTrainerMountain() {
  trainer[0] = (Math.abs((Math.atan2(trainer_mountain[30] - trainer_mountain[26], trainer_mountain[31] - trainer_mountain[27])) + Math.abs(Math.atan2(trainer_mountain[22] - trainer_mountain[26], trainer_mountain[23] - trainer_mountain[27])))) * (180 / Math.PI);
  trainer[1] = 360 - (Math.abs((Math.atan2(trainer_mountain[32] - trainer_mountain[28], trainer_mountain[33] - trainer_mountain[29])) + Math.abs(Math.atan2(trainer_mountain[24] - trainer_mountain[28], trainer_mountain[25] - trainer_mountain[29])))) * (180 / Math.PI);

  trainer[2] = (Math.abs(Math.atan2(trainer_mountain[26] - trainer_mountain[22], trainer_mountain[27] - trainer_mountain[23])) + Math.abs(Math.atan2(trainer_mountain[10] - trainer_mountain[22], trainer_mountain[11] - trainer_mountain[23]))) * (180 / Math.PI);
  trainer[3] = 360 - (Math.abs(Math.atan2(trainer_mountain[28] - trainer_mountain[24], trainer_mountain[29] - trainer_mountain[25])) + Math.abs(Math.atan2(trainer_mountain[12] - trainer_mountain[24], trainer_mountain[13] - trainer_mountain[25]))) * (180 / Math.PI);

  trainer[4] = (Math.abs(Math.atan2(trainer_mountain[18] - trainer_mountain[14], trainer_mountain[19] - trainer_mountain[15])) + Math.abs(Math.atan2(trainer_mountain[10] - trainer_mountain[14], trainer_mountain[11] - trainer_mountain[15]))) * (180 / Math.PI);
  trainer[5] = 360 - (Math.abs(Math.atan2(trainer_mountain[20] - trainer_mountain[16], trainer_mountain[21] - trainer_mountain[17])) + Math.abs(Math.atan2(trainer_mountain[12] - trainer_mountain[16], trainer_mountain[13] - trainer_mountain[17]))) * (180 / Math.PI);

  trainer[6] = (Math.abs(Math.atan2(trainer_mountain[22] - trainer_mountain[10], trainer_mountain[23] - trainer_mountain[11])) + Math.abs(Math.atan2(trainer_mountain[14] - trainer_mountain[10], trainer_mountain[15] - trainer_mountain[11]))) * (180 / Math.PI);
  trainer[7] = 360 - (Math.abs(Math.atan2(trainer_mountain[16] - trainer_mountain[12], trainer_mountain[17] - trainer_mountain[13])) + Math.abs(Math.atan2(trainer_mountain[24] - trainer_mountain[12], trainer_mountain[25] - trainer_mountain[13]))) * (180 / Math.PI);
}

function calcTrainerWarrior() {
  trainer[0] = (Math.abs((Math.atan2(trainer_warrior[30] - trainer_warrior[26], trainer_warrior[31] - trainer_warrior[27])) + Math.abs(Math.atan2(trainer_warrior[22] - trainer_warrior[26], trainer_warrior[23] - trainer_warrior[27])))) * (180 / Math.PI);
  trainer[1] = 360 - (Math.abs((Math.atan2(trainer_warrior[32] - trainer_warrior[28], trainer_warrior[33] - trainer_warrior[29])) + Math.abs(Math.atan2(trainer_warrior[24] - trainer_warrior[28], trainer_warrior[25] - trainer_warrior[29])))) * (180 / Math.PI);

  trainer[2] = (Math.abs(Math.atan2(trainer_warrior[26] - trainer_warrior[22], trainer_warrior[27] - trainer_warrior[23])) + Math.abs(Math.atan2(trainer_warrior[10] - trainer_warrior[22], trainer_warrior[11] - trainer_warrior[23]))) * (180 / Math.PI);
  trainer[3] = 360 - (Math.abs(Math.atan2(trainer_warrior[28] - trainer_warrior[24], trainer_warrior[29] - trainer_warrior[25])) + Math.abs(Math.atan2(trainer_warrior[12] - trainer_warrior[24], trainer_warrior[13] - trainer_warrior[25]))) * (180 / Math.PI);

  trainer[4] = (Math.abs(Math.atan2(trainer_warrior[18] - trainer_warrior[14], trainer_warrior[19] - trainer_warrior[15])) + Math.abs(Math.atan2(trainer_warrior[10] - trainer_warrior[14], trainer_warrior[11] - trainer_warrior[15]))) * (180 / Math.PI);
  trainer[5] = 360 - (Math.abs(Math.atan2(trainer_warrior[20] - trainer_warrior[16], trainer_warrior[21] - trainer_warrior[17])) + Math.abs(Math.atan2(trainer_warrior[12] - trainer_warrior[16], trainer_warrior[13] - trainer_warrior[17]))) * (180 / Math.PI);

  trainer[6] = (Math.abs(Math.atan2(trainer_warrior[22] - trainer_warrior[10], trainer_warrior[23] - trainer_warrior[11])) + Math.abs(Math.atan2(trainer_warrior[14] - trainer_warrior[10], trainer_warrior[15] - trainer_warrior[11]))) * (180 / Math.PI);
  trainer[7] = 360 - (Math.abs(Math.atan2(trainer_warrior[16] - trainer_warrior[12], trainer_warrior[17] - trainer_warrior[13])) + Math.abs(Math.atan2(trainer_warrior[24] - trainer_warrior[12], trainer_warrior[25] - trainer_warrior[13]))) * (180 / Math.PI);
}

function calcTrainerTriangle() {
  trainer[0] = (Math.abs((Math.atan2(trainer_triangle[30] - trainer_triangle[26], trainer_triangle[31] - trainer_triangle[27])) + Math.abs(Math.atan2(trainer_triangle[22] - trainer_triangle[26], trainer_triangle[23] - trainer_triangle[27])))) * (180 / Math.PI);
  trainer[1] = 360 - (Math.abs((Math.atan2(trainer_triangle[32] - trainer_triangle[28], trainer_triangle[33] - trainer_triangle[29])) + Math.abs(Math.atan2(trainer_triangle[24] - trainer_triangle[28], trainer_triangle[25] - trainer_triangle[29])))) * (180 / Math.PI);

  trainer[2] = (Math.abs(Math.atan2(trainer_triangle[26] - trainer_triangle[22], trainer_triangle[27] - trainer_triangle[23])) + Math.abs(Math.atan2(trainer_triangle[10] - trainer_triangle[22], trainer_triangle[11] - trainer_triangle[23]))) * (180 / Math.PI);
  trainer[3] = 360 - (Math.abs(Math.atan2(trainer_triangle[28] - trainer_triangle[24], trainer_triangle[29] - trainer_triangle[25])) + Math.abs(Math.atan2(trainer_triangle[12] - trainer_triangle[24], trainer_triangle[13] - trainer_triangle[25]))) * (180 / Math.PI);

  trainer[4] = (Math.abs(Math.atan2(trainer_triangle[18] - trainer_triangle[14], trainer_triangle[19] - trainer_triangle[15])) + Math.abs(Math.atan2(trainer_triangle[10] - trainer_triangle[14], trainer_triangle[11] - trainer_triangle[15]))) * (180 / Math.PI);
  trainer[5] = 360 - (Math.abs(Math.atan2(trainer_triangle[20] - trainer_triangle[16], trainer_triangle[21] - trainer_triangle[17])) + Math.abs(Math.atan2(trainer_triangle[12] - trainer_triangle[16], trainer_triangle[13] - trainer_triangle[17]))) * (180 / Math.PI);

  trainer[6] = (Math.abs(Math.atan2(trainer_triangle[22] - trainer_triangle[10], trainer_triangle[23] - trainer_triangle[11])) + Math.abs(Math.atan2(trainer_triangle[14] - trainer_triangle[10], trainer_triangle[15] - trainer_triangle[11]))) * (180 / Math.PI);
  trainer[7] = 360 - (Math.abs(Math.atan2(trainer_triangle[16] - trainer_triangle[12], trainer_triangle[17] - trainer_triangle[13])) + Math.abs(Math.atan2(trainer_triangle[24] - trainer_triangle[12], trainer_triangle[25] - trainer_triangle[13]))) * (180 / Math.PI);
}

function calcAngle() {
  angle = [];
  angle[0] = (Math.abs((Math.atan2(input[31] - input[27], input[30] - input[26])) + Math.abs(Math.atan2(input[23] - input[27], input[22] - input[26])))) * (180 / Math.PI);
  angle[1] = 360 - (Math.abs((Math.atan2(input[33] - input[29], input[32] - input[28])) + Math.abs(Math.atan2(input[25] - input[29], input[24] - input[28])))) * (180 / Math.PI);

  angle[2] = (Math.abs(Math.atan2(input[27] - input[23], input[26] - input[22])) + Math.abs(Math.atan2(input[11] - input[23], input[10] - input[22]))) * (180 / Math.PI);
  angle[3] = 360 - (Math.abs(Math.atan2(input[29] - input[25], input[28] - input[24])) + Math.abs(Math.atan2(input[13] - input[25], input[12] - input[24]))) * (180 / Math.PI);

  angle[4] = (Math.abs(Math.atan2(input[19] - input[15], input[18] - input[14])) + Math.abs(Math.atan2(input[11] - input[15], input[10] - input[14]))) * (180 / Math.PI);
  angle[5] = 360 - (Math.abs(Math.atan2(input[21] - input[17], input[20] - input[16])) + Math.abs(Math.atan2(input[13] - input[17], input[12] - input[16]))) * (180 / Math.PI);

  angle[6] = (Math.abs(Math.atan2(input[23] - input[11], input[22] - input[10])) + Math.abs(Math.atan2(input[15] - input[11], input[14] - input[10]))) * (180 / Math.PI);
  angle[7] = 360 - (Math.abs(Math.atan2(input[17] - input[13], input[16] - input[12])) + Math.abs(Math.atan2(input[25] - input[13], input[24] - input[12]))) * (180 / Math.PI);
  cmpAngle();
}

function cmpAngle() {
  let cmp;
  mistake = [];
  for (let i = 0; i < 8; i++) {
    cmp = angle[i] - trainer[i];
    if (Math.abs(cmp) > 30) {
      pass = false;
      switch (i) {
        case 0:
          mistake.push("Left knee ");
          mistake.push(13);
          break;
        case 1:
          mistake.push("Right knee ");
          mistake.push(14);
          break;
        case 2:
          mistake.push("Left upper and lower body ");
          mistake.push(11);
          break;
        case 3:
          mistake.push("Right upper and lower body ");
          mistake.push(12);
          break;
        case 4:
          mistake.push("Left elbow ");
          mistake.push(7);
          break;
        case 5:
          mistake.push("Right elbow ");
          mistake.push(8);
          break;
        case 6:
          mistake.push("Left arm and upper body ");
          mistake.push(5);
          break;
        case 7:
          mistake.push("Right arm and upper body ");
          mistake.push(6);
          break;
      }
    }
}
}

function interface(label){
  let name;
  let img;
  if (label == 'm'){
    name = 'Mountain';
    img = mountain_img;
    calcTrainerMountain();
  } else if (label == 't'){
    name = 'Triangle';
    img = triangle_img;
    calcTrainerTriangle();
  } else if (label == 'w'){
    name = 'Warrior';
    img = warrior_img;
    calcTrainerWarrior();
  }
  fill (0);
  noStroke();
  textSize(32);
  textAlign(CENTER, CENTER);
  text(name + " Pose", windowWidth/1.4, windowHeight/14);
  
  image(img, windowWidth/1.75, windowHeight/4, 560, 373);
  
}

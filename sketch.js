let handPose;
let video;
let hands = [];
let hand;
let score = 000;
let score2 = 000;
let time = 0;
let should_remove = 0;
let remove_list = [];
let sound
let game_time = 5000;

let finger1 = 0,
  finger2 = 0;
let thumb1 = 0,
  thumb2 = 0;

let targets = []

let options = {
  maxHands: 2,
  flipped: false,
  runtime: "tfjs",
  modelType: "full",
  detectorModelUrl: undefined, //default to use the tf.hub model
  landmarkModelUrl: undefined, //default to use the tf.hub model
};

function preload() {
  // Load the handPose model
  handPose = ml5.handPose(options);
}

function setup()
{
  createCanvas(windowWidth, windowHeight);
  // Create the webcam video and hide it
  video = createCapture(VIDEO);
  video.size(windowWidth, windowHeight);
  video.hide();
  // start detecting hands from the webcam video
  handPose.detectStart(video, gotHands);
  sound = loadSound('POP.mp3');
}

function draw()
{
background(0);
  translate(video.width, 0);
  scale(-1, 1);
  image(video, 0, 0);

  
if(game_time > 0)
  {
    game_time -= 1
    print(windowWidth + " " + windowHeight)
    makeTarget();
    handTrack();
  }
  scoreTrack();
}

class Target
  {
    constructor()
    {
      this.ogsize = (floor(random(250, 100) / 10) * 10);
      this.size = this.ogsize;
      this.position = createVector(random(0, windowWidth), random(0, windowHeight));
      this.col = 255;
      this.area = 0;
      this.shot = 0;
      this.txt = 0;
      this.player = 0;
    }
    
    display()
    {
      fill(255 - this.col, this.col, 0)
      this.col *= 0.985
      ellipse(this.position.x, this.position.y, this.size, this.size)
      this.size *= 0.985
      if(this.size < 1)
      {
        this.size = 0;
      }
    }
  }

function makeTarget()
{
  time++
  if(time % 30 == 0)
  {
    targets.push(new Target())
  }
  
  for(var atarget of targets)
  {
    atarget.display()
  }
  var j = targets.length-1;
  while(j >= 0)
  {
    if(targets[j].size == 0 || targets[j].shot == 1)
      {
        if(targets[j].shot == 1)
        {
          if(targets[j].player == 1)
            {
              score += floor((targets[j].size)*10, 10)
            }
          else if(targets[j].player == 2)
            {
              score2 += floor((targets[j].size)*10, 10)
            }
          push()
          sound.play()
          pop()
        }
        targets.splice(j,1)
        j = targets.length
      }
    j--
  }
  print(targets)
  
}

function handTrack()
{
  
  // Draw all the tracked hand points
  for (let i = 0; i < hands.length; i++)
  {
    hand = hands[i];

    for (let j = 0; j < hand.keypoints.length; j++)
    {
      let keypoint = hand.keypoints[j];

      if (j == 4 && i==0) {
        thumb1 = keypoint;
        noStroke();
        // circle(keypoint.x, keypoint.y, 50);
      }
      if (j == 8 && i==0) {
        finger1 = keypoint;
        noStroke();
        // circle(keypoint.x, keypoint.y, 50);
        
        for(var target of targets)
          {
            if(sqrt(((keypoint.x-target.position.x)*(keypoint.x-target.position.x)) + ((keypoint.y-target.position.y)*(keypoint.y-target.position.y))) < (target.size))
              {
                target.shot = 1;
                target.player = 1;
              }
          }
      }
      
      if (j == 4 && i==1) {
        thumb2 = keypoint;
        noStroke();
        // circle(keypoint.x, keypoint.y, 50);
      }
      if (j == 8 && i==1)
      {
        finger2 = keypoint;
        noStroke();
        // circle(keypoint.x, keypoint.y, 50);
        
        for(var target of targets)
        {
          if(sqrt((keypoint.x-target.position.x)*(keypoint.x-target.position.x) + (keypoint.y-target.position.y)*(keypoint.y-target.position.y)) < (target.size))
            {
              target.shot = 1;
              target.player = 2;
            }
        }
        
      }
    }
  }
  
}

function scoreTrack()
{
  push()
  textSize(50)
  scale(-1, 1);
  translate(-video.width, 0);
  fill(0)
  stroke(255)
  text("Time: " + game_time, 20, 60)
  text("P1 SCORE: " + score, 20, 110)
  text("P2 SCORE: " + score2, 20, 160)
  
  if(game_time <= 0)
    {
      push()
      textAlign(CENTER)
      text("GAME OVER", windowWidth/2, windowHeight/2)
      pop()
    }
  pop()
  
  
}

// Callback function for when handPose outputs data
function gotHands(results)
{
  // save the output to the hands variable
  hands = results;
}

let counter = 0;
function mousePressed() {
  counter++;

  if (counter > 20) {
    counter = 0;
  }
  print(counter);
  print(hand.keypoints[counter]);
}

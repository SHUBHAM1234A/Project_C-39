// Global variables 
var PLAY = 1;
var END = 0;
var gameState = PLAY;
var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var score =0;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound
var bg;
var music;
var font;

function preload(){
  
  // Images and animations 
  trex_running = loadAnimation("t-rex/png/Run (1).png","t-rex/png/Run (2).png","t-rex/png/Run (3).png","t-rex/png/Run (4).png","t-rex/png/Run (5).png","t-rex/png/Run (6).png","t-rex/png/Run (7).png","t-rex/png/Run (8).png");
  trex_collided = loadAnimation("t-rex/png/Dead (8).png");
  groundImage = loadImage("Images/ground2 (1).png");
  cloudImage = loadImage("Images/image.png");
  obstacle1 = loadImage("Images/obstacle1.png");
  obstacle2 = loadImage("Images/obstacle2.png");
  obstacle3 = loadImage("Images/obstacle3.png");
  obstacle4 = loadImage("Images/obstacle4.png");
  obstacle5 = loadImage("Images/obstacle5.png");
  obstacle6 = loadImage("Images/obstacle6.png");
  restartImg = loadImage("Images/restart.png");
  gameOverImg = loadImage("Images/gameOver.png");
  jumpSound = loadSound("Sounds & Music/jump.mp3");
  dieSound = loadSound("Sounds & Music/die.mp3");
  checkPointSound = loadSound("Sounds & Music/checkPoint.mp3");
  bg  = loadImage("Images/rm222-mind-22_1_2.jpg");
  music = loadSound("Sounds & Music/Know Myself - Patrick Patrikios.mp3");
  font = loadFont("Fonts/FORTE.otf");
}

function setup() {
  createCanvas(displayWidth,displayHeight);
  music.loop();

  trex = createSprite(displayWidth/2,160,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.1;
  
  ground = createSprite(200,225,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  gameOver = createSprite(displayWidth/2,trex.y-200);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(displayWidth/2,trex.y-140);
  restart.addImage(restartImg);
 
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  invisibleGround = createSprite(displayWidth/2,190,400,10);
  invisibleGround.visible = false;
  
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();

  console.log(jumpSound.duration());
  trex.setCollider("rectangle",0,0,trex.width,trex.height);
  trex.debug = false;
}  


function draw() {
  
  background(bg);
  //displaying score
  
  textSize(32);
  fill("purple");
  textFont(font);
  text("Score: "+ score, displayWidth/4,30);
  
  //trex.debug = true;
  trex.setCollider("circle",-100,0,200);
  
  if(gameState === PLAY){

    gameOver.visible = false;
    restart.visible = false;
    
    camera.y = trex.y;
	  camera.x = trex.x;

    ground.velocityX = -(6 + score/100);
    //scoring
    score = Math.ceil(frameCount/3.5);
    
    // checkPointSound will come after every 100 score
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& trex.y >= 161) {
        trex.velocityY = -12;
        jumpSound.play();
    }

    if(keyDown("up")&& trex.y >= 161) {
      trex.velocityY = -12;
      jumpSound.play();
  }
    
    
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
        //trex.velocityY = -12;
        jumpSound.play();
        gameState = END;
        dieSound.play();
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     
     //change the trex animation
      trex.changeAnimation("collided", trex_collided);
  
      ground.velocityX = 0;
      trex.velocityY = 0
      
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);    
   }
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);
  
  // when the gamestate = end and clicked on restart button, the game will restart
  if(mousePressedOver(restart) && gameState === END) {
      reset();
    }

  drawSprites();
}

function reset(){
  gameState = PLAY;
  // cloudgroup and obstacles group will destroy when clicked on restart button
  cloudsGroup.destroyEach();
  obstaclesGroup.destroyEach();
  score = 0;
  frameCount = 0;
  trex.changeAnimation("running",trex_running);
}


function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(displayWidth,165,10,40);
   obstacle.velocityX = -(6 + score/100);
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  // To spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(displayWidth,120,40,10);
    cloud.y = Math.round(random(-100,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.1;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 600;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}
var trex, trex_running, trex_morreu, edges;
var groundImage, ground;
var ground1;
var nuvem, nuvemImg;
var cacto, cacto0, cacto1, cacto2, cacto3, cacto4, cacto5;
var placar = 0;
var grupCacto, grupNuvem;
var estadoJogo = "start";
var restart, gameOver, restartImg, gameOverImg;
var cp, die, jump;

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_morreu = loadImage("trex_collided.png");
  groundImage = loadImage("ground2.png");
  nuvemImg = loadImage("cloud.png");
  cacto0 = loadImage("obstacle1.png");
  cacto1 = loadImage("obstacle2.png");
  cacto2 = loadImage("obstacle3.png");
  cacto3 = loadImage("obstacle4.png");
  cacto4 = loadImage("obstacle5.png");
  cacto5 = loadImage("obstacle6.png");
  restartImg = loadImage("restart.png");
  gameOverImg = loadImage("gameOver.png");
  cp = loadSound("checkpoint.mp3");
  die = loadSound("die.mp3");
  jump = loadSound("jump.mp3");
}

function setup(){
  createCanvas(windowWidth, 200);
  // ground1
  ground1 = createSprite(200, height-5, width-5, 5);
  ground1.visible = false;
  //criando o trex
  trex = createSprite(width/20, height-100, 20, 50);
  trex.addAnimation("running", trex_running);
  trex.addImage("morreu", trex_morreu);

  //edges = createEdgeSprites(); 

  ground = createSprite(200, height-10, width-10, 20);
  ground.addImage("chao", groundImage);

  //adicione dimensão e posição ao trex
  trex.scale = 0.4;
  trex.x = 50;

  grupCacto = new Group();
  grupNuvem = new Group();

  //trex.debug = true;
  trex.setCollider("circle", 0, 0, 50);
  //trex.setCollider("rectangle", 60, 0, 100, 250, 90);

  restart = createSprite(width/2, height/2);
  restart.addImage("restart", restartImg);
  restart.scale = 0.3;
  restart.visible = false;

  gameOver = createSprite(width/2, height/2 -30);
  gameOver.addImage("gameOver", gameOverImg);
  gameOver.scale = 0.5;
  gameOver.visible = false;
}


function draw(){
  //definir a cor do plano de fundo 
  background("white");
  
   
  text("Pontuação "+ placar, width-100, 20);

  //cp
  if(placar % 1000 === 0 && placar > 0){
    cp.play();
  }
  
 //impedir que o trex caia
  trex.collide(ground1);

  drawSprites();


  if (estadoJogo === "start"){
    //movimento
    ground.velocityX = -(5 + placar/100);

    
    //pular quando tecla de espaço for pressionada
    if(touches.lenght>0 || keyDown("space")&& trex.y >= 120){
      trex.velocityY = -10;
      jump.play();
      touches = [];
    } 

    if (ground.x < 0){
     ground.x = ground.width/2
    } 
    //placar
    //placar = placar + Math.round(frameCount/120);

    placar = placar + Math.round(getFrameRate()/60);
    //gravidade
    trex.velocityY = trex.velocityY + 0.8;

    //functions
    gerarNuvens();
    gerarCactos();

    if(trex.isTouching(grupCacto)){
      estadoJogo = "fim";
      die.play();
      //trex.velocityY = -12;
      
    }

  }
  else if (estadoJogo === "fim"){
    trex.velocityX = 0;
    trex.velocityY = 0;
    trex.changeAnimation("morreu", trex_morreu);
    ground.velocityX = 0;
    grupCacto.setVelocityXEach(0);
    grupNuvem.setVelocityXEach(0);
    gameOver.visible = true;
    restart.visible = true;
    grupCacto.setLifetimeEach(-1);
    grupNuvem.setLifetimeEach(-1);
    if(mousePressedOver(restart)){
      RestartBanda();
    }
  }


}
function gerarNuvens(){
  if(frameCount % 60 === 0){
    nuvem = createSprite(width, 50);
    nuvem.addImage("cloud", nuvemImg);
    nuvem.y = Math.round(random(20, 90));
    nuvem.velocityX = -5;
    nuvem.scale = 0.6;
    nuvem.depth = trex.depth;
    trex.depth = trex.depth + 1;
    nuvem.lifetime = width/3;
    grupNuvem.add(nuvem);
  }
}
function gerarCactos(){
  if(frameCount % 60 === 0){
    cacto = createSprite(width, height-25);
    rand = Math.round(random(0, 5));
    cacto.velocityX = -(5 + placar/100);
    cacto.scale = 0.5;
    cacto.depth = trex.depth;
    trex.depth = trex.depth + 1;
    cacto.lifetime = width/3;
    grupCacto.add(cacto);
   switch(rand){
     case 0: cacto.addImage("obstaculo1", cacto0);
     break;
     case 1: cacto.addImage("obstaculo2", cacto1);
     break;
     case 2: cacto.addImage("obstaculo3", cacto2);
     break;
     case 3: cacto.addImage(cacto3);
     break;
     case 4: cacto.addImage(cacto4);
     break;
     case 5: cacto.addImage(cacto5);
     break;
     default: break;
   }
  }
}
function RestartBanda(){
  estadoJogo = "start";
  gameOver.visible = false;
  restart.visible = false;
  grupCacto.destroyEach();
  grupNuvem.destroyEach();
  trex.changeAnimation("running", trex_running);
  placar = 0;
}


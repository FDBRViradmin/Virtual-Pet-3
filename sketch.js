var dog,dogImage,happyDog;
var database;
var foodS,foodStock;

var addFood, feed
var feedTime, lastFed
var foodObj

var gameState = 0;

var dogResult, garden, sleep, bathroom

function preload(){
   dogImage=loadImage("Dog.png");
   happyDog=loadImage("happydog.png");
   sleep=loadImage("Bed Room.png");
   garden=loadImage("Garden.png");
   bathroom=loadImage("Wash Room.png");
  }

function setup() {
  database=firebase.database();
  createCanvas(700,500);

  feed=createButton("Feed the Dog");
  feed.position(700, 95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800, 95);
  addFood.mousePressed(addFoods);

  dog=createSprite(250,300,150,150);
  dog.addImage(dogImage);
  dog.scale=0.15;
  
  dogResult=createSprite(350, 250, 700, 500);

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  textSize(20); 

  dogResult.visible = false;
}

function draw() {
  background(46,139,87);
  //gamestate list:
  //1 is full
  //2 is play
  //3 is sleep
  //4 is bath
  if(gameState === 0){
    fill(255,255,254);
  stroke("black");
  text("Food remaining : "+foodS,170,200);
  fill(255,255,254);
  textSize(15);
  if(lastFed>=12){
    text("Last Feed : "+ lastFed%12 + " PM", 450, 30);
  } else if(lastFed==0){
    text("Last Feed : "+ lastFed + " AM", 450, 30);
  }
  if(foodS === 0){
    gameState = 1;
  }
  }

  if(gameState === 1){
    dogResult.addImage(sleep);
    dogResult.visible=true;
  }

  if(feedTime == lastFed+1){
    gameState = 2;
  }

  if(gameState === 2){
    dogResult.addImage(garden);
    dogResult.visible=true;
  }

  if(feedTime == lastFed+2){
    gameState = 3;
  }

  if(gameState === 3){
    dogResult.addImage(sleep);
    dogResult.visible=true;
  }

  if(feedTime === lastFed+3){
    gameState = 4;
  }

  if(gameState === 4){
    dogResult.addImage(bathroom);
    dogResult.visible=true;
  }

  if(gameState !== 1||2||3||4){
    gameState = 0;
  }
  drawSprites();
}

function readStock(data){
  foodS=data.val();
}

function writeStock(x){
  if(x<=0){
    x=0;
  }else{
    x=x-1;
  } 
  database.ref('/').update({
    Food:x
  })
}

function feedDog(){
  dog.addImage(happyDog);
  foodS=foodS-1 
  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.red('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}

function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}
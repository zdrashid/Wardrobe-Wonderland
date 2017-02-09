//------------
//System Vars
//------------
var stage = document.getElementById("gameCanvas");
stage.width = STAGE_WIDTH;
stage.height = STAGE_HEIGHT;
var ctx = stage.getContext("2d");
ctx.fillStyle = "white";
ctx.font = GAME_FONTS;

document.onkeydown = moveAvatar;

var dx = 7;
var x = 0;
var y = 500-128;
var score = 0;
var clothesArray = new Array();
var speed = 3;
var lives = 5;
var scoreAdd = 10;

var hDx = 35;
var hX = 1000;
var hangerDirectionLeft = false;

var currX = 0;
var currY = 0;
var currHangerX = 0;


var dy = Math.random * 4;


//---------------
//Preloading ...
//---------------
//Preload Art Assets
// - Sprite Sheet: Image API:
// http://www.html5canvastutorials.com/tutorials/html5-canvas-images/
var charImage = new Image();
charImage.ready = false;
charImage.onload = setAssetReady;
charImage.src = PATH_CHAR;  // source image location set in constants.js

var heartImage = new Image();
heartImage.ready = false;
heartImage.onload = setAssetReady;
heartImage.src = PATH_HEART; 

var backgroundImage = new Image();
backgroundImage.ready = false;
backgroundImage.onload = setAssetReady;
backgroundImage.src = BACKGROUND_PATH;

var scoreImage = new Image();
scoreImage.ready = false;
scoreImage.onload = setAssetReady;
scoreImage.src = SCORE_PATH;

var hangerImage = new Image();
hangerImage.ready = false;
hangerImage.onload = setAssetReady;
hangerImage.src = HANGER_PATH;

function setAssetReady()
{
	this.ready = true;
}

//Display Preloading
ctx.fillRect(0,0,stage.width,stage.height);
ctx.fillStyle = "#000";
ctx.fillText(TEXT_PRELOADING, TEXT_PRELOADING_X, TEXT_PRELOADING_Y);
var preloader = setInterval(preloading, TIME_PER_FRAME);
var gameloop, currX, currY;

function preloading()
{	
	if (charImage.ready)
	{
		clearInterval(preloader);		
		gameloop = setInterval(update, TIME_PER_FRAME);	
	}
	
}

//------------
//Game Loop
//------------
//currX, currY is a reference to  the image in sprite sheet
currX = IMAGE_START_X;
currY = IMAGE_START_Y;

function moveAvatar(e){
	 e = e || window.event;

    if (e.keyCode == '37'){ 
		if((x-dx) > -50)
			x -= dx;
		isLeft = true;
		PATH_CHAR = "AvatarLeft.png"
		charImage.src = PATH_CHAR;  
    }
    else if (e.keyCode == '39') {
       if((x+dx) < (1000-64)) x += dx;
	   isLeft = false;
	   PATH_CHAR = "AvatarRight.png"
	   charImage.src = PATH_CHAR;  
    }
	else if(e.keyCode == '32'){
		if(isLeft){
			hangerDirectionLeft = true;
			hX = x - 10;
		}
		else {
			hangerDirectionLeft = false;
			hX = x + 64;
		}
	}
	
}

function Clothes(path){
	this.dy = Math.random()*speed + 5;
	this.x = Math.random()*1000-128;
	this.path = path;
	this.y = 0;
}

function init(){
	x = 0;
	y = 500-128;
	score = 0;
	lives = 5;
	speed = 3;
	
	cloth1 = new Clothes("BikerJacket.png");
	cloth2 = new Clothes("Boot.png");
	cloth3 = new Clothes("MJJacket.png");
	cloth4 = new Clothes("Necklace.png");
	cloth5 = new Clothes("RippedJeans.png");
	cloth6 = new Clothes("RoseShirt.png");
	
	clothesArray.push(cloth1);
	clothesArray.push(cloth2);
	clothesArray.push(cloth3);
	clothesArray.push(cloth4);
	clothesArray.push(cloth5);
	clothesArray.push(cloth6);
	
	for(var i = 0; i < 6; i++){
		clothesArray[i].y = 0;
		clothesArray[i].dy = Math.random()*speed + 5;
		clothesArray[i].x = Math.random()*1000-128
	}
	hX = 1000;
	hangerDirectionLeft = false;
}

function update()
{		
		
	//Draw Image
	// sprite sheet building site:
	// 	http://charas-project.net/charas2/index.php
	ctx.drawImage(backgroundImage, 0, 0, stage.width, stage.height);
	ctx.drawImage(charImage,
					x, y );           // sprite upper left positin
	ctx.drawImage(hangerImage,
					currX,0,            // sprite upper left positino	
					32, 32, // size of a sprite 72 x 96
					hX,y,  // canvas position
					1*32,1*32      // sprite size shrinkage
					);
					
	if(lives == 0){
		alert("Game Over! Final Score: " + score);
		init();
	}
	if(speed > 3 && speed < 4){
		scoreImage.src = "Plus10.png";
		scoreAdd = 10;
	}
	if(speed >= 4 && speed < 5){
		scoreImage.src = "Plus20.png";
		scoreAdd = 20;
	}
	if(speed >= 5){
		scoreImage.src = "Plus30.png";
		scoreAdd = 30;
	}
	for(var i = 0; i < 6; i++){
		//console.log("(" + clothesArray[0].x + "," + clothesArray[i].y + ")")
		
		if(clothesArray[i].x <= x+75 && clothesArray[i].x >= x && clothesArray[i].y >= 500-175){
			clothesArray[i].x = Math.random()*1000;
			clothesArray[i].y = 0;
			clothesArray[i].dy = Math.random()*speed + 5;
			speed += 0.2;
			score += scoreAdd;
			ctx.drawImage(scoreImage, 1000-100, 55);
		}
		if(clothesArray[i].x <= hX+32 && clothesArray[i].x >= hX && clothesArray[i].y >= 500-200 && clothesArray[i].y <= 500-125){
			clothesArray[i].x = Math.random()*1000;
			clothesArray[i].y = 0;
			clothesArray[i].dy = Math.random()*speed + 5;
			speed += 0.2;
			score += scoreAdd/2;
			hX = 1000;
			hangerDirectionLeft = false;
			if(scoreAdd/2 == 5) scoreImage.src = "Plus5.png";
			if(scoreAdd/2 == 10) scoreImage.src = "Plus10.png";
			if(scoreAdd/2 == 15) scoreImage.src = "Plus15.png";
			ctx.drawImage(scoreImage, 1000-100, 55);
		}
		
		
		if(clothesArray[i].y >= 500){
			lives--;
			clothesArray[i].x = Math.random()*1000;
			clothesArray[i].y = 0;
			clothesArray[i].dy = Math.random()*speed + 5;
		}
		
		clothesArray[i].y += clothesArray[i].dy;
		var img = new Image();
		img.ready = false;
		img.onload = setAssetReady;
		img.src = clothesArray[i].path;
		ctx.drawImage(img, clothesArray[i].x, clothesArray[i].y);
	}
	if(hangerDirectionLeft){
		hX -= hDx;
	}
	else {
		hX += hDx;
	}
	ctx.font = "30px Impact";
	ctx.fillStyle = "red";
	ctx.fillText("Score: " + score, 1000-150, 35);
	
	for(var i = 0; i < lives; i++){
		console.log(i);
		ctx.drawImage(heartImage,
					currX,0,            // sprite upper left positino	
					32, 30, // size of a sprite 72 x 96
					20+34*i,20,  // canvas position
					1*32,1*32      // sprite size shrinkage
					);
	}
	
	currX += 32;

	if (currX >= 128)
		currX = 0;
	
	console.log(hX);
	
}





	
	
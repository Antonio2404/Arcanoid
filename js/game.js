var canvas, ctx, w, h;
var game = true;
var ball, boat, block, bonusBall;
var rowHeight, row, col;
var toLeft = true;
var toRight = true;
var startBall = false;
var score = 0;
var colorsBlock; //случайный цвет блоков
var colorsBlockSt = ["white","white","blue","blue","red"];

var bonuses;
var bonusesChangeBoat  = 1 ;

var boatSound = new Audio ("song/boat.mp3");
var blockSound = new Audio ("song/block.mp3");

var bG = new Image();



var BALL = function(x,y,Vx,Vy){
    this.x = x;
    this.y = y;
    this.Vx = Vx;
    this.Vy = Vy;

    this.color = "red";
    this.r = 15;
    
}

var BOAT = function (x,y){
    this.x = x;
    this.y = y;

    this.color = "gray";
    this.width = 100;
    this.widthNormal = 100;
    this.height = 10;
    this. Vx = 6;
}

//ширина, высота, строка, ряд
var BLOCK = function(width, height, rows, cols){
    this.rows = rows;
    this.cols = cols;
    this.width = width;
    this.height = height;
    this.padding = 3;
    
    this.obj;

}
var BONUSBALL = function(x,y){
    this.x = x;
    this.y = y;
    this.Vy = -2; 
    this.color = "green";
    this.r = 10;
}

init();
//window.onload = init;

document.addEventListener('keydown', function (event){
    
    if(event.keyCode == 32) {
        // start ball
        startBall = true;
    } else if(event.keyCode == 39 ) {
        //right
        toLeft = false;
        toRight = true;
    } else if (event.keyCode == 37) {
        //left
        toLeft = true;
        toRight = false;
    } 
    else if(event.keyCode == 0) {
    //else if(event.keyCode == 40 ){
        //stop
        toLeft = false;
        toRight = false;
    }
});

document.addEventListener('keyup', function (event)
{
    if(event.keyCode == 32){
        startBall = false
    }else if(event.keyCode == 39 ) {
        //right
        toLeft = false;
        toRight = false;
    } else if (event.keyCode == 37) {
        //left
        toLeft = false;
        toRight = false;
    } 

});

function init() {
    game  = true;
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    w = canvas.width;
    h = canvas.height;
    
    //ball = new BALL(w/2,h-35,0,0);
    ball = new BALL(w/2,h-35,0,0);
    boat = new BOAT (w/2, h-20)
    boat.x -= boat.width/2;
    // width, height, rows, cols)
    block = new BLOCK((w/10)-2,30,6,10);

    bonusBall = new BONUSBALL(null,null)

    //карта блоков
    block.obj = [];
    //colorsBlock = [];
    bonuses = [];
    for(var i=0;i<block.rows;i++){
        block.obj[i] = [];
        //colorsBlock[i] = [];
        bonuses[i] = [];
        for(var j=0;j<block.cols;j++){
            block.obj[i][j] = 1;
            bonuses[i][j] = parseInt(Math.random()*3);
            //var r = parseInt(Math.random()*255);
            //var g = parseInt(Math.random()*255);
            //var b = parseInt(Math.random()*255);    
            //colorsBlock[i][j] = "rgb("+r+","+g+","+b+")";
        }
    }

    beginGame();
}

function beginGame(){ 

    if(game){
        ctx.clearRect(0,0,w,h);
        background();

        var tmpScore = "Score: " + score;
        ctx.strokeStyle = "white";
        ctx.font = "48px serif";
        ctx.strokeText(tmpScore,(w/2)-80,h/2)

        //начальная скорость мяча при старте
        if(startBall && ball.Vx == 0 && ball.Vy == 0){
            ball.Vx = 1;
            ball.Vy = -2;   
        }

        //отскок мяча от правой и левой стены
        if ((ball.x + ball.r)+ball.Vx > w || (ball.x - ball.r)+ball.Vx < 0){
            ball.Vx = -ball.Vx;
        }
        // отскоко мяча от верха и платформы
        if ((ball.y - ball.r) + ball.Vy < 0){   //отскок от верхнего края
            ball.Vy = - ball.Vy;
        } else if ((ball.y + ball.r+ball.Vy)>=(h-boat.height) && (ball.y+ball.r)+ball.Vy < h) {
            if((ball.x+ball.r) >= boat.x && ball.x + ball.r <=(boat.x+(boat.width+20))) {
                ball.Vy = -ball.Vy;
                ball.Vx = 10*(ball.x-(boat.x+boat.width/2))/boat.width;
                boatSound.play();
            } else {
                game = false;
            }
        }

        //движение мяча на платформе и после запуска
        if (toRight && ball.Vx == 0 && ball.Vy == 0 && boat.x + boat.width < w) {
            ball.x += boat.Vx;
            
        } else {
            ball.x += ball.Vx;
            ball.y += ball.Vy;
        }
        if (toLeft && ball.Vx == 0 && ball.Vy == 0 && boat.x > 0){
            ball.x -= boat.Vx;
        } else {
            ball.x += ball.Vx;
            ball.y += ball.Vy;
        }

        //движение платформы
        if(toRight && boat.x + boat.width < w){
            boat.x += boat.Vx;
        }
        if(toLeft && boat.x > 0){
            boat.x -= boat.Vx;
        }

       // bonusBall.y -= bonusBall.Vy;

        // разбитие блоков
        rowHeight = block.height + block.padding;
        row = (Math.floor(ball.y/(rowHeight)));
        col = (Math.floor(ball.x/(block.width+block.padding)));

         
        if(ball.y < (block.rows * rowHeight) && row >= 0 && col >= 0  && block.obj [row][col] == 1) {
            console.log (block.obj [row][col]);
            block.obj [row][col] = (block.obj [row][col]) - 1;
            ball.Vy = -ball.Vy;
            blockSound.play();
            score++;
            if(bonuses[row][col] == 1 && bonusesChangeBoat > 0){
                // bonusBall.x = ball.x;
                // bonusBall.y = ball.y;
                bonuses[row][col] = (bonuses[row][col]) - 1;
                boat.width = boat.width/2;
                bonusesChangeBoat--;
            } else if(bonuses[row][col] == 2 && bonusesChangeBoat == 0){
                // bonusBall.x = ball.x;
                // bonusBall.y = ball.y;
                bonuses[row][col] = (bonuses[row][col]) - 1;
                boat.width = boat.width*2;
                bonusesChangeBoat++;
                
        }

        
    }
    
        //отрисовка мяча
        ctx.fillStyle = ball.color;
        ctx.beginPath();
        ctx.arc(ball.x,ball.y,ball.r,0,2*Math.PI,true);
        ctx.closePath();
        ctx.fill();

        //отрисовка платформы
        ctx.fillStyle = boat.color;
        ctx.beginPath();
        ctx.fillRect(boat.x,boat.y,boat.width,boat.height);
        ctx.closePath();

        //отрисовка бонуса
        ctx.fillStyle = bonusBall.color;
        ctx.beginPath();
        ctx.arc(bonusBall.x, bonusBall.y, bonusBall.r,0,2*Math.PI,true);
        ctx.closePath();
        ctx.fill();

        //ctx.fillStyle = "green";
        ctx.strokeStyle = "black";

        //отрисовка блоков
        for(var i=0;i<block.rows;i++){
            ctx.fillStyle = colorsBlockSt[i];
            for(var j=0;j<block.cols;j++){
               if(block.obj[i][j] == 1){
                    //ctx.fillStyle = colorsBlock[i][j];
                    ctx.beginPath();
                    ctx.fillRect(j*(block.width+block.padding),i*(block.height+block.padding),block.width,block.height);
                    ctx.strokeRect(j*(block.width+block.padding),i*(block.height+block.padding),block.width,block.height);
                    ctx.closePath();
                }
            }
        }

       window.requestAnimationFrame(beginGame);

    } else {
       gameover();
    }

    function gameover(){
        var text = "Game Over";
        var text2 = "Score: " + score;
        ctx.clearRect(0,0,w,h);
        background();
        ctx.fillStyle = "white";
        var text_length = ctx.measureText(text).width;
        var t2_len = ctx.measureText(text2).width;
        ctx.fillText(text,w/2-text_length/2,h/2-40);
        ctx.fillText(text2,w/2-t2_len/2,h/2+10);
    }

    function victory(){
        var text = "You won!";
        var text2 = "Score: " + score;
        ctx.clearRect(0,0,w,h);
        background();
        ctx.fillStyle = "white";
        var text_length = ctx.measureText(text).width;
        var t2_len = ctx.measureText(text2).width;
        ctx.fillText(text,w/2-text_length/2,h/2-40);
        ctx.fillText(text2,w/2-t2_len/2,h/2+10);

    }

    function background (){
        bG.src = "img/fon.jpg";
        ctx.drawImage(bG,0,0,w,h);
    }
    
}
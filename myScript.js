var BlueBlockStatus = -1;	//非负表示已经存在蓝块
var WhiteChessStatus = -1;//非负表示白棋存在
var score = 0;				//得分数		
var BlackChessMoveTimer;  //控制黑棋移动
var BlackChessProduceTimer;//控制黑棋产生
var BlackChessArray=new Array();//黑块数组
var Level = 1;              //初始化为第一关
var GameStatus = "Start";
//绘制蓝色方块(先不考虑旋转)

var BlueBlock =
{
  //x :650,
  //y :350,
  x:660,
  y:360,
  draw:function()//这个函数应该有参数
  {
    if(BlueBlockStatus===-1)
    { 
      var canvas = document.getElementById("mycanvas");
      if(canvas.getContext)
      {
        var ctx=canvas.getContext('2d');
        //生成随机数
        var now=new Date();    
        var rannum = now.getSeconds()%9; //这将产生一个基于目前时间的0到8的整数。
        while(rannum == WhiteChessStatus)
        {
          now=new Date();    
          rannum = now.getSeconds()%9; //这将产生一个基于目前时间的0到8的整数。
        }
        BlueBlockStatus=rannum;
		//方块旋转 
		/*var num = 0;
		ctx.translate(canvas.width/2, canvas.height/2);
		var t = setInterval(rotate, 30);
		function rotate()
		{
			num++;
			ctx.rotate(num*Math.PI/180);
		}*/
		
		ctx.fillStyle='#2828FF';//蓝色
		ctx.fillRect(this.x+(BlueBlockStatus%3)*70+10,this.y+parseInt(BlueBlockStatus/3)*70+10,30,30);//边长为40的正方形
      }
  }
   else{
      var canvas = document.getElementById("mycanvas");
      if (canvas.getContext)
      {
        var ctx=canvas.getContext('2d');
		ctx.fillStyle='#2828FF';//蓝色
		ctx.fillRect(this.x+(BlueBlockStatus%3)*70+10,this.y+parseInt(BlueBlockStatus/3)*70+10,30,30);//边长为40的正方形
      }
    }
    
  }
};

//绘制白棋
var WhiteChess=
{
  x : 650,
  y : 350,
  isLive:true,
  draw:function()
  {
    if(WhiteChessStatus===-1)
    {
	  WhiteChessStatus = 4;
    }
    var canvas = document.getElementById("mycanvas");
      if (canvas.getContext)
      {
        var ctx=canvas.getContext('2d');
        ctx.fillStyle='#FFFFFF';    //白色
        ctx.beginPath();
        ctx.moveTo(this.x+70+35+20,this.y+70+35);
        ctx.arc(this.x+70+35,this.y+70+35,20,0,2*Math.PI);//半径为30的圆 
        ctx.closePath();
        ctx.stroke();               //必须有
        ctx.fill();
      }
  }
};

//黑棋
function BlackChess(x,y,r) {
  //用这种构造方法建议new来新建实例对象，direction可取的值为1，2,3,4，分别代表上下左右四个方向，调用时由随机函数生成
  this.r=r;//半径
  this.status = true;						  //表示黑棋在正常区域内
  var rannum = parseInt(12*Math.random())%12; //这将产生一个0到11的整数。
  if(rannum <= 2)
  {
    this.y = 100;
    this.x = 650+rannum*70+10;//最上边,-10是微调
    this.direction = 2;   //方向向下
  }
  else if(rannum >2 && rannum <= 5)
  {
    this.x = 1000-50;
    this.y = 350+(rannum%3)*70+10;//最右边
    this.direction = 3; //方向向左
  }
  else if(rannum> 5 && rannum <= 8)//最下边
  {
    this.y = 700-50;
    this.x = 650+(rannum%3)*70+10;
    this.direction = 1; //方向向上
  }
  else if(rannum>9 && rannum <12)//最左边 
  {
    this.x = 500;
    this.y = 350 + (rannum%3)*70+10;
    this.direction = 4;//方向向右
  }
  //绘制黑棋
  this.draw=function(){
    var canvas = document.getElementById("mycanvas");
      if (canvas.getContext)
      {
        var ctx=canvas.getContext('2d');
        ctx.strokeStyle='#000000';
        ctx.fillStyle='#000000';    //黑色
        ctx.beginPath();
        ctx.moveTo(this.x+2*this.r,this.y+this.r);
        ctx.arc(this.x+this.r,this.y+this.r,this.r,0,2*Math.PI);//半径为25的圆 ,黑棋的圆心是(this.x+this.r,this.y+this.r）
        ctx.closePath();
        ctx.stroke();               //必须有
        ctx.fill();
      }
  };
}
//黑棋移动，需要配合计时器！！！
function BlackChessRunAhead()
{
  var speed;
  if(Level == 1)
  {
    speed = 5;
  }
  else
  {
    speed = 10;
  }
  for(var i = 0; i < BlackChessArray.length; i++)
  {
    if(BlackChessArray[i].status)//正常区域内
    {
      if(BlackChessArray[i].direction==1)//上
      {
        BlackChessArray[i].y -= speed; 
      }
      else if(BlackChessArray[i].direction==2)//下
      {
        BlackChessArray[i].y += speed;
      }
      else if(BlackChessArray[i].direction == 3)//左
      {
        BlackChessArray[i].x -=speed;
      }
      else if(BlackChessArray[i].direction==4)//右
      {
        BlackChessArray[i].x += speed;
      }
    }
  }
  for(var i = 0; i < BlackChessArray.length; i++)
  {  
    if(BlackChessArray[i].x >950 || BlackChessArray[i].x < 500||BlackChessArray[i].y > 650 || BlackChessArray[i].y < 100)
    {
      BlackChessArray[i].status = false;    //将出界的黑棋状态设为false
    }
  }
  var canvas=document.getElementById("mycanvas");  
  var cxt=canvas.getContext("2d");  
  Redraw();
}
//创建新的黑棋对象
function CreateNewBlackChess()
{
  if(Level <= 2)
  {
    BlackChessArray.push(new BlackChess(500,100,25));        //新建黑棋加入数组
  }
  else
  {
    BlackChessArray.push(new BlackChess(500,100,25));        
    BlackChessArray.push(new BlackChess(500,100,25));        //第三关时每次加入两个棋子
  }
}
//绘制游戏开始界面
function drawGameInterface()
{
  var btn = document.getElementById("Startbutton");
  btn.style.display = "none";
  
  GameStatus = "Playing";//游戏状态为正在游戏中
  var canvas = document.getElementById("mycanvas");
  if (canvas.getContext)
  {
    var ctx=canvas.getContext('2d');
    var my_gradient = ctx.createLinearGradient(0,0,0,800);
    my_gradient.addColorStop(0,"OrangeRed");
    my_gradient.addColorStop(1,"Orange");
    ctx.fillStyle = my_gradient;
    ctx.fillRect(500,100,500,600);
    drawRoundRect(ctx,650,350,210,210,50);
    drawLine(ctx,650,350,210,210);
    
    WhiteChess.draw();
	  BlueBlock.draw();
    BlackChessMoveTimer = window.setInterval(BlackChessRunAhead,25);	 //控制黑棋移动
    BlackChessProduceTimer = window.setInterval(CreateNewBlackChess,2000);//每隔2秒新建一个黑棋
  }
}
//绘制圆角矩形
function drawRoundRect(ctx,x,y,w, h,r)
{
  ctx.strokeStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.moveTo(x, y+r);
  ctx.lineTo(x,y+h-r);
  ctx.quadraticCurveTo(x, y+h,x+r,y+h);
  ctx.lineTo(x+w-r,y+h);
  ctx.quadraticCurveTo(x+w, y+h,x+w,y+h-r);
  ctx.lineTo(x+w,y+r);
  ctx.quadraticCurveTo(x+w, y,x+w-r,y);
  ctx.lineTo(x+r,y);
  ctx.quadraticCurveTo(x, y,x,y+r);
  ctx.closePath();
  ctx.stroke();
}
//绘制内部线条
function drawLine(ctx,x,y,w,h)
{
  ctx.strokeStyle = '#FFFFFF';//白色
  ctx.beginPath();
  ctx.moveTo(x, y+h/3);
  ctx.lineTo(x+w,y+h/3);
  ctx.moveTo(x, y+2*h/3);
  ctx.lineTo(x+w,y+2*h/3);
  ctx.moveTo(x+w/3, y);
  ctx.lineTo(x+w/3,y+h);
  ctx.moveTo(x+2*w/3, y);
  ctx.lineTo(x+2*w/3,y+h);
  ctx.closePath();
  ctx.stroke();
  
}
//键盘响应
document.onkeydown=function(event)
{
  //keyCode 37 = Left  keyCode 38 = Up keyCode 39 = Right keyCode 40 = Down
  if(GameStatus != "Playing")
    return;
  var e = event || window.event || arguments.callee.caller.arguments[0];   
  if(e && e.keyCode==37 && WhiteChessStatus%3 != 0)
  { //左键
    //白棋不在最左边
      WhiteChessStatus-=1;
      WhiteChess.x-=70;
  }
  else if(e && e.keyCode==38 && parseInt(WhiteChessStatus/3) != 0)
  { //上键
    //白棋不在最上边
      WhiteChessStatus-=3;
      WhiteChess.y-=70;
  }
  else if(e && e.keyCode==39 && WhiteChessStatus%3 != 2)
  { //右键
    //白棋不在最右边
      WhiteChessStatus+=1;
      WhiteChess.x+=70;
  }
  else if(e && e.keyCode==40 && parseInt(WhiteChessStatus/3) != 2)
  { //下键
    //白棋不在最下边
      WhiteChessStatus+=3;
      WhiteChess.y+=70;
  }
  /*var c=document.getElementById("mycanvas");  
  var cxt=c.getContext("2d");  
  cxt.clearRect(0,0,c.width,c.height); //清空画布*/
  if(IsMeetBlockChess())//白棋吃掉了蓝色方块
  {
      BlueBlockStatus = -1;//被吃掉
      score += 1;
      if(score < 20){
        Level = parseInt(score / 10) + 1;//根据得分确定关
      }
      else{
        Level = 3;
      }
  }
  if(WhiteChess.isLive)
  {
     Redraw();
  }
  else{
    drawGameOver();
  }
}

function drawStart(){
  //var btn = document.getElementById("ReStartbutton");
  //btn.style.display = "none";//只在结束界面里显示重新游戏按钮
  var canvas = document.getElementById("mycanvas");
  if (canvas.getContext)
  {
    var ctx=canvas.getContext('2d');
    ctx.clearRect(0,0,canvas.width,canvas.height); //清空画布
    //ctx.clearRect(0,0,canvas.width,canvas.height); //清空画布
    var my_gradient = ctx.createLinearGradient(0,0,0,800);
    my_gradient.addColorStop(0,"OrangeRed");
    my_gradient.addColorStop(1,"Orange"); 
    ctx.fillStyle = my_gradient;
    ctx.fillRect(500,100,500,600);
    ctx.font = "50px STKaiti";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText("SMOVE", 650, 250);
  }
 
}
//重新绘制游戏界面
function Redraw(){
  //var btn = document.getElementById("ReStartbutton");
  //btn.style.display = "none";//只在结束界面里显示重新游戏按钮

  MeetBlackWhite(); //检测白棋是否存活

  var canvas = document.getElementById("mycanvas");
  if (canvas.getContext)
  {
    var ctx=canvas.getContext('2d');
    ctx.clearRect(0,0,canvas.width,canvas.height); //清空画布
    var my_gradient = ctx.createLinearGradient(0,0,0,800);
    if(Level == 1)
    {
      my_gradient.addColorStop(0,"OrangeRed");
      my_gradient.addColorStop(1,"Orange");
    }
    else if(Level == 2)
    {
      my_gradient.addColorStop(0,"LawnGreen");
      my_gradient.addColorStop(1,"#FFFF6F");
    }
    else if(Level == 3)
    {
      my_gradient.addColorStop(0,"SlateBlue");
      my_gradient.addColorStop(1,"Turquoise");
    }
    ctx.fillStyle = my_gradient;
    ctx.fillRect(500,100,500,600);
    drawRoundRect(ctx,650,350,210,210,50);
    drawLine(ctx,650,350,210,210);
    //MeetBlackWhite();   //检测白棋是否存活  调整语句顺序
    if(WhiteChess.isLive)//白棋存活
    {
      WhiteChess.draw();
      BlueBlock.draw();
      //显示成绩
      ctx.font = "48px KaiTi";
      ctx.fillStyle = "Indigo";
      if(Level == 1)
      {
        ctx.fillText("第1关",680,150);
      }
      else if(Level == 2)
      {
       ctx.fillText("第2关",680,150); 
      }
      else if(Level == 3)
      {
        ctx.fillText("第三关",680,150); 
      }
      ctx.fillText("Score： "+score, 650, 250);
      //改变黑棋位置
      for(var i = 0; i < BlackChessArray.length; i++)
      {  
        if(BlackChessArray[i].status)
        {
          BlackChessArray[i].draw();
        }  
      }
    }
    else
    {
      window.clearInterval(BlackChessMoveTimer);//游戏结束，关闭计时器
      window.clearInterval(BlackChessProduceTimer);
      drawGameOver();
    }	  
  }
}

//检测蓝色方块与白棋是否相遇
function IsMeetBlockChess()
{
  if(WhiteChessStatus===BlueBlockStatus)
  {
    return true;
  }
  else{
    return false;
  }
}

//检测黑棋是否与白棋相遇
function MeetBlackWhite()

{
  for(var i = 0; i < BlackChessArray.length; i++)
  {
    if((BlackChessArray[i].x+BlackChessArray[i].r) == (WhiteChess.x+70+35)) //圆心在一条竖直线上
    {
      if(Math.abs(BlackChessArray[i].y+BlackChessArray[i].r-(WhiteChess.y+70+35)) <= 45)
      {
        WhiteChess.isLive = false;//白棋已死亡
      }
    }
    else if((BlackChessArray[i].y+BlackChessArray[i].r) == (WhiteChess.y+70+35))//圆心在一条水平线上
    {
      if(Math.abs(BlackChessArray[i].x+BlackChessArray[i].r-(WhiteChess.x+70+35)) <= 45)
      {
        WhiteChess.isLive = false;
      }
    }
  }
  return false;
}
//绘制游戏结束界面
function drawGameOver()
{
  var canvas = document.getElementById("mycanvas");
  if (canvas.getContext)
  {
    var ctx=canvas.getContext('2d');
    ctx.clearRect(0,0,canvas.width,canvas.height); //清空画布
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "red";
    var my_gradient = ctx.createLinearGradient(0,0,0,800);
    my_gradient.addColorStop(0,"LawnGreen");
    my_gradient.addColorStop(1,"LightGreen");
    ctx.fillStyle = my_gradient;
    ctx.moveTo(500,100);
    ctx.lineTo(1000,100);
    ctx.lineTo(1000,600);
    ctx.lineTo(500,600);
    ctx.lineTo(500,100);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    //ctx.font = "40pt STKaiti";
    //ctx.strokeText("Game Over !", 630, 250);
    //ctx.strokeText("Your score: "+score, 630,400);
    //ctx.strokeStyle = "white";
    //ctx.stroke();
    ctx.font = "48px STKaiti";
    ctx.fillStyle = "Indigo";
    ctx.fillText("Game Over !", 630, 250);
    ctx.fillText("Your score: "+score, 630,320);
    var btn = document.getElementById("ReStartbutton");
    btn.style.display = "block";//只在结束界面里显示重新游戏按钮
  }
}


function RedrawGameInterface()
{
  //还原全局变量
  BlueBlockStatus = -1;	//非负表示已经存在蓝块
  WhiteChessStatus = -1;//非负表示白棋存在
  WhiteChess.x = 650;
  WhiteChess.y = 350;
  score = 0;				//得分数		
  BlackChessArray.length = 0;//黑块数组
  Level = 1;              //初始化为第一关
  WhiteChess.isLive = true;
  //不显示start按钮
  var btn = document.getElementById("Startbutton");
  btn.style.display = "none";

  var btn = document.getElementById("ReStartbutton");
  btn.style.display = "none";
  
  GameStatus = "Playing";//游戏状态为正在游戏中
  var canvas = document.getElementById("mycanvas");
  if (canvas.getContext)
  {
    var ctx=canvas.getContext('2d');
    ctx.clearRect(0,0,canvas.width,canvas.height); //清空画布
    var my_gradient = ctx.createLinearGradient(0,0,0,800);
    my_gradient.addColorStop(0,"OrangeRed");
    my_gradient.addColorStop(1,"Orange");
    ctx.fillStyle = my_gradient;
    ctx.fillRect(500,100,500,600);
    drawRoundRect(ctx,650,350,210,210,50);
    drawLine(ctx,650,350,210,210);
    
    WhiteChess.draw();
	  BlueBlock.draw();
    BlackChessMoveTimer = window.setInterval(BlackChessRunAhead,25);	 //控制黑棋移动
    BlackChessProduceTimer = window.setInterval(CreateNewBlackChess,2000);//每隔2秒新建一个黑棋
  }
}
//控制按钮闪烁
function pre()
{
	console.info(1111111111111111);
	var clickmusic = document.getElementById("clickmusic");
  clickmusic.play();
  setTimeout(drawGameInterface,2000);
  var buttontimer = setInterval(buttonLiner, 10);
  var startbutton = document.getElementById("Startbutton");
  var disaflag = 100;
  var aflag = 0;
  var count = 0;
	function buttonLiner(){
	count += 1;
	if(disaflag >= 0){
		startbutton.style.opacity = disaflag/100;                                          
		disaflag -= 10;
	}
	else{
		startbutton.style.opacity = aflag/100;
		if(aflag < 100)
			aflag += 10;
		if(aflag == 80)
		{
			aflag = 0;
			disaflag = 100;
		}
	}
	if(count >= 180){
		clearInterval(buttontimer);
		//startbutton.style.opacity = 1;
	}
  }
}

function repre()
{
  var clickmusic = document.getElementById("clickmusic");
  clickmusic.play();
  setTimeout(RedrawGameInterface,2000);
  var buttontimer = setInterval(buttonLiner, 10);
  var restartbutton = document.getElementById("ReStartbutton");
  var disaflag = 100;
  var aflag = 0;
  var count = 0;
	function buttonLiner(){
	count += 1;
	if(disaflag >= 0){
		restartbutton.style.opacity = disaflag/100;                                          
		disaflag -= 10;
	}
	else{
		restartbutton.style.opacity = aflag/100;
		if(aflag < 100)
			aflag += 10;
		if(aflag == 80)
		{
			aflag = 0;
			disaflag = 100;
		}
	}
	if(count >= 172){
		clearInterval(buttontimer);
		restartbutton.style.opacity = 1;
	}
  }
}
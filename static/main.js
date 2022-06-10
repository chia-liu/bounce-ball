//  Origin > [GameObject]
//  $el - element
//  Position
//  Size
//  updateCss
//  Collide - 偵測碰撞
// ---------------------
// [Ball] (gameObject)
// Velocity - speed
// Update: moving + css
// Init
// ---------------------
// [Board] (gameObject)
// Update: border + css

// =====================
// [Game] stuff
// Timer 
// Control
// Grade
// startGame
// initControl
// startGameMain
// endGame

console.clear()

// Origin > [GameObject]
var GameObject = function (position,size,selector){
  this.$el = $(selector)
  this.position = position
  this.size = size
  this.$el.css("position","absolute")
  this.updateCss()
}
// Update game Object (data > css)
GameObject.prototype.updateCss = function(){
  this.$el.css("left",this.position.x+"px")
  this.$el.css("top",this.position.y+"px")
  this.$el.css("width",this.size.width+"px")
  this.$el.css("height",this.size.height+"px")
}

// Collide(碰撞)
GameObject.prototype.collide = function(otherObject){
  let pos = otherObject.position
  let inXrange = pos.x >= this.position.x && pos.x <= this.position.x + this.size.width
  let inYrange =  pos.y >= this.position.y && pos.y <= this.position.y + this.size.height
  return inXrange && inYrange
}

// [Ball] (gameObject)
var Ball = function(){
  this.init()
  GameObject.call(this,
    this.position,
    {width: 15, height: 15},
    ".ball"
  )
}
Ball.prototype = Object.create(GameObject.prototype)
Ball.prototype.constructor = Ball.constructor
//Bouncing / position update
Ball.prototype.update = function(){
  this.position.x += this.velocity.x
  this.position.y += this.velocity.y
  this.updateCss()
  if (this.position.x <0 || this.position.x > 500){
    this.velocity.x=-this.velocity.x
  }
  if (this.position.y <0 || this.position.y > 500){
    this.velocity.y=-this.velocity.y
  }
} 
Ball.prototype.init = function(){
  this.position = { x:250 , y:250 }
  var randomDeg = Math.random()*2*Math.PI
  this.velocity = {
    x: Math.cos(randomDeg)*8,
    y: Math.sin(randomDeg)*8
  }
}
// [Board] (gameObject)
var Board = function(position,size,selector){
  GameObject.call(this,position,size,selector)
}
Board.prototype = Object.create(GameObject.prototype)
Board.prototype.constructor = Board.constructor
//檢查板子是否超出邊界與更新
Board.prototype.update = function(){
  if (this.position.x<0){
    this.position.x = 0
  }
  if (this.position.x + this.size.width>500){
    this.position.x = 500 - this.size.width
  }
  this.updateCss()
}

var board1 = new Board(
  {x: 0,y: 30},  {width: 100,height: 15},
  ".b1"  
)

var board2 = new Board(
  {x: 0,y: 455},  {width: 100,height: 15},
  ".b2"  
)

var ball = new Ball()
// [Game]
var Game = function (){
  this.timer = null
  this.initControl()
  this.control = {}
  this.grade=0
}
// Game timing count
Game.prototype.startGame = function(){
  let time = 3
  let _this = this
  $("button").hide()
  ball.init()
  $(".infoText").text("Ready")
  this.timer = setInterval(function(){
    $(".infoText").text(time)
    if (time<=0){
      $(".info").hide()
      clearInterval( _this.timer )
      _this.startGameMain()
    }
    time--
  },1000)  
}

// keyboard setting
Game.prototype.initControl = function(){
  let _this = this
  $(window).keydown(function(evt){
    _this.control[evt.key]=true
  })
  $(window).keyup(function(evt){
    _this.control[evt.key]=false
  })
}
// main loop
Game.prototype.startGameMain = function(){
  let _this = this
  this.timer = setInterval(function(){
    if (board1.collide(ball)){
      console.log("Hit Board 1!")
      ball.velocity.y = Math.abs(ball.velocity.y)
      ball.velocity.x*=1.1
      ball.velocity.y*=1.1
      ball.velocity.x+=0.5-Math.random()
      ball.velocity.y+=0.5-Math.random()
    }
    if (board2.collide(ball)){
      console.log("Hit Board 2!")
      ball.velocity.y = - Math.abs(ball.velocity.y)
      _this.grade+=10
    }
    if (ball.position.y<=0){
      _this.endGame("Computer lose")
    }  
    if (ball.position.y>=500){
      _this.endGame("You lose")
    }
    if (_this.control["ArrowLeft"]){
      board2.position.x-=8
    }
    if (_this.control["ArrowRight"]){
      board2.position.x+=8
    }
    
//  auto moving board 
     board1.position.x+= ball.position.x > board1.position.x+board1.size.width/2+5? 8:0
    board1.position.x+= ball.position.x < board1.position.x+board1.size.width/2-5? -8:0
    
    ball.update()
    board1.update()
    board2.update()
    
    $(".grade").text("score: "+_this.grade)
  
  },30)  
}
// end game
Game.prototype.endGame = function(result){
  clearInterval(this.timer)
  $(".info").show()
  $("button").show()
  $(".infoText").html(result+"<br>Score: "+ this.grade)
  this.grade=0
}

// new game object
var game = new Game()





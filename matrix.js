var MATRIX_GAME = {
  matrix_dimension: 4,
  gameArea : document.getElementById("gameArea"),
  gameControls:  document.getElementById("gameControls"),
  template: "<div class='box' id = 'matrix-box-{{id}}'></div>",
  gameNotice : document.getElementById("gameNotice"),
  delay: 750,
  threshold: 5, 
  lastInterval : null,
  gameInterval: null,
  score : 0,
  gameTime: 15,
  lastElem: null,

  initialize: function(){
    clearInterval(this.lastInterval);
    clearInterval(this.gameInterval);
    this.score = 0;
  },

  startGameTime : function(){
    var that = this;
    this.initialize();
    that.gameNotice.innerHTML = "Game Started - " + that.gameTime + " and Your Score "+ that.score;
    var time = that.gameTime;
    that.gameInterval = setInterval(function(){
      time--;
      if(time == 0){
        clearInterval(that.gameInterval);
        if(that.score >= that.threshold){
            that.gameNotice.innerHTML = "You Won and Your Score is " +  that.score;
        }else{
            that.gameNotice.innerHTML = "<div style='color:red;'>You lost and Your Score is " +  that.score + "</div>";
        }
      
        that.stopGame();
      }else{
         that.gameNotice.innerHTML = "Game Started - " + time + " and Your Score "+ that.score;
      }

    },1000);
  },

  startGame: function(){
    var that = this;
    that.lastElm = null;
    this.startGameTime();

    this.lastInterval = setInterval(function(){
      if(that.lastElm){
        that.lastElm.classList.remove("blink");
      }
      var currentElm  = document.getElementById("matrix-box-"+that.getRandomNumber(that.matrix_dimension*that.matrix_dimension,0));
      currentElm ? currentElm.classList.add("blink") : "";
      that.lastElm = currentElm;
    },this.delay);
  },

  stopGame: function(reset){
    clearInterval(this.lastInterval);
    clearInterval(this.gameInterval);
    this.lastElm ? this.lastElm.classList.remove("blink") : "";
    if(reset){
      this.gameNotice.innerHTML = "";
    } 
  },

  getRandomNumber: function(max, min){
    return Math.floor(Math.random() * (max - min) + min)
  },

  createMatrix: function(matrix_dimension){

    var dimension = matrix_dimension || this.matrix_dimension;
    this.matrix_dimension = dimension;

    var totalBox  = dimension * dimension;

    var matrixHtml = "";

    for(var i = 1; i <= totalBox; i++){
      matrixHtml = matrixHtml + this.template.replace("{{id}}", i-1);
      if((i % dimension) == 0){
        matrixHtml = matrixHtml + "<div></div>"
      }
    }
    this.gameArea.innerHTML = matrixHtml;

    this.handleInteraction();
  },

  handleInteraction: function(){
    this.gameControls.addEventListener("click", function(){MATRIX_GAME.handleControls(arguments)});
    this.gameArea.addEventListener("click", function(){MATRIX_GAME.handleMatrixClick(arguments)})
  },

  handleMatrixClick :function(event){
    var box = event[0];
    if(box.target.classList.contains("blink")){
      this.score++;
    }
  },

  handleControls: function(event){
    event = event[0];
    if(event.target.id == "startGame"){
      this.startGame();  
    }else if(event.target.id == "pauseGame"){
      this.stopGame();
    }else if(event.target.id == "stopGame"){
       this.stopGame(true);
    }
  }
};

MATRIX_GAME.createMatrix();



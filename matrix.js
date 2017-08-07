var MATRIX_GAME = {
  matrix_dimension: 3,
  
  gameArea : document.getElementById("gameArea"),
  gameControls:  document.getElementById("gameControls"),
  gameLevelElm: document.getElementById("gameLevels"),

  template: "<div class='box' id = 'matrix-box-{{id}}'></div>",
  gameNotice : document.getElementById("gameNotice"),
  delay: 1200,
  threshold: 20, 
  lastInterval : null,
  gameInterval: null,
  score : 0,
  gameTime: 15,
  lastElem: null,
  gameLevels: 10,
  completedLevels : localStorage.getItem("completedLevel") || 1,

  initialize: function(){
    clearInterval(this.lastInterval);
    clearInterval(this.gameInterval);
    this.score = 0;
    this.createMatrix();
    if(!this.gameNotice.innerHTML){
      this.gameNotice.innerHTML = "Start the Game - Score "+ this.getThreshold() + " to win"
    }
  },

  getDelay : function(){
    return this.delay - (parseInt(this.completedLevels) * 75)
  },

  getThreshold: function(){
    return this.threshold - (parseInt(this.completedLevels) + 1)
  },

  getMatrixDimension: function(){
    return this.matrix_dimension + parseInt(parseInt(this.completedLevels)/3)
  },

  displayLevels: function(){
    var levelsHtml = "",i;
    for(i = 1; i <= this.gameLevels; i++){
      if(parseInt(this.completedLevels) >= i){
         levelsHtml = levelsHtml + "<li class='done'>Level "+ i +"</li>";
      }else{
         levelsHtml = levelsHtml + "<li>Level "+ i +"</li>";
      }
     
    }
    this.gameLevelElm.innerHTML = levelsHtml;
  },

  startGameTime: function(){
    var that = this;
    var time = that.gameTime;
    that.gameInterval = setInterval(function(){
      time--;
      console.log(time);
      if(time == 1){
        clearInterval(that.gameInterval);
        if(that.score >= that.getThreshold()){
            that.gameNotice.innerHTML = "You Won and Your Score is " +  that.score;
            that.completedLevels++;
            localStorage.setItem("completedLevel", that.completedLevels);
        }else{
            that.gameNotice.innerHTML = "<div style='color:red;'>You lost and Your Score is " +  that.score + "</div>";
        }
        
        that.initialize();
        that.stopGame();

      }else{
         that.gameNotice.innerHTML = "Game Started - Score "+ that.getThreshold() + " to Win. Time left " + time + " and Your Score "+ that.score;
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
      var dimension = that.getMatrixDimension();
      var currentElm  = document.getElementById("matrix-box-"+that.getRandomNumber(dimension * dimension,0));
      currentElm ? currentElm.classList.add("blink") : "";
      that.lastElm = currentElm;
    },this.getDelay());
  },

  stopGame: function(reset){
    clearInterval(this.lastInterval);
    clearInterval(this.gameInterval);
    if(reset){
      this.gameNotice.innerHTML = "";
    } 
  },

  getRandomNumber: function(max, min){
    return Math.floor(Math.random() * (max - min) + min)
  },

  createMatrix: function(matrix_dimension){

    this.displayLevels();

    var dimension = matrix_dimension || this.getMatrixDimension();
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

MATRIX_GAME.initialize();



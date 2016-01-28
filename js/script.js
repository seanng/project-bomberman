var debug;
var gridSize   = 40;
var playerSize = 26;

var Binding = function () {
  this["76"]  = {player: "p2", action: "left", active: false};
  this["80"]  = {player: "p2", action: "up", active: false};
  this["222"] = {player: "p2", action: "right", active: false};
  this["186"] = {player: "p2", action: "down", active: false};
  this["13"]  = {player: "p2", action: "bomb", active: false};
  this["65"]  = {player: "p1", action: "left", active: false};
  this["87"]  = {player: "p1", action: "up", active: false};
  this["68"]  = {player: "p1", action: "right", active: false};
  this["83"]  = {player: "p1", action: "down", active: false};
  this["17"]  = {player: "p1", action: "bomb", active: false};
};

var CellConstructor = function(obstacle, item){
  this.obstacle = obstacle;
  this.item = item;
};

var items = [{
    name: "A",
    ability: ""
  }, {
    name: "B",
    ability: ""
  }
];

var BombConstructor = function(row, column, power, P, playerName) {
  this.blastRadius = power;
  this.bombRow = row;
  this.bombColumn = column;
  this.killSurrounding = function () {
    // check the P to see whether the player original and new position is within the blast zone
    for (var key in P) {
      var killPlayer = this.checkPlayerPos(P[key].originPos) || this.checkPlayerPos(P[key].newPos) || false;
      if (killPlayer){
        // add animation for background using jquery...
        // when animation is complete
        // remove player element
        P[key].elem.remove();
        // end game
      }
    }
    for (var setup[this.bombRow][this.bombColumn].obstacle in this.checkPlayerPos) {
      if (setup[this.bombRow][this.bombColumn].obstacle == 'W') {
        setup[row][column].obstacle == 'E';
        $('tr').eq(row).find('td').eq(column).removeClass('wood');
      }
    }
    // check bomb surrounding inside setup to destroy "W" but ignore "R"

  };
  this.checkPlayerPos = function (pos) {
    if (pos) {
      if (this.bombRow == pos.row) {
        for (var i = this.bombColumn - this.blastRadius; i <= (this.bombColumn+this.blastRadius); i++) {
          if (i === pos.column) {
            return true;
          }
        }
      }
      else if (this.bombColumn == pos.column) {
        for (var i = this.bombRow - this.blastRadius; i <= (this.bombRow + this.blastRadius); i++) {
          if (i === pos.row) {
            return true;
          }
        }
      }
    } return false;
  };

  this.explode = function () {
    var bombObj = this;
    var bombAnimate = function() {
      // add CSS class called 'boom' for rows and columns +/- blast radius
      for (var i = bombObj.bombRow - bombObj.blastRadius; i<= (bombObj.bombRow + bombObj.blastRadius); i++) {
        for (var j = bombObj.bombColumn - bombObj.blastRadius; j <= (bombObj.bombColumn + bombObj.blastRadius); j++){
          if ((i === bombObj.bombRow || j === bombObj.bombColumn) && setup[i]!==undefined && setup[i][j]!==undefined && setup[i][j].obstacle!=='R') {
            $('tr').eq(i).find('td').eq(j).addClass('boom');
          }
        }
      }
    }
    var removeBoom = function() {
      for (var i = bombObj.bombRow - bombObj.blastRadius; i<= (bombObj.bombRow + bombObj.blastRadius); i++) {
        for (var j = bombObj.bombColumn - bombObj.blastRadius; j <= (bombObj.bombColumn + bombObj.blastRadius); j++){
          if (i === bombObj.bombRow || j === bombObj.bombColumn) {
            $('tr').eq(i).find('td').eq(j).removeClass('boom');
          }
        }
      }
    }
      // setTimeout for length of blast image
    // }
    var timeout = setTimeout(function(){
      bombObj.killSurrounding();
      bombAnimate();
      $('tr').eq(bombObj.bombRow).find('td').eq(bombObj.bombColumn).removeClass('bomb');
      setup[bombObj.bombRow][bombObj.bombColumn].obstacle = 'E';
      P[playerName].availableBombs++;
      clearTimeout(timeout);
      setTimeout(removeBoom, 250);
    }, 3000);
  };

  this.explode();
};

var setup = [
  ['R','R','R','R','R','R','R','R','R','R','R','R','R','R','R'],
  ['R','E','E','A','A','A','A','A','A','A','A','A','E','E','R'],
  ['R','E','R','A','R','A','R','A','R','A','R','A','R','E','R'],
  ['R','A','A','A','A','A','A','A','A','A','A','A','A','A','R'],
  ['R','A','R','A','R','A','R','A','R','A','R','A','R','A','R'],
  ['R','A','A','W','A','A','A','A','A','A','A','A','A','A','R'],
  ['R','A','R','A','R','A','R','A','R','A','R','A','R','A','R'],
  ['R','A','A','A','A','W','A','A','A','A','A','A','A','A','R'],
  ['R','A','R','A','R','A','R','A','R','A','R','A','R','A','R'],
  ['R','A','A','A','A','A','A','A','A','A','A','A','A','A','R'],
  ['R','E','R','A','R','A','R','A','R','A','R','A','R','E','R'],
  ['R','E','E','A','A','A','A','A','A','A','A','A','E','E','R'],
  ['R','R','R','R','R','R','R','R','R','R','R','R','R','R','R']
];


// create a loop that scans

$(document).ready(function() {
  // Variables
  var bindings = new Binding;

  var world = function(){
    for (var i = 0; i < setup.length; i++) {
      for (var j = 0; j < setup[i].length; j++) {
        if (setup[i][j] == 'R') {
          setup[i][j] = new CellConstructor('R')
        } else if (setup[i][j] == 'E') {
          setup[i][j] = new CellConstructor('E')
        } else if (setup[i][j] == 'A') {
          var includeObstacle = Math.random();
          var obstacle = includeObstacle < 0.9 ? 'W' : 'E';
          var includeItem = Math.random();
          var item = obstacle && includeItem < 0.6 ? items[Math.floor((Math.random() * items.length))] : null;
          setup[i][j] = new CellConstructor(obstacle, item);
        }
      }
    }
  }

  var populateHTML = function () {
    // your code here
    for (var i = 0; i < setup.length; i++) {
      for (var j = 0; j < setup[i].length; j++) {
        if (setup[i][j].obstacle == 'W') {
          $('tr').eq(i).find('td').eq(j).addClass('wood');
        }
        // if (setup[i][j].item == 'speed') {
        //   $('tr').eq(i).find('td').eq(j).addClass('speed');
        // }
      }
    }

  }

  var players = {
    p1: {
      name: 'p1',
      elem: $('#player1'),
      defaultTop: $('#player1').position().top,
      defaultLeft: $('#player1').position().left,
      defaultOffsetTop: gridSize,
      defaultOffsetLeft: gridSize,
      originPos: {
        row: 1,
        column: 1
      },
      newPos: null,
      availableBombs: 3,
      blastRadius: 2
    },
    p2: {
      name: 'p2',
      elem: $('#player2'),
      defaultTop: $('#player2').position().top,
      defaultLeft: $('#player2').position().left,
      defaultOffsetTop: gridSize * 11,
      defaultOffsetLeft: gridSize * 13,
      originPos: {
        row: 11,
        column: 13
      },
      newPos: null,
      availableBombs: 1,
      blastRadius: 1
    }
  };

  var bindKeyDown = function () {
    $(document).on("keydown", function(event) {
      var action = bindings[event.keyCode] ? bindings[event.keyCode].action : undefined;
      if (action) {
        // event.preventDefault();
        bindings[event.keyCode].active = true;
      }
      return false;
    });
  };

  var bindKeyUp = function () {
    $(document).on("keyup", function(event) {
      var action = bindings[event.keyCode] ? bindings[event.keyCode].action : undefined;
      if (action) {
        // event.preventDefault();
        bindings[event.keyCode].active = false;
      }
      return false;
    });
  };

  var addNewPos = function (p, newRow, newColumn) {
    p.newPos = {
      row: newRow,
      column: newColumn
    };
  };

  var checkTransition = function (p, posRequirement1, cutoff, posRequirement2) {
    var originalRow    = p.originPos.row;
    var originalColumn = p.originPos.column;
    var newRow         = p.newPos.row;
    var newColumn      = p.newPos.column;

    if (p.playerTopBorder >= p.blockTopBorder && p.playerRightBorder <= p.blockRightBorder && p.playerBotBorder <= p.blockBotBorder && p.playerLeftBorder >= p.blockLeftBorder) {
      p.newPos = null;
    }
    else if (p.playerTopBorder >= p.newBlockTopBorder && p.playerRightBorder <= p.newBlockRightBorder && p.playerBotBorder <= p.newBlockBotBorder && p.playerLeftBorder >= p.newBlockLeftBorder) {
      p.originPos.row = newRow;
      p.originPos.column = newColumn;
      p.newPos = null;
    }
  };

  var updatePlayerPos = function (p, direction, amount) {
    if (!!direction && !!amount) {
      p.elem.css(direction, amount + "px");
    }
    p.playerC    = p.originPos.column;
    p.playerR    = p.originPos.row;
    p.playerOrigin = setup[p.originPos.row][p.originPos.column];
    p.playerWindowX = p.elem.position().left;
    p.playerWindowY = p.elem.position().top;
    p.playerLeftBorder  = p.playerWindowX - p.defaultLeft + p.defaultOffsetLeft;
    p.playerRightBorder = p.playerWindowX - p.defaultLeft + p.defaultOffsetLeft + playerSize;
    p.playerTopBorder   = p.playerWindowY - p.defaultTop + p.defaultOffsetTop;
    p.playerBotBorder   = p.playerWindowY - p.defaultTop + p.defaultOffsetTop + playerSize;
    p.blockLeftBorder  = ((p.playerC - 1) * gridSize) + gridSize;
    p.blockRightBorder = (p.playerC * gridSize) + gridSize;
    p.blockTopBorder   = ((p.playerR - 1) * gridSize) + gridSize;
    p.blockBotBorder   = (p.playerR * gridSize) + gridSize;
    p.playerInTransit  = p.newPos ? true : false;
    p.newPlayerC = p.newPos ? p.newPos.column : null;
    p.newPlayerR = p.newPos ? p.newPos.row : null;
    p.newPlayerOrigin = p.newPos ? setup[p.newPlayerR][p.newPlayerC] : null;
    p.newBlockLeftBorder  = p.newPos ? ((p.newPlayerC - 1) * gridSize)+ gridSize : null;
    p.newBlockRightBorder = p.newPos ? (p.newPlayerC * gridSize) + gridSize : null;
    p.newBlockTopBorder   = p.newPos ? ((p.newPlayerR - 1) * gridSize) + gridSize : null;
    p.newBlockBotBorder   = p.newPos ? (p.newPlayerR * gridSize) + gridSize : null;
  };

  var movePlayer = function (p, action) {
    updatePlayerPos(p);

    var bombPlantLocation = function(){
      if (p.newPlayerC!==p.playerC) {
        if (Math.abs(p.playerLeftBorder - p.blockRightBorder) > Math.abs(p.playerLeftBorder - p.blockLeftBorder)) {
          return p.playerOrigin.obstacle ;
        } else {
          return p.newPlayerOrigin.obstacle;
        }
      } else if (p.newPlayerR!==p.playerR){
        if (Math.abs(p.playerTopBorder - p.blockBotBorder) > Math.abs(p.playerTopBorder - p.blockTopBorder)) {
          return p.playerOrigin.obstacle;
        } else {
          return p.newPlayerOrigin.obstacle;
        }
      } else return p.playerOrigin.obstacle;
    }

    if (action =="bomb" && p.availableBombs > 0 && bombPlantLocation()!=="B"){

      var plantBombOrigin = function() {
        var newBomb = new BombConstructor(p.originPos.row, p.originPos.column, p.blastRadius, players, p.name);
        setup[p.originPos.row][p.originPos.column].obstacle = "B";
        $('tr').eq(p.playerR).find('td').eq(p.playerC).addClass('bomb');
      }
      var plantBombNew = function() {
        var newBomb = new BombConstructor(p.newPos.row, p.newPos.column, p.blastRadius, players, p.name);
        setup[p.newPlayerR][p.newPlayerC].obstacle = "B";
        $('tr').eq(p.newPlayerR).find('td').eq(p.newPlayerC).addClass('bomb');
      }

      if (p.playerInTransit){
        if (p.newPlayerC!==p.playerC) {
          if (Math.abs(p.playerLeftBorder - p.blockRightBorder) > Math.abs(p.playerLeftBorder - p.blockLeftBorder)) {
            plantBombOrigin();
          } else plantBombNew();
        }
        else if (Math.abs(p.playerTopBorder - p.blockBotBorder) > Math.abs(p.playerTopBorder - p.blockTopBorder)) {
          plantBombOrigin();
        }
        else {
          plantBombNew();
        }
      } else plantBombOrigin();
      p.availableBombs--;
      console.log (p.availableBombs);
    }

    if (action == "left"){
      currentBlockRockValidator = setup[p.playerR][p.playerC - 1].obstacle == 'E';

      if (p.playerInTransit) {
        if (p.playerLeftBorder > p.blockLeftBorder || p.playerLeftBorder > p.newBlockLeftBorder) {
          updatePlayerPos(p, "left", p.playerWindowX - 1);
          checkTransition(p);
        }
      } else {
        if (p.playerLeftBorder > p.blockLeftBorder) {
          updatePlayerPos(p, "left", p.playerWindowX - 1);
        }
        else if (currentBlockRockValidator) {
          updatePlayerPos(p, "left", p.playerWindowX - 1);
          addNewPos(p, p.playerR, p.playerC - 1);
          checkTransition(p);
        }
      }
    }

    if (action == "right"){
      currentBlockRockValidator = setup[p.playerR][p.playerC + 1].obstacle == 'E';

      if (p.playerInTransit) {
        if (p.playerRightBorder < p.blockRightBorder || p.playerRightBorder < p.newBlockRightBorder) {
          updatePlayerPos(p, "left", p.playerWindowX + 1);
          checkTransition(p);
        }
      } else {
        if (p.playerRightBorder < p.blockRightBorder){
          updatePlayerPos(p, "left", p.playerWindowX + 1);
        }
        else if (currentBlockRockValidator) {
          updatePlayerPos(p, "left", p.playerWindowX + 1);
          addNewPos(p, p.playerR, p.playerC + 1);
          checkTransition(p);
        }
      }
    }

    if (action == "up"){
      currentBlockRockValidator = setup[p.playerR - 1][p.playerC].obstacle == 'E';

      if (p.playerInTransit) {
        if (p.playerTopBorder > p.blockTopBorder || p.playerTopBorder > p.newBlockTopBorder) {
          updatePlayerPos(p, "top", p.playerWindowY - 1);
          checkTransition(p);
        }
      } else {
        if (p.playerTopBorder > p.blockTopBorder){
          updatePlayerPos(p, "top", p.playerWindowY - 1);
        }
        else if (currentBlockRockValidator) {
          updatePlayerPos(p, "top", p.playerWindowY - 1);
          addNewPos(p, p.playerR - 1, p.playerC);
          checkTransition(p);
        }
      }
    }

    if (action == "down"){
      currentBlockRockValidator = setup[p.playerR + 1][p.playerC].obstacle == 'E';

      if (p.playerInTransit) {
        if (p.playerBotBorder < p.blockBotBorder || p.playerBotBorder < p.newBlockBotBorder) {
          updatePlayerPos(p, "top", p.playerWindowY + 1);
          checkTransition(p);
        }
      } else {
        if (p.playerBotBorder < p.blockBotBorder){
          updatePlayerPos(p, "top", p.playerWindowY + 1);
        }
        else if (currentBlockRockValidator){
          updatePlayerPos(p, "top", p.playerWindowY + 1);
          addNewPos(p, p.playerR + 1, p.playerC);
          checkTransition(p);
        }
      }
    }
  };

  var gameLoop = function () {
    for (var key in bindings) {
      var playerName   = bindings[key].player;
      var playerObject = players[playerName];
      var active       = bindings[key].active;
      var action       = bindings[key].action;
      if (active) {
        movePlayer(playerObject, action);
      }
    }
  };

  var init = function () {
    world();
    populateHTML();
    bindKeyDown();
    bindKeyUp();

    setInterval(gameLoop, 10);
  };

  init();
});
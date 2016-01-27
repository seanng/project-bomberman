var debug;
var gridSize   = 40;
var playerSize = 34;

var Binding = function () {
  this["76"]  = {player: "p1", action: "left", active: false};
  this["80"]  = {player: "p1", action: "up", active: false};
  this["222"] = {player: "p1", action: "right", active: false};
  this["186"] = {player: "p1", action: "down", active: false};
  this["13"]  = {player: "p1", action: "bomb", active: false};
  this["65"]  = {player: "p2", action: "left", active: false};
  this["87"]  = {player: "p2", action: "up", active: false};
  this["68"]  = {player: "p2", action: "right", active: false};
  this["83"]  = {player: "p2", action: "down", active: false};
  this["20"]  = {player: "p2", action: "bomb", active: false};
};

var BombObject = function(row, column, power, p, P) {
  this.blastRadius = power;
  this.bombRow = row;
  this.bombColumn = column;
  this.killSurrounding = function () {
    for (var key in P) {
      console.log(key)
    }
  };
  this.explode = function () {
    var bombRow = this.bombRow;
    var bombColumn = this.bombColumn;
    var killSurrounding = this.killSurrounding;
    var timeout = setTimeout(function(){
      console.log("test");
      console.log(bombRow, bombColumn)
      $('tr').eq(bombRow).find('td').eq(bombColumn).removeClass('bomb');
      p.availableBombs++;
      killSurrounding();
      clearTimeout(timeout);
    }, 1000)
  };

  this.explode();
}

var setup = [
  ['R','R','R','R','R','R','R','R','R','R','R','R','R','R','R'],
  ['R',null,null,null,null,null,null,null,null,null,null,null,null,null,'R'],
  ['R',null,'R',null,'R',null,'R',null,'R',null,'R',null,'R',null,'R'],
  ['R',null,null,null,null,null,null,null,null,null,null,null,null,null,'R'],
  ['R',null,'R',null,'R',null,'R',null,'R',null,'R',null,'R',null,'R'],
  ['R',null,null,null,null,null,null,null,null,null,null,null,null,null,'R'],
  ['R',null,'R',null,'R',null,'R',null,'R',null,'R',null,'R',null,'R'],
  ['R',null,null,null,null,null,null,null,null,null,null,null,null,null,'R'],
  ['R',null,'R',null,'R',null,'R',null,'R',null,'R',null,'R',null,'R'],
  ['R',null,null,null,null,null,null,null,null,null,null,null,null,null,'R'],
  ['R',null,'R',null,'R',null,'R',null,'R',null,'R',null,'R',null,'R'],
  ['R',null,null,null,null,null,null,null,null,null,null,null,null,null,'R'],
  ['R','R','R','R','R','R','R','R','R','R','R','R','R','R','R']
];

$(document).ready(function() {
  // Variables
  var bindings = new Binding;

  var players = {
    p1: {
      name: 'p1',
      elem: $('#player1'),
      defaultTop: $('#player1').position().top,
      defaultLeft: $('#player1').position().left,
      originPos: {
        row: 1,
        column: 1
      },
      newPos: null,
      availableBombs: 1,
      blastRadius: 1
    }
  };

  var bombsArr = [];

  var onKeyDown = function(event) {
    var action = bindings[event.keyCode] ? bindings[event.keyCode].action : undefined;
    if (action) {
      // event.preventDefault();
      bindings[event.keyCode].active = true;
    }
    return false;
  };

  var onKeyUp = function(event) {
    var action = bindings[event.keyCode] ? bindings[event.keyCode].action : undefined;
    if (action) {
      // event.preventDefault();
      bindings[event.keyCode].active = false;
    }
    return false;
  };

  $(document).on("keydown", onKeyDown);
  $(document).on("keyup", onKeyUp);

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
    p.playerWindowX = p.elem.position().left;
    p.playerWindowY = p.elem.position().top;
    p.playerLeftBorder  = p.playerWindowX - p.defaultLeft + gridSize;
    p.playerRightBorder = p.playerWindowX - p.defaultLeft + gridSize + playerSize;
    p.playerTopBorder   = p.playerWindowY - p.defaultTop + gridSize;
    p.playerBotBorder   = p.playerWindowY - p.defaultTop + gridSize + playerSize;
    p.blockLeftBorder  = ((p.playerC - 1) * gridSize) + gridSize;
    p.blockRightBorder = (p.playerC * gridSize) + gridSize;
    p.blockTopBorder   = ((p.playerR - 1) * gridSize) + gridSize;
    p.blockBotBorder   = (p.playerR * gridSize) + gridSize;
    p.playerInTransit  = p.newPos ? true : false;
    p.newPlayerC = p.newPos ? p.newPos.column : null;
    p.newPlayerR = p.newPos ? p.newPos.row : null;
    p.newBlockLeftBorder  = p.newPos ? ((p.newPlayerC - 1) * gridSize)+ gridSize : null;
    p.newBlockRightBorder = p.newPos ? (p.newPlayerC * gridSize) + gridSize : null;
    p.newBlockTopBorder   = p.newPos ? ((p.newPlayerR - 1) * gridSize) + gridSize : null;
    p.newBlockBotBorder   = p.newPos ? (p.newPlayerR * gridSize) + gridSize : null;
  };

  var movePlayer = function (p, action) {
    updatePlayerPos(p);

    if (action =="bomb" && p.availableBombs > 0){

      var plantBombOrigin = function() {
        var newBomb = new BombObject(p.originPos.row, p.originPos.column, p.blastRadius, p, players);
        bombsArr.push(newBomb);
        debug = bombsArr
        console.log('planting bomb at original block');
        console.log (p.playerR,p.playerC);
        setup[p.originPos.row][p.originPos.column] = "B";
        $('tr').eq(p.playerR).find('td').eq(p.playerC).addClass('bomb');
      }
      var plantBombNew = function() {
        var newBomb = new BombObject(p.newPos.row, p.newPos.column, p.blastRadius, p, players);
        bombsArr.push(newBomb);
        debug = bombsArr
        console.log('planting bomb at new block')
        setup[p.newPos.row][p.newPos.column] = "B";
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
      console.log(setup)
    }

    if (action == "left"){
      currentBlockRockValidator = ((setup[p.playerR][p.playerC - 1]!=="R") && (setup[p.playerR][p.playerC - 1]!=="B"));

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
      currentBlockRockValidator = (setup[p.playerR][p.playerC + 1]!== "R" && setup[p.playerR][p.playerC + 1]!=="B");

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
      currentBlockRockValidator = (setup[p.playerR - 1][p.playerC] !== "R" && setup[p.playerR - 1][p.playerC] !== "B");
      console.log(setup[p.playerR - 1][p.playerC] !== "R", setup[p.playerR - 1][p.playerC] !== "B")
      console.log(setup);

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
      currentBlockRockValidator = (setup[p.playerR + 1][p.playerC]!=="R" && setup[p.playerR + 1][p.playerC]!=="B");

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
  setInterval(gameLoop, 16);
});

    // if (action == "right"){

    // }
    // if (p.playerInTransit)

    // (playerObject.newPos){ //if newPos = true
    //   console.log("newPos")
    //   if (action=="left"){
    //     console.log (playerObject.originPos, playerObject.newPos)
    //     if (playerL%40==4){
    //       console.log("1C, removing newPos");
    //       playerObject.originPos.column = newPlayerC;
    //       playerObject.newPos = null;
    //     }
    //     if (playerC !== newPlayerC){
    //       console.log("1D, in between columns")
    //       // if newPos column is different, move left;
    //       var newPos = $player.position().left - 1;
    //       $player.css("left", newPos + "px");
    //     }
    //     if ((playerR !== newPlayerR) && (playerL%40!==0)){
    //       console.log("1E, in between rows")
    //       var newPos = $player.position().left - 1;
    //       $player.css("left", newPos + "px");
    //     }
    //   }
    //   if (action=="right"){
    //     console.log (playerObject.originPos, playerObject.newPos)
    //     if (playerL%40==0){
    //       console.log("2C, removing newPos");
    //       playerObject.originPos.row = newPlayerR;
    //       playerObject.originPos.column = newPlayerC;
    //       playerObject.newPos = null;
    //     }
    //     if (playerC !== newPlayerC){
    //       console.log("2D, in between columns");
    //       // if newPos column is different, move left;
    //       var newPos = $player.position().left + 1;
    //       $player.css("left", newPos + "px");
    //     }
    //     if ((playerR !== newPlayerR) && (playerL%40!==4)){
    //       console.log("2E, in between rows");
    //       var newPos = $player.position().left + 1;
    //       $player.css("left", newPos + "px");
    //     }
    //   }
    //   if (action=="up"){
    //     console.log (playerObject.originPos, playerObject.newPos)
    //     if (playerT%40==4){
    //       console.log("3C, removing newPos");
    //       playerObject.originPos.row = newPlayerR;
    //       playerObject.originPos.column = newPlayerC;
    //       playerObject.newPos = null;
    //     }
    //     if (playerR !== newPlayerR){
    //       console.log("3D, in between columns");
    //       // if newPos column is different, move left;
    //       var newPos = $player.position().top - 1;
    //       $player.css("top", newPos + "px");
    //     }
    //     if ((playerC !== newPlayerC) && (playerT%40!==0)){
    //       console.log("3E, in between rows");
    //       var newPos = $player.position().top - 1;
    //       $player.css("top", newPos + "px");
    //     }
    //   }
    //   if (action=="down"){
    //     console.log (playerObject.originPos, playerObject.newPos)
    //     if (playerT%40==0){
    //       console.log("4C, removing newPos");
    //       playerObject.originPos.row = newPlayerR;
    //       playerObject.newPos = null;
    //     }
    //     if (playerR !== newPlayerR){
    //       // if newPos column is different, move left;
    //       var newPos = $player.position().top + 1;
    //       $player.css("top", newPos + "px");
    //     }
    //     if ((playerC !== newPlayerC) && (playerT%40!==4)){
    //       var newPos = $player.position().top - 1;
    //       $player.css("top", newPos + "px");
    //     }
    //   }
    // } else { //if newPos = false
    //   console.log("no newPos")
    //   if (action=="left"){
    //     console.log (playerObject.originPos, playerObject.newPos)
    //     console.log ((playerL), ((playerC * 40) + 40))
    //     //if player's left-most position is right of (col-1) right-most position
    //     if (((playerL)%40)!==0){
    //       console.log("1A, fully in Pos")
    //       var newPos = $player.position().left - 1;
    //       $player.css("left", newPos + "px");
    //     //if (col - 1) of player is NOT a rock,
    //     } else if (setup[playerR][playerC-1] !== "R"){
    //       console.log("1B, adding new Pos")
    //       var newPos = $player.position().left - 1;
    //       $player.css("left", newPos + "px");
    //       addNewPos(playerObject, (playerR), (playerC-1))
    //     }
    //   }
    //   if (action=="right"){
    //     console.log ((playerL+36), ((playerC * 40) + 40))
    //     console.log(playerObject.originPos, playerObject.newPos)
    //     //if player's right-most position is left of its right-most position
    //     if (((playerL+36)%40)!==0) {
    //       console.log("2A, fully in Pos")
    //       var newPos = $player.position().left + 1;
    //       $player.css("left", newPos + "px");
    //     //if (col + 1) of player is NOT a rock,
    //     } else if (setup[playerR][playerC+1] !== "R"){
    //       console.log("2B, adding new Pos")
    //       var newPos = $player.position().left + 1;
    //       $player.css("left", newPos + "px");
    //       addNewPos(playerObject, (playerR), (playerC+1))
    //     }
    //   }
    //   if (action=="up"){
    //     console.log(playerObject.originPos, playerObject.newPos)
    //     console.log ((playerT), ((playerC * 40) + 40))
    //     //if player's upper-most position is below the bottom of (row-1) cell position
    //     if (((playerT)%40)!==0){
    //       console.log("3A, fully in Pos")
    //       var newPos = $player.position().top - 1;
    //       $player.css("top", newPos + "px");
    //     //if (row - 1) of player is NOT a rock,
    //     } else if (setup[playerR-1][playerC] !== "R") {
    //       console.log("3B, adding new Pos")
    //       var newPos = $player.position().top - 1;
    //       $player.css("top", newPos + "px");
    //       addNewPos(playerObject, (playerR-1), playerC)
    //     }
    //   }
    //   if (action=="down"){
    //     console.log ((playerT+36), ((playerR * 40)+ 40))
    //     console.log(playerObject.originPos, playerObject.newPos)
    //     //if player's bottom-most position is above/equal to the bottom of its cell position
    //     if (((playerT+36)%40)!==0){
    //       console.log("4A, fully in Pos")
    //       var newPos = $player.position().top + 1;
    //       $player.css("top", newPos + "px");
    //     //if (row+1) of player is NOT a rock,
    //     } else if (setup[playerR+1][playerC] !== "R") {
    //       console.log("4B, adding new Pos")
    //       var newPos = $player.position().top + 1;
    //       $player.css("top", newPos + "px");
    //       addNewPos(playerObject, (playerR+1), playerC);
    //     }
    //   }
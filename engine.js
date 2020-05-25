// This module is the engine of the game that maintains its state

var ENGINE = {};

ENGINE.running = true;                 // is the game currently running
ENGINE.intervalID = -1;
ENGINE.intervalLength = 300;

ENGINE.board = [];                    // the static data block data saved to board

// each block has 4 pieces so store their coordinates separately - top left
// corner is 0,0: y index increases from L to R, x index increases from T to B
ENGINE.B1 = [-1, -1];
ENGINE.B2 = [-1, -1];
ENGINE.B3 = [-1, -1];
ENGINE.B4 = [-1, -1];
ENGINE.currentPieceIndex = -1;         // current piece's index in pieces array + 1
ENGINE.currentPieceRotationIndex = -1; // current piece's rotation status
ENGINE.currentPieceRotations = -1;     // array of current piece's possible rotations

ENGINE.falling = false;                // track if a piece is currently falling

ENGINE.moveRight = function() {
  if (ENGINE.board[ENGINE.B1[0]][ENGINE.B1[1] + 1] === 0 &&
      ENGINE.board[ENGINE.B2[0]][ENGINE.B2[1] + 1] === 0 &&
      ENGINE.board[ENGINE.B3[0]][ENGINE.B3[1] + 1] === 0 &&
      ENGINE.board[ENGINE.B4[0]][ENGINE.B4[1] + 1] === 0 &&
      ENGINE.B1[1] + 1 >= 0 && ENGINE.B2[1] + 1 >= 0 && ENGINE.B3[1] + 1 >= 0 &&
      ENGINE.B4[1] + 1 >= 0) {
    ENGINE.B1[1] += 1;
    ENGINE.B2[1] += 1;
    ENGINE.B3[1] += 1;
    ENGINE.B4[1] += 1;
    GRAPHICS.fillBoard(); // redraw
  }
};

ENGINE.moveLeft = function() {
  if (ENGINE.board[ENGINE.B1[0]][ENGINE.B1[1] - 1] === 0 &&
      ENGINE.board[ENGINE.B2[0]][ENGINE.B2[1] - 1] === 0 &&
      ENGINE.board[ENGINE.B3[0]][ENGINE.B3[1] - 1] === 0 &&
      ENGINE.board[ENGINE.B4[0]][ENGINE.B4[1] - 1] === 0 &&
      ENGINE.B1[1] - 1 >= 0 && ENGINE.B2[1] - 1 >= 0 && ENGINE.B3[1] - 1 >= 0 &&
      ENGINE.B4[1] - 1 >= 0) {
    ENGINE.B1[1] -= 1;
    ENGINE.B2[1] -= 1;
    ENGINE.B3[1] -= 1;
    ENGINE.B4[1] -= 1;
    GRAPHICS.fillBoard(); // redraw
  }
};

ENGINE.moveDown = function() {
  if (ENGINE.board[ENGINE.B1[0] + 1][ENGINE.B1[1]] === 0 &&
      ENGINE.board[ENGINE.B2[0] + 1][ENGINE.B2[1]] === 0 &&
      ENGINE.board[ENGINE.B3[0] + 1][ENGINE.B3[1]] === 0 &&
      ENGINE.board[ENGINE.B4[0] + 1][ENGINE.B4[1]] === 0 &&
      ENGINE.B1[0] + 1 <= CONFIG.numRows &&
      ENGINE.B2[0] + 1 <= CONFIG.numRows &&
      ENGINE.B3[0] + 1 <= CONFIG.numRows &&
      ENGINE.B4[0] + 1 <= CONFIG.numRows) {
    ENGINE.B1[0] += 1;
    ENGINE.B2[0] += 1;
    ENGINE.B3[0] += 1;
    ENGINE.B4[0] += 1;
    GRAPHICS.fillBoard(); // redraw
  }
};

ENGINE.rotate = function() {
  // increment current rotation to the next one
  ENGINE.currentPieceRotationIndex += 1;
  if (ENGINE.currentPieceRotationIndex >= ENGINE.currentPieceRotations.length) {
    ENGINE.currentPieceRotationIndex = 0;
  }
  var newRotation = ENGINE.currentPieceRotations[ENGINE.currentPieceRotationIndex];

  // rotate around leftmost, highest (rop row) block
  var highest_row = Math.min.apply(Math, [ENGINE.B1[0], ENGINE.B2[0],
                                          ENGINE.B3[0], ENGINE.B4[0]]);
  var leftmost_col = Math.min.apply(Math, [ENGINE.B1[1], ENGINE.B2[1],
                                           ENGINE.B3[1], ENGINE.B4[1]]);
  var res = ENGINE.buildPieceFromRowCol(highest_row, leftmost_col, newRotation);
  if (res) {
    GRAPHICS.fillBoard(); // redraw
  }
};

/**
 * Determine if the current piece has collided with another static piece or
 * reached the bottom of the board, which case the current piece is no longer
 * falling
 * */
ENGINE.detectCollision = function() {
  if (ENGINE.B1[0] + 1 >= CONFIG.numRows ||
      ENGINE.B2[0] + 1 >= CONFIG.numRows ||
      ENGINE.B3[0] + 1 >= CONFIG.numRows ||
      ENGINE.B4[0] + 1 >= CONFIG.numRows ||
      (ENGINE.board[ENGINE.B1[0] + 1][ENGINE.B1[1]] !== "undefined" &&
       ENGINE.board[ENGINE.B1[0] + 1][ENGINE.B1[1]] !== 0) ||
      (ENGINE.board[ENGINE.B2[0] + 1][ENGINE.B2[1]] !== "undefined" &&
       ENGINE.board[ENGINE.B2[0] + 1][ENGINE.B2[1]] !== 0) ||
      (ENGINE.board[ENGINE.B3[0] + 1][ENGINE.B3[1]] !== "undefined" &&
       ENGINE.board[ENGINE.B3[0] + 1][ENGINE.B3[1]] !== 0) ||
      (ENGINE.board[ENGINE.B4[0] + 1][ENGINE.B4[1]] !== "undefined" &&
       ENGINE.board[ENGINE.B4[0] + 1][ENGINE.B4[1]] !== 0)) {
    return true;
  } else {
    return false;
  }
};

/**
 * The heartbeat of the game engine which determines what to do at current
 * "tick" of the interval clock
 */
ENGINE.loop = function() {
  if (ENGINE.falling && ENGINE.lostGame()) {
    ENGINE.reset();
  } else if (ENGINE.falling) {
    if (ENGINE.detectCollision()) {
      console.log("collision");
      ENGINE.falling = false;
    } else {
      ENGINE.moveDown();  // piece moves down 1 square by default
    }
  } else if (!ENGINE.falling && ENGINE.currentPieceIndex !== -1) {
    // have piece that is no longer falling, save it/persist to board before
    // generating a new random piece
    ENGINE.saveCurrentPieceToBoard(ENGINE.currentPieceIndex);
  } else if (!ENGINE.falling && ENGINE.currentPieceIndex === -1) {
    // Generate a new piece to start falling
    console.log("Generating a new piece");
    ENGINE.clearRows();
    ENGINE.currentPieceIndex = PIECE.getRandomPieceIndex();
    var pieceRotations = PIECE.getPieceRotations(ENGINE.currentPieceIndex);
    ENGINE.currentPieceRotations = pieceRotations;
    ENGINE.currentPieceRotationIndex = Math.floor(Math.random() * (pieceRotations.length));
    var randomRotation = pieceRotations[ENGINE.currentPieceRotationIndex];
    var res = ENGINE.buildPieceFromRowCol(0, (CONFIG.numCols / 2) - 1, randomRotation);
    // if we failed to generate a new piece, game is over since existing pieces
    // stacked too high
    if (!res) {
      ENGINE.reset();
    }
    ENGINE.falling = true;
  }
  GRAPHICS.fillBoard(); // redraw
};


/**
 * save the current piece to the board
 */
ENGINE.saveCurrentPieceToBoard = function(piece_i) {
  ENGINE.board[ENGINE.B1[0]][ENGINE.B1[1]] = piece_i;
  ENGINE.board[ENGINE.B2[0]][ENGINE.B2[1]] = piece_i;
  ENGINE.board[ENGINE.B3[0]][ENGINE.B3[1]] = piece_i;
  ENGINE.board[ENGINE.B4[0]][ENGINE.B4[1]] = piece_i;
  // reset current piece data
  ENGINE.currentPieceIndex = -1;
  ENGINE.currentPieceRotationIndex = -1;
  ENGINE.currentPieceRotations = -1;
  ENGINE.B1 = [-1, -1];
  ENGINE.B2 = [-1, -1];
  ENGINE.B3 = [-1, -1];
  ENGINE.B4 = [-1, -1];
};

/**
 * Build a tetris piece rooted at row, col with shape derived from random
 * rotation nested arrays. Return true if successful rotation, false otherwise.
 * */
ENGINE.buildPieceFromRowCol = function(row, col, randomRotation) {
  var copyB1 = ENGINE.B1.slice(0);
  var copyB2 = ENGINE.B2.slice(0);
  var copyB3 = ENGINE.B3.slice(0);
  var copyB4 = ENGINE.B4.slice(0);
  var cur_r = row;
  var cur_c = col;
  var numSetBlocks = 1;
  for (var i = 0; i < randomRotation.length; i++) {
    for (var j = 0; j < randomRotation[i].length; j++) {
      if (randomRotation[i][j] !== "undefined" && randomRotation[i][j] !== 0) {
        if (numSetBlocks === 1) {
          ENGINE.B1[0] = cur_r;
          ENGINE.B1[1] = cur_c;
          numSetBlocks += 1;
        } else if (numSetBlocks === 2) {
          ENGINE.B2[0] = cur_r;
          ENGINE.B2[1] = cur_c;
          numSetBlocks += 1;
        } else if (numSetBlocks === 3) {
          ENGINE.B3[0] = cur_r;
          ENGINE.B3[1] = cur_c;
          numSetBlocks += 1;
        } else {
          ENGINE.B4[0] = cur_r;
          ENGINE.B4[1] = cur_c;
          numSetBlocks += 1;
        }
      }
      cur_c += 1;
    }
    cur_r += 1;
    cur_c = col;
  }
  // if the generated piece is valid
  if (ENGINE.B1[0] < CONFIG.numRows && ENGINE.B2[0] < CONFIG.numRows &&
      ENGINE.B3[0] < CONFIG.numRows && ENGINE.B4[0] < CONFIG.numRows &&
      ENGINE.B1[1] < CONFIG.numCols && ENGINE.B2[1] < CONFIG.numCols &&
      ENGINE.B3[1] < CONFIG.numCols && ENGINE.B4[1] < CONFIG.numCols &&
      ENGINE.board[ENGINE.B1[0]][ENGINE.B1[1]] === 0 &&
      ENGINE.board[ENGINE.B2[0]][ENGINE.B2[1]] === 0 &&
      ENGINE.board[ENGINE.B3[0]][ENGINE.B3[1]] === 0 &&
      ENGINE.board[ENGINE.B4[0]][ENGINE.B4[1]] === 0) {
    // console.log("Valid piece");
    return true;
  } else {
    ENGINE.B1 = copyB1;
    ENGINE.B2 = copyB2;
    ENGINE.B3 = copyB3;
    ENGINE.B4 = copyB4;
    // console.log("Invalid piece");
    return false;
  }
};

ENGINE.clearRows = function() {
  var lowestRowCleared = -1;  // 19 is the bottom row
  var highestRowCleared = -1; // 0 is the top row
  // iterate bottom up
  for (var i = CONFIG.numRows - 1; i >= 0; i--) {
    var completeRow = true;
    for (var j = 0; j < CONFIG.numCols; j++) {
      if (ENGINE.board[i][j] === 0) {
        completeRow = false;
      }
    }
    // if we found a complete row that must be cleared
    if (completeRow) {
      if (lowestRowCleared === -1) {
        lowestRowCleared = i;
      }
      highestRowCleared = i;
      // clear the row
      for (j = 0; j < CONFIG.numCols; j++) {
        ENGINE.board[i][j] = 0;
      }
    }
  }

  // if row(s) cleared
  if (lowestRowCleared !== -1) {
    var i;
    var j;
    // move all non-cleared rows above downwards
    for (i = highestRowCleared - 1; i >= 0; i--) {
      for (j = 0; j < CONFIG.numCols; j++) {
        ENGINE.board[i + lowestRowCleared - highestRowCleared + 1][j] =
          ENGINE.board[i][j];
        ENGINE.board[i][j] = 0;
      }
    }
  }
};

/**
 * Determine if the user lost
 * */
ENGINE.lostGame = function() {
  for (var i = 0; i < CONFIG.numCols; i++) {
    // the game is lost if any square in the top most row is occupied
    if (ENGINE.board[0][i] !== 0) {
      return true;
    }
  }
  return false;
};

/**
 * Reset the game state
 */
ENGINE.reset = function() {
  alert("You lost.");
  ENGINE.falling = false;
  ENGINE.currentPieceIndex = -1;
  ENGINE.currentPieceRotationIndex = -1;
  ENGINE.currentPieceRotations = -1;
  ENGINE.B1 = [-1, -1];
  ENGINE.B2 = [-1, -1];
  ENGINE.B3 = [-1, -1];
  ENGINE.B4 = [-1, -1];
  for (var i = 0; i < CONFIG.numRows; i++) {
    for (var j = 0; j < CONFIG.numCols; j++) {
      ENGINE.board[i][j] = 0;
    }
  }
}

ENGINE.init = function() {
  // Initialize the empty board: 0 means square is empty, positive integer means
  // square is occupied by static/fixed block of a particular piece represented
  // by integer
  for (var i = 0; i < CONFIG.numRows; i++) {
    var row = [];
    for (var j = 0; j < CONFIG.numCols; j++) {
      row.push(0);
    }
    ENGINE.board.push(row);
  }

  document.onkeydown = function(evt) {
    evt = evt || window.event;
    if (evt.keyCode === 39 && ENGINE.falling) {
      ENGINE.moveRight();
    } else if (evt.keyCode === 37 && ENGINE.falling) {
      ENGINE.moveLeft();
    } else if (evt.keyCode === 38 && ENGINE.falling) {
      ENGINE.rotate();
    } else if (evt.keyCode === 40 && ENGINE.falling) {
      ENGINE.moveDown();
    } else if (evt.keyCode === 84) {
      // t to toggle
      if (ENGINE.running) {
        window.clearInterval(ENGINE.intervalID);
        ENGINE.running = false;
      } else {
        ENGINE.running = true;
        ENGINE.intervalID = setInterval(ENGINE.loop, ENGINE.intervalLength);
      }
    }
  };

  GRAPHICS.drawGrid();
  ENGINE.intervalID = setInterval(ENGINE.loop, ENGINE.intervalLength);
};

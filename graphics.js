Array.prototype.compare = function(testArr) {
  if (this.length !== testArr.length) {
    return false;
  }
  for (var i = 0; i < testArr.length; i++) {
    if (this[i].compare) {
      if (!this[i].compare(testArr[i])) {
        return false;
      }
    }
    if (this[i] !== testArr[i]) {
      return false;
    }
  }
  return true;
};

var GRAPHICS = {};

GRAPHICS.drawGrid = function() {
  var ctx = document.getElementById('tetris_canvas').getContext('2d');
  ctx.strokeStyle = "#FFF";

  // draw vertical lines
  for(var i = 1; i < CONFIG.numCols; i++) {
    ctx.beginPath();
    ctx.moveTo(i * CONFIG.squareWidth, 0);
    ctx.lineTo(i * CONFIG.squareWidth, 750);
    ctx.stroke();
  }

  // draw horizontal lines
  for(i = 1; i < CONFIG.numRows; i++) {
    ctx.beginPath();
    ctx.moveTo(0, i * CONFIG.squareWidth);
    ctx.lineTo(CONFIG.width, i * CONFIG.squareWidth);
    ctx.stroke();
  }
};

/**
 * Note that in the board[][] 2D array and piece abstraction, X index refers to
 * row/subarray and Y index refers to index within subarray/column. However, on
 * the canvas X index increases from L to R and Y index increases from T to B.
 * So we have to convert our abstract coordinates to that of the canvas by
 * making our row/X index correspond to canvas' y index and our col/Y index
 * correspond to canvas' x index.
 * */
GRAPHICS.fillBoard = function() {
  for (var i = 0; i < CONFIG.numRows; i++) {
    for (var j = 0; j < CONFIG.numCols; j++) {
      var ctx = document.getElementById('tetris_canvas').getContext('2d');
      if (ENGINE.B1.compare([i, j]) || ENGINE.B2.compare([i, j]) ||
          ENGINE.B3.compare([i, j]) || ENGINE.B4.compare([i, j])) {
        // a portion of current piece occupies this square on the grid/board
        ctx.fillStyle = PIECE.colors[ENGINE.currentPieceIndex];
        ctx.fillRect(j * CONFIG.squareWidth + 1, i * CONFIG.squareWidth + 1,
                     CONFIG.squareWidth - 3, CONFIG.squareWidth - 3);
      } else if (ENGINE.board[i][j] !== 0) {
        // a static block occupies this square
        ctx.fillStyle = PIECE.colors[ENGINE.board[i][j]];
        ctx.fillRect(j * CONFIG.squareWidth + 1, i * CONFIG.squareWidth + 1,
                     CONFIG.squareWidth - 3, CONFIG.squareWidth - 3);
      } else if (ENGINE.board[i][j] === 0) {
        // this square is empty
        ctx.fillStyle = "rgb(0,0,0)";
        ctx.fillRect(j * CONFIG.squareWidth + 1, i * CONFIG.squareWidth + 1,
                     CONFIG.squareWidth - 3, CONFIG.squareWidth - 3);
      }
    }
  }
};

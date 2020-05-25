var MAIN = {};

MAIN.main = function() {
  var canvas = document.getElementById('tetris_canvas');
  canvas.width = CONFIG.width;
  canvas.height = CONFIG.height;
  var game = new ENGINE.init();
};

// this will be run when the whole page is loaded
window.onload = function() {
  MAIN.main();
};

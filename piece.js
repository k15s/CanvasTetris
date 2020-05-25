var PIECE = {};

PIECE.pieces = [
  // square rotations
  [
    [
      [1, 1],
      [1, 1]
    ]
  ],
  // long rotations
  [
    [
      [2],
      [2],
      [2],
      [2],
    ],
    [
      [2, 2, 2, 2]
    ]
  ],
  // T rotations
  [
    [
      [0, 3, 0],
      [3, 3, 3]
    ],
    [
      [3, 0],
      [3, 3],
      [3, 0]
    ],
    [
      [3, 3, 3],
      [0, 3, 0]
    ],
    [
      [0, 3],
      [3, 3],
      [0, 3]
    ]
  ],
  // squiggle1 rotations
  [
    [
      [0, 4, 4],
      [4, 4, 0]
    ],
    [
      [4, 0],
      [4, 4],
      [0, 4]
    ]
  ],
  // squiggle2 rotations
  [
    [
      [5, 5, 0],
      [0, 5, 5]
    ],
    [
      [0, 5],
      [5, 5],
      [5, 0]
    ]
  ],
  // L1 rotations
  [
    [
      [6, 6, 6],
      [6, 0, 0]
    ],
    [
      [6, 6],
      [0, 6],
      [0, 6]
    ],
    [
      [0, 0, 6],
      [6, 6, 6]
    ],
    [
      [6, 0],
      [6, 0],
      [6, 6]
    ]
  ],
  // L2 rotations
  [
    [
      [7, 0, 0],
      [7, 7, 7]
    ],
    [
      [7, 7],
      [7, 0],
      [7, 0]
    ],
    [
      [7, 7, 7],
      [0, 0, 7]
    ],
    [
      [0, 7],
      [0, 7],
      [7, 7]
    ]
  ],
];

// Dictionary
PIECE.colors = {
  1: "#00F", // square
  2: "#F0F", // long
  3: "#FF0", // T
  4: "#0F0", // squiggle1
  5: "#50F", // squiggle2
  6: "#C50", // L1
  7: "#F00"  // L2
};

PIECE.getRandomPieceIndex = function() {
  var min = 1;
  var max = PIECE.pieces.length;
  return Math.floor(Math.random() * (max - min)) + min;
};

PIECE.getPieceRotations = function(index) {
  return PIECE.pieces[index];
};

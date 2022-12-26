const SHAPES = [
  [
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
  ],
  [
    [0, 1, 0],
    [0, 1, 0],
    [1, 1, 0],
  ],
  [
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 1],
  ],
  [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],
  [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
  ],
  [
    [1, 1, 1],
    [0, 1, 0],
    [0, 0, 0],
  ],
  [
    [1, 1],
    [1, 1],
  ],
];

const COLORS = [
  "#fff",
  "#9b5fe0",
  "#16a4d8",
  "#60dbe8",
  "#8bd346",
  "#efdf48",
  "#f9a52c",
  "#d64e12",
];

const ROWS = 20;
const COLUMNS = 10;

let score = 0;
let level = 1;
let speed = 1000;

let scoreboard = document.getElementById("scoreboard");

const canvas = document.getElementById("tetris");
let ctx = canvas.getContext("2d"); //Context is like marker for canvas board
ctx.scale(30, 30);

let grid = generateGrid();
let tetrominoObj = null;
// let tetrominoObj = generateRandomTetromino();
// renderTetromino();

setInterval(gameNewState, speed);

function gameNewState() {
  checkGrid();
  if (tetrominoObj == null) {
    tetrominoObj = generateRandomTetromino();
    renderTetromino();
  }
  moveDown();
}

function generateGrid() {
  let grid = [];
  for (let m = 0; m < ROWS; m++) {
    grid.push([]);
    for (let n = 0; n < COLUMNS; n++) {
      grid[m].push(0);
    }
  }
  return grid;
}

function renderGrid() {
  for (let a = 0; a < grid.length; a++) {
    for (let b = 0; b < grid[a].length; b++) {
      ctx.fillStyle = COLORS[grid[a][b]];
      ctx.fillRect(b, a, 1, 1);
    }
  }
  renderTetromino();
}

function checkGrid() {
  let count = 0;
  for (let i = 0; i < grid.length; i++) {
    let lineCompleted = true;
    for (j = 0; j < grid[i].length; j++) {
      if (grid[i][j] == 0) {
        lineCompleted = false;
      }
    }
    if (lineCompleted) {
      count++;
      grid.splice(i, 1);
      grid.unshift([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    }
  }
  if (count == 1) {
    score += 10;
  } else if (count == 2) {
    score += 30;
  } else if (count == 3) {
    score += 50;
  } else if (count > 3) {
    score += 100;
  }

  if (score >= 100) {
    alert("Level " + level + " Completed");
    grid = generateGrid();
    score = 0;
    level++;
    speed = speed - 900;
  }
  scoreboard.innerHTML = "Score: " + score + " Level: " + level;
}

function generateRandomTetromino() {
  let randomIndex = Math.floor(Math.random() * SHAPES.length);
  let colorIndex = randomIndex + 1;
  let tetromino = SHAPES[randomIndex];
  let x_coord = 4;
  let y_coord = -1;
  return { tetromino, colorIndex, x_coord, y_coord };
}

function renderTetromino() {
  let tetromino = tetrominoObj.tetromino;

  for (let i = 0; i < tetromino.length; i++) {
    for (let j = 0; j < tetromino[i].length; j++) {
      if (tetromino[i][j] == 1) {
        ctx.fillStyle = COLORS[tetrominoObj.colorIndex];
        ctx.fillRect(tetrominoObj.x_coord + j, tetrominoObj.y_coord + i, 1, 1);
      }
    }
  }
}

function collision(x, y, rotatedTetromino) {
  let tetromino = rotatedTetromino || tetrominoObj.tetromino;

  for (let i = 0; i < tetromino.length; i++) {
    for (let j = 0; j < tetromino[i].length; j++) {
      if (tetromino[i][j] == 1) {
        let p = x + j;
        let q = y + i;
        if (p >= 0 && p < COLUMNS && q >= 0 && q < ROWS) {
          if (grid[q][p] > 0) {
            return true;
          }
        } else {
          return true;
        }
      }
    }
  }
  return false;
}

function moveDown() {
  if (!collision(tetrominoObj.x_coord, tetrominoObj.y_coord + 1)) {
    tetrominoObj.y_coord += 1;
  } else {
    for (let i = 0; i < tetrominoObj.tetromino.length; i++) {
      for (let j = 0; j < tetrominoObj.tetromino[i].length; j++) {
        if (tetrominoObj.tetromino[i][j] == 1) {
          let p = tetrominoObj.x_coord + j;
          let q = tetrominoObj.y_coord + i;
          grid[q][p] = tetrominoObj.colorIndex;
        }
      }
    }
    if (tetrominoObj.y_coord == 0) {
      alert("Game Over");
      grid = generateGrid();
      score = 0;
    }
    tetrominoObj = null;
  }
  renderGrid();
}

function moveLeft() {
  if (!collision(tetrominoObj.x_coord - 1, tetrominoObj.y_coord)) {
    tetrominoObj.x_coord -= 1;
  }
  renderGrid();
}

function moveRight() {
  if (!collision(tetrominoObj.x_coord + 1, tetrominoObj.y_coord)) {
    tetrominoObj.x_coord += 1;
  }
  renderGrid();
}

function rotate() {
  let rotatedTetromino = [];
  let tetromino = tetrominoObj.tetromino;

  for (let i = 0; i < tetromino.length; i++) {
    rotatedTetromino.push([]);
    for (let j = 0; j < tetromino[i].length; j++) {
      rotatedTetromino[i].push(0);
    }
  }
  //Transpose of matrix
  for (let i = 0; i < tetromino.length; i++) {
    for (let j = 0; j < tetromino[i].length; j++) {
      rotatedTetromino[i][j] = tetromino[j][i];
    }
  }
  for (let i = 0; i < tetromino.length; i++) {
    rotatedTetromino[i] = rotatedTetromino[i].reverse();
  }
  if (
    !collision(tetrominoObj.x_coord, tetrominoObj.y_coord, rotatedTetromino)
  ) {
    tetrominoObj.tetromino = rotatedTetromino;
    renderGrid();
  }
}

document.getElementById("up").addEventListener("click", keyCheck);
document.getElementById("left").addEventListener("click", keyCheck);
document.getElementById("down").addEventListener("click", keyCheck);
document.getElementById("right").addEventListener("click", keyCheck);
document.addEventListener("keydown", keyCheck);
function keyCheck(e) {
  let key = e.key;
  let id = e.target.id;
  if (key == "ArrowDown" || id == "down") {
    moveDown();
  } else if (key == "ArrowLeft" || id == "left") {
    moveLeft();
  } else if (key == "ArrowRight" || id == "right") {
    moveRight();
  } else if (key == "ArrowUp" || id == "up") {
    rotate();
  }
}

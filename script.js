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

const canvas = document.getElementById("tetris");
let ctx = canvas.getContext("2d"); //Context is like marker for canvas board
ctx.scale(30, 30);

let grid = generateGrid();
let tetrominoObj = generateRandomTetromino();
renderTetromino();
setInterval(moveDown, 500);


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

function generateRandomTetromino() {
  let randomIndex = Math.floor(Math.random() * SHAPES.length);
  let colorIndex = randomIndex + 1;
  let tetromino = SHAPES[randomIndex];
  let x_coord = 4;
  let y_coord = 0;
  return { tetromino, colorIndex, x_coord, y_coord };
}

// let tetrominoObj = null;

// setInterval(gameNewState, 500);

// function gameNewState(){
//     if(tetrominoObj == null){
//         tetrominoObj=generateRandomTetromino();
//         renderTetromino();
//     }
//     moveDown();
// }

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

function collision(x, y) {
  let tetromino = tetrominoObj.tetromino;

  for (let i = 0; i < tetromino.length; i++) {
    for (let j = 0; j < tetromino[i].length; j++) {
      if (tetromino[i][j] == 1) {
        let p = x+j;
        let q= y+i;
        if(p>=0 && p<COLUMNS && q>=0 && q<ROWS){

        }else{
            return true
        }
      }
    }
  }
  return false;
}

function moveDown() {
  tetrominoObj.y_coord += 1;
  renderGrid();
}

function moveLeft(){
    if(!collision(tetrominoObj.x_coord-1,tetrominoObj.y_coord)){
        tetrominoObj.x_coord-=1;
    }
    renderGrid();
}

function moveRight(){
    if (!collision(tetrominoObj.x_coord + 1, tetrominoObj.y_coord)) {
      tetrominoObj.x_coord += 1;
    }
    renderGrid();
}

document.getElementById("up").addEventListener("click",keyCheck)
document.getElementById("left").addEventListener("click",keyCheck)
document.getElementById("down").addEventListener("click",keyCheck)
document.getElementById("right").addEventListener("click",keyCheck)
document.addEventListener("keydown", keyCheck)
function keyCheck (e) {
  let key = e.key;
  let id = e.target.id;
  if ((key == "ArrowDown") || (id == "down")) {
    moveDown();
  } else if ((key == "ArrowLeft") || (id =="left")) {
    moveLeft();
  } else if (key == "ArrowRight" || (id == "right")) {
    moveRight();
  } else if (key == "ArrowUp" || (id == "up")) {
    rotate();
  }
};

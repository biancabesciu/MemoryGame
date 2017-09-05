// creating face-down tiles
//define the Tile constructor function
function Tile(x, y) {
    this.x = x;
    this.y = y;
    this.width = 70;
}

//create tiles at appropiate x and y positions
let tiles = [];
const numCols = 5;
const numRows = 4;

for (let i = 0; i < NUM_COLS; i++) {
    for (let j = 0; j < NUM_ROWS; j++) {
        tiles.push(new Tile(i * 78 + 10, j * 78 + 40));
    }
}


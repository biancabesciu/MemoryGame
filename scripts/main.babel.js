/*GAME PLAY:
 // The game consists of an even number of tiles with images on one side and a generic back. Each image appears on precisely two tiles.
 // When the game starts, all tiles are turned face down.
 // The player then flips over two cards, selecting them by clicking on them. If the two tiles have the same image, they remain face up. Otherwise, the tiles flip back over after a small period of time.
 // The goal of the game is to get all the tiles flipped face up (i.e., find all the matching image pairs) in the least number of tries. That means that lower number of tries are better scores.
 */

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

for (let i = 0; i < numCols; i++) {
    for (let j = 0; j < numRows; j++) {
        tiles.push(new Tile(i * 78 + 10, j * 78 + 40));
    }
}

//draw tiles face down
Tile.prototype.drawFaceDown = function () {
    fill(214, 247, 202);
    strokeWeight(2);
    rect(this.x, this.y, this.width, this.width, 10);
};


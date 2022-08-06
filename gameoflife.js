/*

MIT License

Copyright  ©  2022 death-magnet

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.


*/

let displayWidth = 1280;
let windowWidth = 208;
let windowHeight = 117;
let cellWidth = displayWidth / windowWidth; //(Math.floor(windowWidth / cellDivisor));
let cellHeight = cellWidth;
let phi = (1 + Math.sqrt(5)) / 2;
let seedNum = Math.floor(getRndInteger(1, 999999999999) * phi);
document.getElementById("p1").innerHTML = seedNum;
function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}
let input = prompt("Enter a number greater than zero", seedNum);
input = input.replace(/\D/g,'');
input = input.substring(0, 15);
if (input > 0) {
    seedNum = input;
    document.getElementById("p1").innerHTML = seedNum;
}
else {
    alert("You were supposed to enter a non zero number! I will select a random one for you.");
    seedNum = (getRndInteger(1, 999999999999) * phi);
    document.getElementById("p1").innerHTML = seedNum;
}
let aliveNow = 0;
class Cell
      {
          static width = cellWidth;
          static height = cellHeight;

          constructor (context, gridX, gridY, aliveNow)
          {
              this.context = context;

              // Store the position of this cell in the grid
              this.gridX = gridX;
              this.gridY = gridY;

              // Make random cells alive
              this.alive = aliveNow;//Math.random() > 0.4;
          }

          draw() {
              // Draw a simple square
              this.context.fillStyle = this.alive?'#00CCCC':'#303030';
              this.context.fillRect(this.gridX * Cell.width, this.gridY * Cell.height, Cell.width -1, Cell.height -1);
          }
      }

      class GameWorld {

          static numColumns = windowWidth;
          static numRows = windowHeight;

          constructor(canvasId) {
              this.canvas = document.getElementById(canvasId);
              this.context = this.canvas.getContext('2d');
              this.gameObjects = [];

              this.createGrid();

              // Request an animation frame for the first time
              // The gameLoop() function will be called as a callback of this request

              //if (!((((seedNum % (x + y)) * ((seedNum / x) ^ (seedNum / y)))) * 1.618033988749895))
              //if (!((((seedNum % (x + y)) * ((seedNum / x) ^ (seedNum / y)))) / 1.618033988749895))
              window.requestAnimationFrame(() => this.gameLoop());
          }
//(seedNum % Math.floor(((Math.abs(y - Math.floor(windowHeight / 2)) ^ Math.abs(x - Math.floor(windowWidth / 2))) + cellHeight) * 1.618033988749895) ^ cellHeight)
          createGrid()
          {
              for (let y = 0; y < GameWorld.numRows; y++) {
                  for (let x = 0; x < GameWorld.numColumns; x++) {
                      if (!(seedNum % Math.floor(Math.sqrt(Math.abs(x - Math.floor(windowWidth / 2)) ^ Math.abs(y - Math.floor(windowHeight / 2) + 1) * Math.floor(Math.PI / 1.618033988749895))))) {
                          aliveNow = 1;
                      }
                      else {
                          aliveNow = 0;
                      }
                      this.gameObjects.push(new Cell(this.context, x, y, aliveNow));
                      //console.log(x + " " + y);
                  }
              }
          }

          isAlive(x, y)
          {
              if (x < 0 || x >= GameWorld.numColumns || y < 0 || y >= GameWorld.numRows){
                  return false;
              }

              return this.gameObjects[this.gridToIndex(x, y)].alive?1:0;
          }

          gridToIndex(x, y){
              return x + (y * GameWorld.numColumns);
          }

          checkSurrounding ()
          {
              // Loop over all cells
              for (let x = 0; x < GameWorld.numColumns; x++) {
                  for (let y = 0; y < GameWorld.numRows; y++) {

                      // Count the nearby population
                      let numAlive = this.isAlive(x - 1, y - 1) + this.isAlive(x, y - 1) + this.isAlive(x + 1, y - 1) + this.isAlive(x - 1, y) + this.isAlive(x + 1, y) + this.isAlive(x - 1, y + 1) + this.isAlive(x, y + 1) + this.isAlive(x + 1, y + 1);
                      let centerIndex = this.gridToIndex(x, y);

                      if (numAlive == 2){
                          // Do nothing
                          this.gameObjects[centerIndex].nextAlive = this.gameObjects[centerIndex].alive;
                      }else if (numAlive == 3){
                          // Make alive
                          this.gameObjects[centerIndex].nextAlive = true;
                      }else{
                          // Make dead
                          this.gameObjects[centerIndex].nextAlive = false;
                      }
                  }
              }

              // Apply the new state to the cells
              for (let i = 0; i < this.gameObjects.length; i++) {
                  this.gameObjects[i].alive = this.gameObjects[i].nextAlive;
              }
          }

          gameLoop() {
              // Check the surrounding of each cell
              this.checkSurrounding();

              // Clear the screen
              this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

              // Draw all the gameobjects
              for (let i = 0; i < this.gameObjects.length; i++) {
                  this.gameObjects[i].draw();
              }

              // The loop function has reached it's end, keep requesting new frames
              setTimeout( () => {
                  window.requestAnimationFrame(() => this.gameLoop());
              }, 66.666666666667)
          }
      }

      window.onload = () => {
        // The page has loaded, start the game
        let gameWorld = new GameWorld('canvas');
      }

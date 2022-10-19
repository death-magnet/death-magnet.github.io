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
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d', { alpha: false })
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const windowWidth = Math.floor(canvas.width * 0.1);
const windowHeight = Math.floor(canvas.height * 0.1);

const cellWidth = canvas.width / windowWidth; 
const cellHeight = cellWidth;

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
            this.canvas = canvas;
            this.context = ctx;
              this.gameObjects = [];

            this.createGrid();
            
              window.requestAnimationFrame(() => this.gameLoop());
          }
          createGrid()
          {
              for (let y = 0; y < GameWorld.numRows; y++) {
                  for (let x = 0; x < GameWorld.numColumns; x++) {
                      if (Math.floor(Math.random() > 0.42)) {
                          aliveNow = 1;
                      }
                      else {
                          aliveNow = 0;
                      }
                      this.gameObjects.push(new Cell(this.context, x, y, aliveNow));
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
                      if (numAlive === 2){
                          // Do nothing
                          this.gameObjects[centerIndex].nextAlive = this.gameObjects[centerIndex].alive;
                      }else if (numAlive === 3){
                          // Make alive
                          this.gameObjects[centerIndex].nextAlive = true;
                      }else{
                          // Make dead
                          this.gameObjects[centerIndex].nextAlive = false;
                      }
                  }
              }

              // Apply the new state to the cells

              this.gameObjects.forEach(cell => cell.alive = cell.nextAlive);
          }

          gameLoop() {
              // Check the surrounding of each cell
              this.checkSurrounding();

              // Clear the screen
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            //draw the next frame
            this.gameObjects.forEach(cell => cell.draw());
              // The loop function has reached it's end, keep requesting new frames
            setTimeout(() => {
              window.requestAnimationFrame(() => this.gameLoop());
            }, 87);
          }
      }

      window.onload = () => {
        // The page has loaded, start the game
        let gameWorld = new GameWorld(canvas);
      }

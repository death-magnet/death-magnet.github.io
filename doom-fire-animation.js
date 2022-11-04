const HTML_COLOR_SCALE = [
  parseColor(0x070707), parseColor(0x1f0707), parseColor(0x2f0f07),
  parseColor(0x470f07), parseColor(0x571707), parseColor(0x671f07),
  parseColor(0x771f07), parseColor(0x8f2707), parseColor(0x9f2f07),
  parseColor(0xaf3f07), parseColor(0xbf4707), parseColor(0xc74707),
  parseColor(0xDF4F07), parseColor(0xDF5707), parseColor(0xDF5707),
  parseColor(0xD75F07), parseColor(0xD7670F), parseColor(0xcf6f0f),
  parseColor(0xcf770f), parseColor(0xcf7f0f), parseColor(0xCF8717),
  parseColor(0xC78717), parseColor(0xC78F17), parseColor(0xC7971F),
  parseColor(0xBF9F1F), parseColor(0xBF9F1F), parseColor(0xBFA727),
  parseColor(0xBFA727), parseColor(0xBFAF2F), parseColor(0xB7AF2F),
  parseColor(0xB7B72F), parseColor(0xB7B737), parseColor(0xCFCF6F),
  parseColor(0xDFDF9F), parseColor(0xEFEFC7), parseColor(0xFFFFFF)   
];
const UPDATE_INTERVAL = 1000 / 24; // DoomFire runs at 24FPS.
export default class DoomFireAnimation {
  constructor(parent, canvas) {
    this.canvas = canvas;
    this.parent = parent;
    this.flames = [];
    this.width = 426;
    this.height = 240;
    this.ctx = canvas.getContext('2d');
    this.imageData = this.ctx.getImageData(0, 0, this.width, this.height);    
    this._init();
    this.lastUpdate = 0;
    this.active = true;
  }

  posAt(x, y) {
    return y * this.width + x;
  }
    
  setValue(x, y, value) {
    let pos = this.posAt(x, y);
    this.flames[pos] = value; 
  }

  valueAt(x, y) {
    let pos = this.posAt(x, y);
    return this.flames[pos];
  }  

  _init() {
    this._initCanvas();
    this._initFlames();
  }

  _initFlames() {
    // Initialise the flames.
    for (let x = 0; x < this.width; x++) {
      for (let y = 1; y < this.height; y++) {
        this.setValue(x, y, 0);
      }
    }

    for (let x = 0; x < this.width; x++) {
      this.setValue(x, 0, 35);      
    }
  }
  _initCanvas() {
    // Initialise the canvas with black.
    for (let i = 0; i < this.imageData.data.length; i++) {
      this.imageData.data[i] = 0;
      if (i % 4 == 3) this.imageData.data[i] = 255;
    }
  }

  start() {
    requestAnimationFrame(this._update.bind(this));
  }

  _update() {
    let now = performance.now();
    if (now - this.lastUpdate < UPDATE_INTERVAL) {
      this.parent.requestAnimationFrame(this._update.bind(this));
      return;
    }

    for (let srcY = 0; srcY < this.height; srcY++) {
      const srcRow = srcY * this.width;
      const dstRow = (srcY + 1) * this.width;
      const imageRow = (this.height - srcY) * this.width;
      for (let srcX = 0; srcX < this.width; srcX++) {      
        const rand = Math.round(Math.random() * 3.0);
  
        const srcIndex = srcRow + srcX;
        const srcColor = this.flames[srcIndex];
        const dstColor = srcColor - (rand & 1);
  
        const dstX = srcX + rand - 1;
          
        const index = dstRow + dstX;
        this.flames[index] = dstColor; 
  
        const pos = (imageRow + srcX) * 4;  
        if (srcColor > 0) {
          const color = HTML_COLOR_SCALE[srcColor];
          this.imageData.data[pos] = color.r;
          this.imageData.data[pos + 1] = color.g;
          this.imageData.data[pos + 2] = color.b;
          this.imageData.data[pos + 3] = 255;
        } else {
          this.imageData.data[pos] = 0;
          this.imageData.data[pos + 1] = 0;
          this.imageData.data[pos + 2] = 0;
          this.imageData.data[pos + 3] = 255;        
        }
      }
    }
    this.ctx.putImageData(this.imageData, 0, 0);  
    this.lastUpdate = now;
    this.parent.requestAnimationFrame(this._update.bind(this));
  }

  toggle() {
    if (this.active) {
      for (let x = 0; x < this.width; x++) {
        this.setValue(x, 0, 0);      
      }    
    } else {
      for (let x = 0; x < this.width; x++) {
        this.setValue(x, 0, 35);      
      }    
    }
    this.active = !this.active;    
  }  
}

function parseColor(color) {
  const b = color & 0xFF;
  const g = color >> 8 & 0xFF;
  const r = color >> 16 & 0xFF;
  return {r, g, b}
}

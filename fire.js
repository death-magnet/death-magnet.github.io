//based on code from https://bandarra.me/2021/01/13/Building-Doom-Fire-using-modern-JavaScript/

const canvasWidth = Math.round(window.innerWidth * 0.28);
const canvasHeight = Math.round(window.innerHeight * 0.20);


//original color palette - set height above to 0.14

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

//new color palette - set height above to 0.20, width to 0.28
const HTML_COLOR_SCALE2 = [
  parseColor(0x070707), parseColor(0x110707), parseColor(0x1f0707),
  parseColor(0x260a07), parseColor(0x2f0f07), parseColor(0x390f07),
  parseColor(0x470f07), parseColor(0x4e1207), parseColor(0x571707),
  parseColor(0x5e1a07), parseColor(0x671f07), parseColor(0x6e1f07),
  parseColor(0x771f07), parseColor(0x812207), parseColor(0x8f2707),
  parseColor(0x962a07), parseColor(0x9f2f07), parseColor(0xa63607),
  parseColor(0xaf3f07), parseColor(0xb64207), parseColor(0xbf4707),
  parseColor(0xc24707), parseColor(0xc74707), parseColor(0xd14a07),
  parseColor(0xdf4f07), parseColor(0xdf5207), parseColor(0xdf5707),
  parseColor(0xdf5707), parseColor(0xdc5a07), parseColor(0xd75f07),
  parseColor(0xd7620a), parseColor(0xd7670f), parseColor(0xd46a0f),
  parseColor(0xcf6f0f), parseColor(0xcf720f), parseColor(0xcf770f),
  parseColor(0xcf7a0f), parseColor(0xcf7f0f), parseColor(0xcf8212),
  parseColor(0xcf8717), parseColor(0xcc8717), parseColor(0xc78717),
  parseColor(0xc78a17), parseColor(0xc78f17), parseColor(0xc7921a),
  parseColor(0xc7971f), parseColor(0xc49a1f), parseColor(0xbf9f1f),
  parseColor(0xbf9f1f), parseColor(0xbfa222), parseColor(0xbfa727),
  parseColor(0xbfa727), parseColor(0xbfaa2a), parseColor(0xbfaf2f),
  parseColor(0xbcb22f), parseColor(0xb7b72f), parseColor(0xb7b732),
  parseColor(0xb7b737), parseColor(0xc1c14e), parseColor(0xcfcf6f),
  parseColor(0xd6d683), parseColor(0xdfdf9f), parseColor(0xe6e6b0),
  parseColor(0xefefc7), parseColor(0xf6f6de), parseColor(0xffffff)
];

//use this to change color palette
const colors = HTML_COLOR_SCALE2;


const UPDATE_INTERVAL = 1000 / 24; // FirePlace runs at 24FPS.
class FirePlaceAnimation 
{
  constructor(parent, canvas) 
  {
    this.canvas = canvas;
    this.parent = parent;
    this.flames = [];
    this.width = canvasWidth;
    this.height = canvasHeight;
    this.ctx = canvas.getContext('2d');
    this.imageData = this.ctx.getImageData(0, 0, this.width, this.height);    
    this._init();
    this.lastUpdate = 0;
  }

  posAt(x, y) 
  {
    return y * this.width + x;
  }
    
  setValue(x, y, value) 
  {
    let pos = this.posAt(x, y);
    this.flames[pos] = value; 
  }

  valueAt(x, y) 
  {
    let pos = this.posAt(x, y);
    return this.flames[pos];
  }  

  _init() 
  {
    this._initCanvas();
    this._initFlames();
  }

  _initFlames() 
  {
    // Initialise the flames.
    for (let x = 0; x < this.width; x++) 
    {
      for (let y = 1; y < this.height; y++) 
      {
        this.setValue(x, y, 0);
      }
    }

    for (let x = 0; x < this.width * 2; x++) 
    {
      this.setValue(x, 0, colors.length -1);      
    }
  }
  _initCanvas() 
  {
    // Initialise the canvas with black.
    for (let i = 0; i < this.imageData.data.length; i++) 
    {
      this.imageData.data[i] = 0;
      if (i % 4 == 3) this.imageData.data[i] = 255;
    }
  }

  start() 
  {
    requestAnimationFrame(this._update.bind(this));
  }

  _update() 
  {
    let now = performance.now();
    if (now - this.lastUpdate < UPDATE_INTERVAL) 
    {
      this.parent.requestAnimationFrame(this._update.bind(this));
      return;
    }

    for (let srcY = 0; srcY < this.height; srcY++) 
    {
      const srcRow = srcY * this.width;
      const dstRow = (srcY + 1) * this.width;
      const imageRow = (this.height - srcY) * this.width;
      for (let srcX = 0; srcX < this.width; srcX++) 
      {      
        const rand = Math.round(Math.random() * 3);
  
        const srcIndex = srcRow + srcX;
        const srcColor = this.flames[srcIndex];
        const dstColor = srcColor - (rand & 1);
  
        const dstX = srcX + rand - 1;
          
        const index = dstRow + dstX;
        this.flames[index] = dstColor; 
  
        const pos = (imageRow + srcX) * 4;  
        if (srcColor > 0) 
        {
          const color = colors[srcColor];
          this.imageData.data[pos] = color.r;
          this.imageData.data[pos + 1] = color.g;
          this.imageData.data[pos + 2] = color.b;
          this.imageData.data[pos + 3] = 255;
        } 
        else 
        {
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
}

function parseColor(color) 
{
  const b = color & 0xFF;
  const g = color >> 8 & 0xFF;
  const r = color >> 16 & 0xFF;
  return {r, g, b}
}


class FirePlace extends HTMLElement 
{
  constructor() 
  {
    super();

    // Create a Canvas to draw the flames.
    this.canvas = document.createElement('canvas');

    // Set size.
    this.canvas.width = canvasWidth;
    this.canvas.height = canvasHeight;

    //tiny margin to allow for scrolling - this lets me hide the url bar on mobile firefox.
    this.canvas.style.width = '99vw';
    this.canvas.style.height = '99vh';

    // Make the rendering pixelated, for a retro effect,
    this.canvas.style.imageRendering = 'pixelated';

    this.animation = new FirePlaceAnimation(window, this.canvas);
    
    //not quite sure what this next bit does, but it is absolutely essential.
    const shadowRoot = this.attachShadow({mode: 'open'});
    shadowRoot.appendChild(this.canvas);
  }

  connectedCallback() 
  {
    this.animation.start();
  }
}

if (!customElements.get('fire-place')) 
{
  customElements.define('fire-place', FirePlace);
}
const audio = document.createElement('audio');

if (audio.canPlayType('audio/mpeg')) 
{
  audio.setAttribute('src','fire-1.mp3');
  audio.setAttribute("preload", "auto", "loop");
  audio.autobuffer = true;
  audio.load();
}

audio.play();


//this audio clip does not loop seamlessly. so a tiny hack to make it a little more seamless. Stop the audio before the end, start it again after the start to skip the fade in / fade out.
setInterval(function()
{
  if(audio.currentTime > 58)
  {
    audio.currentTime = 1;
    audio.play();
  }
}, 100);

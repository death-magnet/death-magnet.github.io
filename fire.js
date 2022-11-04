
import DoomFireAnimation from './doom-fire-animation.js';

let canvasWidth = 426;
let canvasHeight = 240;

export default class DoomFire extends HTMLElement {
  constructor() {
    super();
    this.active = true;

    // Create a Canvas to draw the flames.
    this.canvas = document.createElement('canvas');

    // Set size.
    this.canvas.width = canvasWidth;
    this.canvas.height = canvasHeight;

    // Make it fill the whole element.
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';

    // Make the rendering pixelated, for a retro effect,
    this.canvas.style.imageRendering = 'pixelated';

    console.log('Rendering with regular Canvas.');
    this.animation = new DoomFireAnimation(window, this.canvas);
    

    const shadowRoot = this.attachShadow({mode: 'open'});
    shadowRoot.appendChild(this.canvas);
     
    this.addEventListener('click', () => {
      this.toggle();
    });
  }

  connectedCallback() {
    this.animation.start();
  }  

  toggle() {
    this.animation.toggle();   
  }
}

if (!customElements.get('doom-fire')) {
  customElements.define('doom-fire', DoomFire);
}
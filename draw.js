window.addEventListener('load', function () {
  const canvas = document.getElementById('canvas1');
  const ctx = canvas.getContext('2d');
  // could be 3d, if you want to make a video game
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  let brushSize = 10;
  ctx.lineWidth = brushSize;
  ctx.strokeStyle = '#ac0000';

  let isDrawing = false;
  let lastX = 0;
  let lastY = 0;
  let colorInput = document.querySelector('#color');

    const slider_brushSize = document.getElementById('brushSize');
    const label_brushSize = document.querySelector('[for="brushSize"]');
  function draw(e) {
    // stop the function if they are not mouse down
    if (!isDrawing) return;
    //listen for mouse move event
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    if (e.offsetX == undefined) {
      ctx.lineTo(e.changedTouches[e.changedTouches.length - 1].pageX, e.changedTouches[e.changedTouches.length - 1].pageY);
      ctx.stroke();[lastX, lastY] = [e.changedTouches[e.changedTouches.length - 1].pageX, e.changedTouches[e.changedTouches.length - 1].pageY];
    }
    else {
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
      [lastX, lastY] = [e.offsetX, e.offsetY];
    }
  }

  canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
  });

  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', () => isDrawing = false);
  canvas.addEventListener('mouseout', () => isDrawing = false);
  canvas.addEventListener('touchstart', (e) => {
    isDrawing = true;
    [lastX, lastY] = [e.changedTouches[e.changedTouches.length-1].pageX, e.changedTouches[e.changedTouches.length-1].pageY,];
  });

  canvas.addEventListener('touchmove', draw);
  canvas.addEventListener('touchend', () => isDrawing = false);
  canvas.addEventListener('touchleave', () => isDrawing = false);
  
    slider_brushSize.addEventListener('change', function (e)
    { 
        brushSize = e.target.value;
        ctx.lineWidth = brushSize;

        updateSliders();
    });
    colorInput.addEventListener('input', () =>{
    let color = colorInput.value;
    // document.body.style.backgroundColor = color;
    ctx.strokeStyle = color;
});
    function updateSliders()
    { 
        slider_brushSize.value = brushSize;
        label_brushSize.innerText = 'Size: ' + Number(brushSize);
    }
    updateSliders();
});

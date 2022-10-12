window.addEventListener('load', function () {
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d',  { alpha: false });
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    function randomNumber(min, max) { 
    return Math.random() * (max - min) + min;
    }
    
    ctx.fillStyle = 'black';
    var value = randomNumber(180,250) | 0;
    var grayscale = (value << 16) | (value << 8) | value;
    var color = '#' + grayscale.toString(16);
    ctx.strokeStyle = color;
    ctx.lineWidth = Math.round(randomNumber(4, 16));
    ctx.lineCap = randomNumber(0, 1) ? 'round' : 'square';
    ctx.shadowColor = 'rgba(0,0,0,0.7)';
    ctx.shadowOffsetX = 10;
    ctx.shadowOffsetY = 5;
    ctx.shadowBlur = 10;

    let size = canvas.width < canvas.height ? canvas.width * 0.24 : canvas.height * 0.24;
    let sides = Math.round(randomNumber(3, 9));
    let maxLevel = Math.round(randomNumber(2, 4));
    let scale = randomNumber(0.3, 0.6);
    let spread = randomNumber(0.4, 2.5);
    let branches = Math.floor(randomNumber(1, 4));
    //controls
    const reloadButton = document.getElementById('reloadButton');
    const slider_spread = document.getElementById('spread');
    const label_spread = document.querySelector('[for="spread"]');
    const slider_sides = document.getElementById('sides');
    const label_sides = document.querySelector('[for="sides"]');
    const slider_branches = document.getElementById('branches');
    const label_branches = document.querySelector('[for="branches"]');
    const slider_lineWidth = document.getElementById('lineWidth');
    const label_lineWidth = document.querySelector('[for="lineWidth"]');
    const slider_lineScale = document.getElementById('lineScale');
    const label_lineScale = document.querySelector('[for="lineScale"]');


    slider_spread.addEventListener('change', function (e)
    { 
        spread = e.target.value;
        drawFractal();

        updateSliders();
    });
    slider_sides.addEventListener('change', function (r)
    { 
        sides = r.target.value;
        drawFractal();

        updateSliders();
    });
    slider_branches.addEventListener('change', function (q)
    { 
        branches = q.target.value;
        drawFractal();

        updateSliders();
    });
    slider_lineWidth.addEventListener('change', function (t)
    { 
        ctx.lineWidth = t.target.value;
        drawFractal();

        updateSliders();
    });
    slider_lineScale.addEventListener('change', function (h)
    { 
        scale = h.target.value;
        drawFractal();

        updateSliders();
    });

    function drawBranch(level)
    {
        if (level > maxLevel) return;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(size, 0);
        ctx.stroke();

        for (let i = 0; i < branches; i++)
        {
            ctx.save();
            ctx.translate(size - (size / branches) * i - branches, 0);
            ctx.rotate(spread);
            ctx.scale(scale, scale);
            drawBranch(level + 1);
            ctx.restore();

            ctx.save();
            ctx.translate(size - (size / branches) * i - branches, 0);
            ctx.rotate(-spread);
            ctx.scale(scale, scale);
            drawBranch(level + 1);
            ctx.restore();
        }
    }

    function drawFractal()
    { 
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.translate(canvas.width * 0.5, canvas.height * 0.5);
        for (let i = 0; i < sides; i++)
        {
            ctx.rotate((Math.PI * 2) / sides);

            drawBranch(0);
        }
        ctx.restore();
    }
    function updateSliders()
    { 
        slider_spread.value = spread;
        slider_branches.value = branches;
        slider_sides.value = sides;
        slider_lineWidth.value = ctx.lineWidth;
        slider_lineScale.value = scale;
        label_spread.innerText = 'Spread: ' + Number(spread).toFixed(1);
        label_branches.innerText = 'Branches: ' + branches;
        label_sides.innerText = 'Sides: ' + sides;
        label_lineWidth.innerText = 'Width: ' + ctx.lineWidth;
        label_lineScale.innerText = 'Scale: ' + Number(scale).toFixed(2);
    }
    function randomizeFractal()
    {
        size = canvas.width < canvas.height ? canvas.width * 0.24 : canvas.height * 0.24;
        sides = Math.round(randomNumber(3, 9));
        maxLevel = Math.round(randomNumber(2, 4));
        scale = randomNumber(0.3, 0.6);
        spread = randomNumber(0.4, 1.2);
        branches = Math.floor(randomNumber(1, 4));
        ctx.lineWidth = Math.round(randomNumber(4, 16));
        ctx.lineCap = randomNumber(0, 1) ? 'round' : 'square';
    }
    reloadButton.addEventListener('click', function ()
    { 
        randomizeFractal();
        drawFractal();
        updateSliders();
    });

    drawFractal();
    updateSliders();
});

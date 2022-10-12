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
    ctx.lineWidth = randomNumber(8, 20);
    ctx.lineCap = randomNumber(0, 1) ? 'round' : 'square';
    ctx.shadowColor = 'rgba(0,0,0,0.7)';
    ctx.shadowOffsetX = 10;
    ctx.shadowOffsetY = 5;
    ctx.shadowBlur = 10;

    let size = canvas.width < canvas.height ? canvas.width * 0.24 : canvas.height * 0.24;
    let sides = Math.round(randomNumber(3, 9));
    let maxLevel = Math.round(randomNumber(2, 4));
    let scale = randomNumber(0.3, 0.6);
    let spread = randomNumber(0.4, 1.2);
    let branches = randomNumber(1, 4);
   

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
            ctx.translate(size - (size / branches) * i + 1, 0);
            ctx.rotate(spread);
            ctx.scale(scale, scale);
            drawBranch(level + 1);
            ctx.restore();

            ctx.save();
            ctx.translate(size - (size / branches) * i + 1, 0);
            ctx.rotate(-spread);
            ctx.scale(scale, scale);
            drawBranch(level + 1);
            ctx.restore();
        }
    }

    function drawFractal()
    { 
        ctx.save();
        ctx.translate(canvas.width * 0.5, canvas.height * 0.5);
        for (let i = 0; i < sides; i++)
        {
            ctx.rotate((Math.PI * 2) / sides);

            drawBranch(0);
        }
        ctx.restore();
    }
    drawFractal();
});

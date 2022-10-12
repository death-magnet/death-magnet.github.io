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
    ctx.lineWidth = '16';
    ctx.lineCap = 'round';

    let size = canvas.height * 0.27;
    let sides = randomNumber(3, 11);
    let maxLevel = randomNumber(2, 4);
    let scale = 0.4;
    let spread = randomNumber(0.4, 1.3);
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
            ctx.translate(size - (size / branches) * i, 0);
            ctx.rotate(spread);
            ctx.scale(scale, scale);
            drawBranch(level + 1);
            ctx.restore();

            ctx.save();
            ctx.translate(size - (size / branches) * i, 0);
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
        ctx.scale(1, 1);
        ctx.rotate(0);
        for (let i = 0; i < sides; i++)
        {
            ctx.rotate((Math.PI * 2) / sides);

            drawBranch(0);
        }
        ctx.restore();
    }
    drawFractal();
});

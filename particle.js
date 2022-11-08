//based on ideas from https://www.playfuljs.com/particle-effects-are-easy/

window.addEventListener('load', function () 
{   
    const DAMPING = 0.996;
    const display = document.getElementById('canvas1');
    const ctx = display.getContext('2d');
    const width = display.width = window.innerWidth;
    const height = display.height = window.innerHeight;
    const numParticles = Math.floor(display.width < display.height ? display.height * 1.3 : display.width * 1.3);

    let clicked = false;
    let touch = false;
    let particles = [];
    let nameCount = 0;

    var mouse = { x: width * 0.5, y: height * 0.5 };

    class Particle
    {
        constructor(x, y) 
        {

            this.x = this.oldX = x;
            this.y = this.oldY = y;
            this.size = Math.floor(display.width < display.height ? display.width * 0.0032 : display.height * 0.0032);
            this.color = '#00a3a3';
            this.rect = {
                x : this.x,
                y : this.y,
                width : this.size,
                height : this.size,
                speedX : 0,
                speedY : 0,
                size : this.size,
                color : this.color,
                name : nameCount++
            };

        }

        attract(x, y)
        {
            let dx = x - this.rect.x;
            let dy = y - this.rect.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            this.rect.x += dx / distance;
            this.rect.y += dy / distance;
        }

        update()
        {

            this.rect.speedX = (this.rect.x - this.oldX);
            this.rect.speedY = (this.rect.y - this.oldY);
            this.oldX = this.rect.x;
            this.oldY = this.rect.y;
            if(this.rect.x < 0 || this.rect.x > display.width)
            {
                this.rect.speedX *= -1 * DAMPING * 0.9;
                this.rect.speedY *= DAMPING * 0.9;
            }
            if(this.rect.y < 0 || this.rect.y > display.height)
            {
                this.rect.speedX *= DAMPING * 0.9;
                this.rect.speedY *= -1 * DAMPING * 0.9;
            }
            this.rect.x += this.rect.speedX * DAMPING;
            this.rect.y += this.rect.speedY * DAMPING;
        }
        draw()
        {
            ctx.strokeStyle = '#00a3a3';
            ctx.lineWidth = this.rect.size;
            ctx.beginPath();
            ctx.moveTo(this.oldX, this.oldY);
            ctx.lineTo(this.rect.x, this.rect.y);
            ctx.stroke();
            /*
            if(this.rect.isColliding)
            {
                this.rect.color = '#ffffff';
            }
            else
            {
                this.rect.color = '#00a3a3';
            }
            ctx.fillStyle = this.rect.color;
            ctx.fillRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
            */
        }

    }


    for (var i = 0; i < numParticles; i++) 
    {
        particles[i] = new Particle(Math.random() * width, Math.random() * height);
    }

    display.addEventListener('mousemove', (e) =>
    {
        if(clicked)
        {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        }
    });

    display.addEventListener('touchmove', (e) =>
    {
        mouse.x = e.changedTouches[0].clientX;
        mouse.y = e.changedTouches[0].clientY;
    });

    display.addEventListener('mousedown', handleClick);
    display.addEventListener('mouseup', handleClick);

    function handleClick(e)
    {
        clicked = !clicked;
        if(!touch)
        {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        }
        //console.log(e.touches[0].clientX);
    }
    
    requestAnimationFrame(animate);

    function animate() 
    {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(particle =>
        {
            particle.update();
            particle.attract(mouse.x, mouse.y);
            particle.draw();
        });
        window.requestAnimationFrame(animate);
        /*setTimeout(() =>
        {
            window.requestAnimationFrame(animate);
        }, 16.66666666667);*/
    }
   
});

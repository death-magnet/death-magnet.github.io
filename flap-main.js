window.addEventListener('load', function () 
{
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.setScaledFont = function() {
        var f = 0.35, s = this.offsetWidth, fs = s * f;
        this.style.fontSize = fs + '%';
        return this
    }
    document.body.setScaledFont();

    let flapping = false;
    let angle = 0;
    let frame = 0;
    let lastTree = 50;
    let score = 0;
    let gamespeed = 2;
    let birdX = canvas.width * 0.1;
    let birdY = canvas.height * 0.8;
    const smokeArray = [];
    const treesArray = [];
    
    function randomNumber(min, max) 
    { 
        return Math.random() * (max - min) + min;
    } 
    
    class Bird
    {
        constructor()
        {
            this.x = birdX;
            this.y = birdY;
            this.vx = 0;
            this.vy = 0;
            this.width = 20;
            this.height = 20;
            this.weight = 1;
        }

        update()
        {
            //move the bird a little bit
            let curve = Math.sin(angle) * 10;

            //keep bird within screen boundary
            if(this.y > canvas.height - this.height + curve)
            {
                //do stuff
                this.y = canvas.height - this.height + curve;
                this.vy = 0;
            }

            else if(this.y < 0)
            {
                this.y = 0;
                this.vy = 0;
            }

            else
            {
                //this adds a downward force
                this.vy += this.weight;
                this.vy *= 0.93;
                this.y += this.vy;
            }
            if(flapping)
            {
                this.flap();
            }
        }

        draw()
        {
            ctx.fillStyle = 'black';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }

        flap()
        {
            this.vy -= 2;
        }
    }

    class Particle
    {
        constructor()
        {
            this.x = bird.x - (bird.width * 0.1);
            this.y = bird.y + Math.random() * bird.height;
            this.size = randomNumber(bird.height * 0.1 , bird.height * 0.8);
            this.speedY = Math.random() - 0.5;
            this.color = 'rgba(255, 255, 255, 0.1)';
        }

        update()
        {
            this.x -= gamespeed;
            this.y += this.speedY;
        }

        draw()
        {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    class Tree
    {
        constructor()
        {
            this.top = (Math.random() * canvas.height * 0.37) + 20;
            this.bottom = (Math.random() * canvas.height * 0.37) + 20;
            this.x = canvas.width;
            this.width = 20;
            this.color = 'rgb(128, 128, 128)';
            this.counted = false;
        }

        draw()
        {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, 0, this.width, this.top);
            ctx.fillRect(this.x, canvas.height - this.bottom, this.width, this.bottom);
        }

        update()
        {
            this.x -= gamespeed;
            if(!this.counted && this.x < bird.x)
            {
                score++;
                this.counted = true;
            }
            this.draw();
        }
        
    }

    function doTrees()
    {
        let interval = Math.floor(randomNumber(100, 150));
        if(frame % interval === 0 && lastTree >= 100)
        {
            treesArray.unshift(new Tree);
            lastTree = 0;
        }

        for(let k = 0; k < treesArray.length; k++)
        {
            treesArray[k].update();
        }

        if(treesArray.length > 20)
        {
            treesArray.pop(treesArray[0]);
        }
    }

    function doParticles()
    {
        //particle stuff
        smokeArray.unshift(new Particle);
        smokeArray.unshift(new Particle);
        for(let i = 0; i < smokeArray.length; i++)
        {
            smokeArray[i].update();
            smokeArray[i].draw();
        }

        //keep particles at a reasonable amount

        if(smokeArray.length > 140)
        {
            for(let j = 0; j < 20; j++)
            {
                smokeArray.pop(smokeArray[j]);
            }
        }
    }

    function doCollisions()
    {
        for (let m = 0; m < treesArray.length; m++)
        {
            if(bird.x < treesArray[m].x + treesArray[m].width && bird.x + bird.width > treesArray[m].x && ((bird.y < 0 + treesArray[m].top && bird.y > 0) || (bird.y > canvas.height - treesArray[m].bottom && bird.y + bird.height < canvas.height)))
            {
                //a collision has occurred

                ctx.font = "60% Arial";
                ctx.fillStyle = 'red';
                ctx.fillText("BANG!", bird.x, bird.y);
                return true;
            }
        }
    }

    const bird = new Bird();

    function animate() 
    {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        //window.requestAnimationFrame(animate);
        bird.update();
        bird.draw();
        doParticles();
        doTrees();
        angle += 0.12;
        frame++;
        lastTree++;
        ctx.fillStyle = 'red';
        ctx.font = "90% Arial";
        ctx.strokeText(score, canvas.width * 0.90, canvas.height * 0.1);
        ctx.fillText(score, canvas.width * 0.90, canvas.height * 0.1);
        if(doCollisions())
        {

            ctx.font = "120% Arial";
            ctx.fillStyle = 'red';
            ctx.fillText("GAME OVER! Score: " + score, canvas.width * 0.2, canvas.height * 0.5);
            setTimeout(() =>
        {
            window.location.reload();
        }, 5000);
        }
        else
        {
            setTimeout(() =>
            {
                window.requestAnimationFrame(animate);
            }, 16.66666666667);
        }
    }

    animate();
    
    window.addEventListener('mousedown', event => { 
        //do stuff
        if(event.button === 0)
        {
            //do stuff
            flapping = true;
        }
    });
    window.addEventListener('touchstart', event => {
        //do stuff
        flapping = true;;
    });
    window.addEventListener('keydown', event => { 
        //do stuff
        if(event.code === 'Space')
        {
            //do stuff
            flapping = true;
        }
    });
    window.addEventListener('mouseup', event => {
        if(event.button === 0)
        {
            //do stuff
            flapping = false;
        }
    });
    window.addEventListener('touchend', event => { 
        //do stuff
        flapping = false;
    });
    window.addEventListener('keyup', event => {
        //do stuff
        if(event.code === 'Space')
        {
            //do stuff
            flapping = false;
        }
    });
});

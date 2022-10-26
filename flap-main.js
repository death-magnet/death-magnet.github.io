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
    const flapspeed = 0.7;
    const weight = 1;
    let birdX = canvas.width * 0.1;
    let birdY = canvas.height * 0.8;
    let time = new Date().getTime();
    let previous_time = 0;
    let dt = 0;
    let target_fps = 60;
    const smokeArray = [];
    const treesArray = [];
    const background = new Image();
    background.src = "./images/parallax-mountain-bg.png";
    const farMountains = new Image();
    farMountains.src = "./images/parallax-mountain-montain-far.png";
    const nearMountains = new Image();
    nearMountains.src = "./images/parallax-mountain-mountains.png";
    const treesFar = new Image();
    treesFar.src = "./images/parallax-mountain-trees.png";
    const treesMid = new Image();
    treesMid.src = "./images/parallax-mountain-trees.png";
    const treesNear = new Image();
    treesNear.src = "./images/parallax-mountain-foreground-trees.png";
    const BG = {
        x1: 0,
        x2: canvas.width,
        y: 0,
        width: canvas.width,
        height: canvas.height,
        image: background
    }
    const FM = {
        x1: 0,
        x2: canvas.width,
        y: 0,
        width: canvas.width,
        height: canvas.height,
        image: farMountains
    }
    const NM = {
        x1: 0,
        x2: canvas.width,
        y: 0,
        width: canvas.width,
        height: canvas.height,
        image: nearMountains
    }
    const TF = {
        x1: 0,
        x2: canvas.width,
        y: 0,
        width: canvas.width,
        height: canvas.height,
        image: treesFar
    }
    const TM = {
        x1: 0,
        x2: canvas.width,
        y: 0,
        width: canvas.width,
        height: canvas.height,
        image: treesMid
    }
    const TN = {
        x1: 0,
        x2: canvas.width,
        y: 0,
        width: canvas.width,
        height: canvas.height,
        image: treesNear
    }
    function handleBackground()
    {
        if(FM.x1 <= -FM.width + gamespeed * 0.1)
        {
            FM.x1 = FM.width;
        }
        else
        {
            FM.x1 -= gamespeed * 0.1;
        }
        if(NM.x1 <= -NM.width + gamespeed * 0.2)
        {
            NM.x1 = NM.width;
        }
        else
        {
            NM.x1 -= gamespeed * 0.2;
        }
        if(TF.x1 <= -TF.width + gamespeed * 0.4)
        {
            TF.x1 = TF.width;
        }
        else
        {
            TF.x1 -= gamespeed * 0.4;
        }
        if(TM.x1 <= -TM.width + gamespeed * 0.8)
        {
            TM.x1 = TM.width;
        }
        else
        {
            TM.x1 -= gamespeed * 0.8;
        }
        if(TN.x1 <= -TN.width + gamespeed * 1.2)
        {
            TN.x1 = TN.width;
        }
        else
        {
            TN.x1 -= gamespeed * 1.2;
        }
        
        
        if(FM.x2 <= -FM.width + gamespeed * 0.1)
        {
            FM.x2 = FM.width;
        }
        else
        {
            FM.x2 -= gamespeed * 0.1;
        }
        if(NM.x2 <= -NM.width + gamespeed * 0.2)
        {
            NM.x2 = NM.width;
        }
        else
        {
            NM.x2 -= gamespeed * 0.2;
        }
        if(TF.x2 <= -TF.width + gamespeed * 0.4)
        {
            TF.x2 = TF.width;
        }
        else
        {
            TF.x2 -= gamespeed * 0.4;
        }
        if(TM.x2 <= -TM.width + gamespeed * 0.8)
        {
            TM.x2 = TM.width;
        }
        else
        {
            TM.x2 -= gamespeed * 0.8;
        }
        if(TN.x2 <= -TN.width + gamespeed * 1.2)
        {
            TN.x2 = TN.width;
        }
        else
        {
            TN.x2 -= gamespeed * 1.2;
        }
        
        ctx.drawImage(BG.image, BG.x1, BG.y, BG.width, BG.height);
        ctx.drawImage(FM.image, FM.x1, FM.y, FM.width, FM.height);
        ctx.drawImage(FM.image, FM.x2, FM.y, FM.width, FM.height);
        ctx.drawImage(NM.image, NM.x1, NM.y, NM.width, NM.height);
        ctx.drawImage(NM.image, NM.x2, NM.y, NM.width, NM.height);
        ctx.drawImage(TF.image, TF.x1, TF.y, TF.width, TF.height);
        ctx.drawImage(TF.image, TF.x2, TF.y, TF.width, TF.height);
        ctx.drawImage(TM.image, TM.x1, TM.y, TM.width, TM.height);
        ctx.drawImage(TM.image, TM.x2, TM.y, TM.width, TM.height);
        ctx.drawImage(TN.image, TN.x1, TN.y, TN.width, TN.height);
        ctx.drawImage(TN.image, TN.x2, TN.y, TN.width, TN.height);

    }
    
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
            this.width = Math.floor(canvas.width < canvas.height ? canvas.width * 0.025 : canvas.height * 0.025);
            this.height = this.width;
            this.weight = weight;
        }

        update()
        {
            //move the bird a little bit
            let curve = Math.sin(angle) * 10 * dt * target_fps;

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
                this.vy *= 0.9;
                this.y += this.vy * dt * target_fps;
            }
            if(flapping)
            {
                this.flap();
            }
        }

        draw()
        {
            ctx.fillStyle = 'green';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }

        flap()
        {
            this.vy -= flapspeed * dt * target_fps;
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
            this.x -= gamespeed * dt * target_fps;
            this.y += this.speedY * dt * target_fps;
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
            this.top = (Math.random() * canvas.height * 0.4) + 20;
            this.bottom = (Math.random() * canvas.height * 0.4) + 20;
            this.x = canvas.width;
            this.width = bird.width;
            this.color = 'rgb(0, 163, 163)';
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
            this.x -= gamespeed * dt * target_fps;
            if(!this.counted && this.x < bird.x)
            {
                score++;
                this.counted = true;
                if(score % 20 === 0)
                    gamespeed += 1;
            }
            this.draw();
        }
        
    }

    function doTrees()
    {
        let interval = Math.floor(randomNumber(50, 120));
        if(frame % interval === 0 && lastTree >= 50)
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
        handleBackground();
        time = new Date().getTime();
        dt = (time - previous_time) * 0.001;
        previous_time = time;
        doParticles();
        doTrees();
        bird.update();
        bird.draw();
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
            window.requestAnimationFrame(animate);
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

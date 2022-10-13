window.addEventListener('load', function () {
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d', { alpha: false });
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.fillStyle = 'teal';
    const numBlobs = Math.floor(canvas.width < canvas.height ? canvas.width * 0.5 : canvas.height * 0.5);
    var dt;
    var target_fps = 60;
    let lastTick = performance.now();
    var nowish;
    class Ball {
        //ball stuff
        constructor(effect) {
            this.effect = effect;
            this.x = this.effect.width * 0.5;
            this.y = this.effect.height * 0.5;
            this.radius = Math.random() * 50 + 30;
            this.speedX = Math.random() * 2 - 1;
            this.speedY = 0;
            this.gravity = 0.05;
            this.gravitySpeed = 0;
            this.offset = 3;

        }
        accelerate(newSpeed) {
        
            this.gravity += newSpeed;
        }
        update(dt) {


            if (this.x < this.radius || this.x > this.effect.width - this.radius) this.speedX *= -1;
            //if (this.y < this.radius * 0.5 || this.y > this.effect.height - this.radius / 2) this.speedY *= -1;
            if (this.y > this.effect.height - this.radius)
                this.y = this.effect.height - this.radius * 0.3;
            if (this.y < this.radius)
                this.y = this.radius;

            this.gravitySpeed += this.gravity;
            this.x += this.speedX;// * dt * target_fps * 0.0005
            this.y += this.gravitySpeed * 0.35; //* dt * target_fps * 0.0005;
            if (this.y - this.radius > this.effect.height - this.radius) {
                this.accelerate(-0.005);
                if (this.gravity < 0)
                    this.radius = Math.random() * 50 + 30;
            }
            if (this.y < this.radius) {
                this.accelerate(0.0005);
            }
            if (this.gravitySpeed > this.radius * 2)
                this.gravitySpeed = this.radius * 2;
            if (this.gravitySpeed < -this.radius * 2)
                this.gravitySpeed = -this.radius * 2;
            //console.log("Speed: " + this.speedY + " Gravity: " + this.gravitySpeed.toFixed(4) + " Y pos: " + this.y.toFixed(2) + " Window height " + this.effect.height + " Radius: " + this.radius.toFixed(2));

        }
        
        draw(context) {
            context.beginPath();
            context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            context.fill();
        }
    }

    class MetaballsEffect {
        //effect stuff
        constructor(width, height) {
            this.width = width;
            this.height = height;
            this.metaballsArray = [];
            
        }
        
        init(numberOfBalls) {
            // init stuff
            for (let i = 0; i < numberOfBalls; i++) {
                this.metaballsArray.push(new Ball(this));
            }
        }
        
        update(dt) {
            //update stuff
            this.metaballsArray.forEach(metaball => metaball.update(dt));

        }
        
        draw(context) {
            //draw stuff
            this.metaballsArray.forEach(metaball => metaball.draw(context));
        }

    }


    const effect = new MetaballsEffect(canvas.width, canvas.height);
    effect.init(numBlobs);

    function animate() {
        //animate stuff
        nowish = performance.now();
        dt = nowish - lastTick;
        lastTick = nowish;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        effect.update(dt);
        effect.draw(ctx);
        
        window.requestAnimationFrame(animate);
    }

    animate();
});

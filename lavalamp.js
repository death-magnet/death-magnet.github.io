window.addEventListener('load', function () {
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.fillStyle = 'teal';
    const numBlobs = Math.floor(canvas.width < canvas.height ? canvas.width * 0.13 : canvas.height * 0.13);
    function randomNumber(min, max) { 
    return Math.random() * (max - min) + min;
    } 
    class Ball {
        //ball stuff
        constructor(effect) {
            this.effect = effect;
            this.x = this.effect.width * 0.5;
            this.y = this.effect.height * 0.5;
            this.radius = Math.random() * Math.floor(canvas.width < canvas.height ? canvas.width * 0.1 : canvas.height * 0.1) + 30;
            this.speedX = Math.random() * 2 - 1;
            this.speedY = 0.1;
            this.gravity = 0.05;
            this.gravitySpeed = 0;
            this.offset = 2.4;
        }
        
        accelerate(newSpeed) {
            this.gravity += newSpeed;
        }

        update() {
            if (this.x < this.radius || this.x > this.effect.width - this.radius) this.speedX *= -1;
            //if (this.y < this.radius * 0.5 || this.y > this.effect.height - this.radius / 2) this.speedY *= -1;
            if (this.y > this.effect.height - this.radius)
                this.y = this.effect.height - this.radius * 0.3;
            if (this.y < this.radius)
                this.y = this.radius;

            this.gravitySpeed += this.speedY + this.gravity;
            this.x += this.speedX;
            this.y += this.gravitySpeed * 0.35;
            if (this.y - this.radius > this.effect.height - this.radius) {
                this.accelerate(randomNumber(-0.0001, -0.04)) ;
                if (this.gravity < 0)
                    this.radius = Math.random() * Math.floor(canvas.width < canvas.height ? canvas.width * 0.1 : canvas.height * 0.1) + 30;
            }
            if (this.y < this.radius) {
                this.accelerate(randomNumber(0.000001, 0.02));
            }
            if (this.gravitySpeed > this.radius * this.offset)
                this.gravitySpeed = this.radius * this.offset;
            if (this.gravitySpeed < -this.radius * this.offset)
                this.gravitySpeed = -this.radius * this.offset;
            if (this.y < this.effect.height - (this.radius * this.offset) && this.y > (this.radius * this.offset) && this.gravitySpeed < 0)
                this.gravitySpeed = -this.radius * 0.1;
        }
        
        draw(context) {
            context.beginPath();
            context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            context.fill();
        }
    }

    class MetaballsEffect {
        constructor(width, height) {
            this.width = width;
            this.height = height;
            this.metaballsArray = [];
        }
        
        init(numberOfBalls) {
            for (let i = 0; i < numberOfBalls; i++) {
                this.metaballsArray.push(new Ball(this));
            }
        }
        
        update() {
            this.metaballsArray.forEach(metaball => metaball.update());
        }
        
        draw(context) {
            this.metaballsArray.forEach(metaball => metaball.draw(context));
        }
    }

    const effect = new MetaballsEffect(canvas.width, canvas.height);
    effect.init(numBlobs);

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        effect.update();
        effect.draw(ctx);
        window.requestAnimationFrame(animate);
    }
    animate();
});

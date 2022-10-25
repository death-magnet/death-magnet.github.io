window.addEventListener('load', function () 
{
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.fillStyle = 'teal';
    const numBlobs = Math.floor(canvas.width < canvas.height ? canvas.width * 0.1 : canvas.height * 0.1);
    let ballName = 0;
    function randomNumber(min, max) 
    { 
    return Math.random() * (max - min) + min;
    } 
    class Ball 
    {
        //ball stuff
        constructor(effect) 
        {
            ballName ++;
            this.effect = effect;
            this.x = Math.random() * this.effect.width;
            this.y = this.effect.height * 0.5;
            this.radius = Math.random() * Math.floor(canvas.width < canvas.height ? canvas.width * 0.1 : canvas.height * 0.1) + 70;
            this.speedX = Math.random() * 2 - 1;
            this.speedY = 0.1;
            this.gravity = 0.01;
            this.gravitySpeed = 0;
            this.offset = 2.4;
            this.ballName = ballName;
            this.isColliding = false;
        }
        
        accelerate(newSpeed) 
        {
            this.gravity += newSpeed * 0.01;
        }

        update() 
        {
            if (this.x < this.radius || this.x > this.effect.width - this.radius) this.speedX *= -1;
            //if (this.y < this.radius * 0.5 || this.y > this.effect.height - this.radius / 2) this.speedY *= -1;
            if (this.y > this.effect.height - this.radius)
                this.y = this.effect.height - this.radius * 0.3;
            if (this.y < this.radius)
                this.y = this.radius;

            this.gravitySpeed += this.speedY + this.gravity;
            this.x += this.speedX;
            this.y += this.gravitySpeed * 0.35;

            // blobs go up
            if (this.y - this.radius >= this.effect.height - this.radius) 
            {
                this.accelerate(randomNumber(-0.00000001, -0.0001)) ;
                if (this.gravity < 0)
                    this.radius = Math.random() * Math.floor(canvas.width < canvas.height ? canvas.width * 0.1 : canvas.height * 0.1) + 70;
            }

            //blobs go down
            if (this.y <= this.radius) 
            {
                this.accelerate(randomNumber(0.001, 0.01));
            }
            //catch offscreen blobs
            if (this.y > this.effect.height + this.radius)
            {
                this.speedY *= -1;
            }
            if ( this.y < 0 - this.radius)
            {
                this.speedY *= -1;
            }
            /*sometimes ^ that doesn't work so... I hope this will catch way offscreen blobs*/
            if (this.y > this.effect.height + (this.radius * this.offset))
            {
                this.y = this.effect.height + this.radius;
                this.gravitySpeed = 0;
            }

            if (this.y < 0 - (this.radius * this.offset))
            {
                this.y = 0 - this.radius;
                this.gravitySpeed = 0;
            }
            //slow blobs going up, but less than those going down.
            if (this.y < this.effect.height - (this.radius * this.offset) && this.y > (this.radius * this.offset) && this.gravitySpeed < 0)
            {
                this.gravitySpeed = -(this.radius + Math.random()) * 0.07;
            }

            //slow blobs going down
            if (this.y < this.effect.height - (this.radius * this.offset) && this.y > (this.radius * this.offset) && this.gravitySpeed > 0)
            {
                this.gravitySpeed = (this.radius + Math.random()) * 0.05;
            }   
            //console.log("Ball: " + this.ballName + " y pos: " + this.y + " speed: " + this.gravitySpeed);
        }
        
        draw(context) 
        {
            context.beginPath();
            context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            context.fill();
        }
    }

    class MetaballsEffect 
    {
        constructor(width, height) 
        {
            this.width = width;
            this.height = height;
            this.metaballsArray = [];
        }
        
        init(numberOfBalls) 
        {
            for (let i = 0; i < numberOfBalls; i++) 
            {
                this.metaballsArray.push(new Ball(this));
            }
        }
        
        update() 
        {
            this.metaballsArray.forEach(metaball => metaball.update());
        }
        
        draw(context) 
        {
            this.metaballsArray.forEach(metaball => metaball.draw(context));
        }
    }

    const effect = new MetaballsEffect(canvas.width, canvas.height);
    effect.init(numBlobs);
    function circleIntersect(x1, y1, r1, x2, y2, r2) 
    {

        // Calculate the distance between the two circles
        let squareDistance = (x1-x2)*(x1-x2) + (y1-y2)*(y1-y2);

        // When the distance is smaller or equal to the sum
        // of the two radius, the circles touch or overlap
        return squareDistance <= ((r1 + r2) * (r1 + r2));
    }

    function detectCollisions()
    {
        let obj1;
        let obj2;
        let gameObjects = effect.metaballsArray;
        
        
        
        // Reset collision state of all objects
        for (let i = 0; i < gameObjects.length; i++) 
        {
            gameObjects[i].isColliding = false;
        }

        // Start checking for collisions
        for (let i = 0; i < gameObjects.length; i++)
        {
            obj1 = gameObjects[i];
            for (let j = i + 1; j < gameObjects.length; j++)
            {
                obj2 = gameObjects[j];

                // Compare object1 with object2
                if (circleIntersect(obj1.x, obj1.y, obj1.radius, obj2.x, obj2.y, obj2.radius))
                {
                    obj1.isColliding = true;
                    obj2.isColliding = true;
                    let vCollision = {x: obj2.x - obj1.x, y: obj2.y - obj1.y};
                    let distance = Math.sqrt((obj2.x-obj1.x)*(obj2.x-obj1.x) + (obj2.y-obj1.y)*(obj2.y-obj1.y));
                    let vCollisionNorm = {x: vCollision.x / distance, y: vCollision.y / distance};
                    let vRelativeVelocity = {x: obj1.speedX - obj2.speedX, y: obj1.speedY - obj2.speedY};
                    let speed = vRelativeVelocity.x * vCollisionNorm.x + vRelativeVelocity.y * vCollisionNorm.y;
                    if (speed < 0)
                    {
                        break;
                    }
                    obj1.speedX -= (speed * vCollisionNorm.x);
                    obj1.speedY -= (speed * vCollisionNorm.y);
                    obj2.speedX += (speed * vCollisionNorm.x);
                    obj2.speedY += (speed * vCollisionNorm.y);
                }
            }
        }
    }
    function animate() 
    {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        effect.update();
        detectCollisions();
        effect.draw(ctx);
        //window.requestAnimationFrame(animate);
        
        setTimeout(() =>
        {
            window.requestAnimationFrame(animate);
        }, 16.66666666667);
    }
    animate();
});

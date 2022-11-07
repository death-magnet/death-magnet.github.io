window.addEventListener('load', function () 
{   
    const DAMPING = 0.998;
    const display = document.getElementById('canvas1');
    const ctx = display.getContext('2d');
    const width = display.width = window.innerWidth;
    const height = display.height = window.innerHeight;
    const numParticles = display.width > display.height ? display.height : display.width;
    const allowCollisions = false;

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
            this.size = display.width < display.height ? display.width * 0.008 : display.height * 0.008;
            this.width = this.size;
            this.height = this.size;
            this.color = '#00a3a3';
            this.rect = {
                x : this.x,
                y : this.y,
                width : this.width,
                height : this.height,
                speedX : 0,
                speedY : 0,
                isColliding: false,
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

            this.rect.speedX = (this.rect.x - this.oldX) * DAMPING;
            this.rect.speedY = (this.rect.y - this.oldY) * DAMPING;
            this.oldX = this.rect.x;
            this.oldY = this.rect.y;
            if(this.rect.x < 0 || this.rect.x > display.width)
            {
                this.rect.speedX *= -1 * DAMPING;
                this.rect.speedY *= DAMPING;
            }
            if(this.rect.y < 0 || this.rect.y > display.height)
            {
                this.rect.speedX *= DAMPING;
                this.rect.speedY *= -1 * DAMPING;
            }
            this.rect.x += this.rect.speedX;
            this.rect.y += this.rect.speedY;

            if(allowCollisions)
            {
                for(let k = 0; k < particles.length - 1; k++)
                {

                    let obj1 = this.rect;
                    let obj2 = particles[k].rect;

                    obj1.isColliding = false;
                    obj2.isColliding = false;
                    if(obj1.name != obj2.name)
                    {   

                        let vCollision = {x: obj2.x - obj1.x, y: obj2.y - obj1.y};
                        let distance = Math.sqrt((obj2.x-obj1.x)*(obj2.x-obj1.x) + (obj2.y-obj1.y)*(obj2.y-obj1.y));

                        if(distance > obj1.size)
                        {
                            //no collision was detected
                            //so do nothing
                            obj1.isColliding = false;
                            obj2.isColliding = false;

                        }
                        else
                        {
                            //collision detected!
                            //do collision stuff

                            let vCollisionNorm = {x: vCollision.x / distance, y: vCollision.y / distance};
                            let vRelativeVelocity = {x: obj1.speedX - obj2.speedX, y: obj1.speedY - obj2.speedY};
                            let speed = vRelativeVelocity.x * vCollisionNorm.x + vRelativeVelocity.y * vCollisionNorm.y;
                            obj1.isColliding = true;
                            obj2.isColliding = true;
                            if (speed < 0)
                            {
                                break;
                            }
                            obj1.speedX -= (speed * vCollisionNorm.x) * DAMPING;
                            obj1.speedY -= (speed * vCollisionNorm.y) * DAMPING;
                            obj2.speedX += (speed * vCollisionNorm.x) * DAMPING;
                            obj2.speedY += (speed * vCollisionNorm.y) * DAMPING;
                            if(distance < obj1.size * 0.5)
                            {
                                obj1.x <= obj2.x ? function()
                                {
                                    obj1.x -= obj1.size;
                                    obj2.x += obj2.size;
                                } : function()
                                {
                                    obj1.x += obj1.size;
                                    obj2.x -= obj2.size;
                                }
                                obj1.y <= obj2.y ? function()
                                {
                                    obj1.y -= obj1.size;
                                    obj2.y += obj2.size;
                                } : function()
                                {
                                    obj1.y += obj1.size;
                                    obj2.y += obj2.size;
                                };
                            }

                        }
                    }
                }
            }
        }
        draw()
        {
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
        }

    }


    for (var i = 0; i < numParticles; i++) 
    {
        particles[i] = new Particle(Math.random() * width, Math.random() * height);
    }

    display.addEventListener('mousemove', onMousemove);
    display.addEventListener('touchmove', onTouchmove);
    display.addEventListener('mousedown', handleClick);
    display.addEventListener('mouseup', handleClick);
    display.addEventListener('touchstart', handleClick);
    display.addEventListener('touchend', handleClick);

    function onMousemove(e) 
    {
        if(clicked)
        {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        }
    }
    

    function onTouchmove(e) 
    {
        if(clicked)
        {
            mouse.x = e.changedTouches[e.changedTouches.length - 1].pageX;
            mouse.y = e.changedTouches[e.changedTouches.length - 1].pageY;
        }
        touch = true;
    }
    
    function handleClick(e)
    {
        clicked = !clicked;
        if(!touch)
        {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        }
        else
        {    
            mouse.x = e.changedTouches[e.changedTouches.length - 1].pageX;
            mouse.y = e.changedTouches[e.changedTouches.length - 1].pageY;
        }
    }
    
    requestAnimationFrame(animate);

    function animate() 
    {
        ctx.clearRect(0, 0, width, height);
        time = new Date().getTime();
        for (var i = 0; i < particles.length; i++) 
        {   

            particles[i].update();
            if(!particles[i].isColliding)
                particles[i].attract(mouse.x, mouse.y);
            particles[i].draw();
        }
        //window.requestAnimationFrame(animate);
        setTimeout(() =>
        {
            window.requestAnimationFrame(animate);
        }, 16.66666666667);
    }
   
});

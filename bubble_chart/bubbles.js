function Bubble(_name)
{
    this.size = 20;
    this.pos = createVector(0,0);
    this.direction = createVector(0,0);
    this.name = _name;
    this.color = color(random(0,255), random(0,255), random(0,255));
    this.data = [];
    this.xSpeed = random(-2,2);
    this.ySpeed = random(-1,1.5);
    
    
    this.draw = function()
    {
        push();
        textAlign(CENTER);
        noStroke();
        fill(this.color);
        ellipse(this.pos.x, this.pos.y, this.size);
        pop();
    }
    
    //check if x,y is over bubbles
    this.checkMouse = function(mouseX,mouseY)
    {
        var mouse = createVector(mouseX-500,mouseY-500);
        if(p5.Vector.dist(mouse,this.pos) < this.size/2)
            {
                push();
                fill(0);
                rect(mouseX-500,mouseY-540,textWidth(this.name+" has a population of "+this.data)+10,40,20);
                fill(255);
                textFont('Georgia');
                text(this.name+" has a population of "+this.data,mouseX-490,mouseY-515);
                pop();
                
            }
    }
    
    //move bubbles and change size from the last place and size.
    this.update = function(_bubbles)
    {
        this.direction.set(0,0);
        
        for(var i = 0; i < _bubbles.length; i++)
        {
            if(_bubbles[i].name != this.name)
            {
                var v = p5.Vector.sub(this.pos,_bubbles[i].pos); 
                var d = v.mag();

                if(d < this.size/2 + _bubbles[i].size/2)
                {
                    if(d > 0)
                    {
                        
                        this.direction.add(v);
                    }
                    else
                    {
                        this.direction.add(p5.Vector.random2D());    
                         
                    }
                }
            }
        }
        
        this.direction.normalize();
        this.direction.mult(2);
        this.pos.add(this.direction);
        
        if(this.size < this.target_size)
        {
            this.size += 1;
        }
        else if(this.size > this.target_size)
        {
            this.size -= 1;
        }
    }
    
    //set the position x and y and size in the canvas.
    this.setData = function()
    {
        this.target_size = map(this.data, 0, maxAmt, 20, 100);
    }
    
    this.moveRandom = function() 
    {
        if(this.pos.x+this.size < -200 || this.pos.x+this.size > 200)
          this.xSpeed *= -1;
        if(this.pos.y+this.size < -300 || this.pos.y+this.size > 300)
          this.ySpeed *= -1;
        this.pos.x += this.xSpeed / 2;
        this.pos.y += this.ySpeed / 2;
    }
}
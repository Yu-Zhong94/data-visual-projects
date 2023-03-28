function Bubble(id, name,x,y)
{
    this.id = id;
    this.name = name;
    this.size = 10;
    this.x=x;
    this.y=y;
    this.direction = createVector(0,0);
    this.data = 0;

    
    
    
    //check if x,y is over bubbles
    this.checkMouse = function(mouseX,mouseY,x,y,size)
    {
        
        if(dist(mouseX,mouseY,x,y)<size){
            push();
            
            fill(0);
            textSize(12);
            rect(mouseX,
                 mouseY,
                 textWidth(this.name+"  , "+this.data) + 20,
                 40,
                 20);
            
            fill(255);
            textFont('Georgia');
            text(this.name + " , " + this.data, 
                 mouseX + textWidth(this.name+" , "+this.data)/2 + 10,
                 mouseY+25);
            
            pop();
        }
    };
//    
    //move bubbles and change size from the last place and size.
    this.update = function()
    {
        if(this.size < this.target_size)
        {
            this.size += 1;
        }
        else if(this.size > this.target_size)
        {
            this.size -= 1;
        }
    };
    
    //set the position x and y and size in the canvas.
    this.setData = function(maxAmt)
    {
        this.target_size = map(this.data, 0, maxAmt, 10, 250);
    };
}
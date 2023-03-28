function Arc(x, y, diameter, lastAngle, angle, label, color){
    var x=x;
    var y=y;
    var diameter = diameter;
    var lastAngle = lastAngle;
    var angle = angle;
    
    this.label = label;
    this.color = color;

    //check if mouse is over the ring and pop up information of the part
    this.mouseOver = function(mouseX, mouseY){
      var mousedist = dist(mouseX, mouseY, x, y);
      if(mousedist < diameter * 0.5 && mousedist > diameter * 0.3) {
          //determine whether the mouse in the the pie-chart.
        if(atan2(mouseY - y, mouseX - x) < 0) {
          aag = TWO_PI + atan2(mouseY - y, mouseX - x);
        }else{
          aag = atan2(mouseY - y, mouseX - x);
        }
          //caculate the radius
        if (aag > lastAngle && aag < lastAngle + angle + 0.001) {
            push();
            textAlign('center', 'center');
            textSize(diameter/20);
            fill(0);
            percent = round(angle/TWO_PI * 100,2);
            text(label +"," + percent + "%", x, y);
            pop();
        }
      }
    };
    
    //draw every ring of the pie chart
    this.draw=function(){
      noFill();
      strokeWeight(diameter/6);
      strokeCap(SQUARE);
      stroke(color);
      arc(x, y,
          diameter*0.8, diameter*0.8,
          lastAngle, lastAngle + angle + 0.001); // Hack for 0!
      noStroke();
    }
}
function PieChart(x, y, diameter) {

  this.x = x;
  this.y = y;
  this.diameter = diameter;
  this.labelSpace = 30;

  this.get_radians = function(data) {
    var total = sum(data);
    var radians = [];

    for (let i = 0; i < data.length; i++) {
      radians.push((data[i] / total) * TWO_PI);
    }
    return radians;
  };

  this.draw = function(data, labels, colours, title) {

    // Test that data is not empty and that each input array is the
    // same length.
    if (data.length == 0) {
      alert('Data has length zero!');
    } else if (![labels, colours].every((array) => {
      return array.length == data.length;
    })) {
      alert(`Data (length: ${data.length})
Labels (length: ${labels.length})
Colours (length: ${colours.length})
Arrays must be the same length!`);
    }


    var angles = this.get_radians(data);
    var lastAngle =0;
    var colour;
    var aag;
    var arcs = [];
      
    for (var i = 0; i < data.length; i++) {
        
      //set colours
      if (colours) {
        colour = colours[i];
      } else {
        colour = map(i, 0, data.length, 0, 255);
      }
        
      //set labels
      noStroke();
      if (labels) {
        this.makeLegendItem(labels[i], i, colour);
      }
        
      //create array of object
      arcs.push(new Arc(this.x, this.y, this.diameter, lastAngle, angles[i], labels[i], colours[i]));
      lastAngle += angles[i];
    }

    for (var j = 0; j < arcs.length; j++) {
        arcs[j].draw();
        arcs[j].mouseOver(mouseX,mouseY);
    }

    if (title) {
      noStroke();
      fill(0);
      textAlign('center', 'center');
      textSize(diameter/20);
      text(title, this.x, this.y - this.diameter * 0.6);
    }
      
  };

  this.makeLegendItem = function(label, i, colour) {
    var x = this.x + 60 + this.diameter / 2;
    var y = this.y + (this.labelSpace * i) - this.diameter/5;
    var boxWidth = this.labelSpace / 2;
    var boxHeight = this.labelSpace / 2;

    fill(colour);
    rect(x, y, boxWidth, boxHeight);

    fill('black');
    noStroke();
    textAlign('left', 'center');
    textSize(12);
    text(label, x + boxWidth + 10, y + boxWidth / 2);
  };
    
}

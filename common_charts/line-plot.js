function LinePlot(x, y, label, colour) {

  // Layout object to store all common plot layout parameters and
  // methods.


  this.get_points = function(data) {
    var yearIntake = [][];
    var mapyearintake = [][];

    //loop over all the rows
    for(var i = 0; i < this.data.getRowCount(); i++ )
    {
        this.yearIntake[i][j] = this.data.getRow(i);
        this.mapyearintake[i][j] = this.mapYearToWidth(this.data.getRow(i)),
                 
        //if the series isn't there already add a new array
        if(this.series[row.getString(0)] == undefined)
        {
            this.series[row.getString(0)] = [];
            this.colors.push(color(random(0,255),random(0,255),random(0,255)));
        }
        
        for(var j = 1; j < this.data.getColumnCount(); j++)
        {
            this.minY =  min(this.minY, row.getNum(j));
            this.maxY = max(this.maxY, row.getNum(j));
            // we are assuming that the data is in chronological order
            this.yearIntake[i][j].push(row.getNum(j));
            this.mapyearintake[i][j] =  this.mapYToHeight(row.getNum(j)),
        }
        
    }
    return yearIntake;
  };

  this.draw = function(data, labels, colours, title) {


    var legend = this.get_points(data);
      
    for(var j = 0; j < legend[j].length; j++)
    {
        var previous = null;
        // Loop over all rows and draw a line from the previous value to
        // the current.
        for (var i = 0; i < legend[i].length; i++) 
        {
          // Create an object to store data for the current year.
          var current = {
            // Convert strings to numbers.
            'year': this.startYear + i,
            'percentage': legend[j][i]
          };

          if (previous != null) {
            // Draw line segment connecting previous year to current
            // year pay gap.
            stroke(colors[j]);
            line(this.mapYearToWidth(previous.year),
                 this.mapYToHeight(previous.percentage),
                 this.mapYearToWidth(current.year),
                 this.mapYToHeight(current.percentage));

      
          }
          else
          {
            push();
            textAlign(LEFT);
            noStroke();
            text(legend[j], 100 ,this.mapYToHeight(current.percentage) -20)  
            pop();
          }

          // Assign current year to previous year so that it is available
          // during the next iteration of this loop to give us the start
          // position of the next line segment.
          previous = current;
        }
    }
  
        
    if (labels) {
    // Draw all y-axis labels.
    drawYAxisTickLabels(this.minY,
                        this.maxY,
                        this.layout,
                        this.mapYToHeight.bind(this),
                        0);

    // Draw x and y axis.
    drawAxis(this.layout);

    // Draw x and y axis labels.
    drawAxisLabels(this.xAxisLabel,
                   this.yAxisLabel,
                   this.layout);

    // Plot all pay gaps between startYear and endYear using the width
    // of the canvas minus margins.
    
    var numYears = this.endYear - this.startYear;
    
    for(var i = 0; i < numYears; i++)
    {
        // The number of x-axis labels to skip so that only
        // numXTickLabels are drawn.
        var xLabelSkip = ceil(numYears / this.layout.numXTickLabels);
        
        y = this.startYear + i;
        // Draw the tick label marking the start of the previous year.
        if (i % xLabelSkip == 0) {
          drawXAxisTickLabel(y, this.layout,
                             this.mapYearToWidth.bind(this));
        }  
    }
    }

    if (title) {
    // Draw the title above the plot.
    this.drawTitle();
    }
      
  };
      

  this.drawTitle = function() {
    fill(0);
    noStroke();
    textAlign('center', 'center');

    text(this.title,
         (this.layout.plotWidth() / 2) + this.layout.leftMargin,
         this.layout.topMargin - (this.layout.marginSize / 2));
  };

  this.mapPointToWidth = function(value) {
    return map(value,
               this.startYear,
               this.endYear,
               this.layout.leftMargin,   // Draw left-to-right from margin.
               this.layout.rightMargin);
  };

  this.mapPointToHeight = function(value) {
    return map(value,
               this.minY,
               this.maxY,
               this.layout.bottomMargin, // Smaller pay gap at bottom.
               this.layout.topMargin);   // Bigger pay gap at top.
  };
      
  this.makeLegendItem = function(label, i, colour) {
    var x = this.x + 50 + this.diameter / 2;
    var y = this.y + (this.labelSpace * i) - this.diameter / 3;
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
  
  this.makeMouseOver = function(point, label, mouseX, mouseY) {
      var mousedist = dist(mouseX, mouseY, this.x, this.y);
        
      if(mousedist < this.diameter * 0.5 && mousedist > this.diameter * 0.3) {
          //determine whether the mouse in the the pie-chart.
        if(atan2(mouseY - this.y, mouseX - this.x) < 0) {
          aag = TWO_PI + atan2(mouseY - this.y, mouseX - this.x);
        }else{
          aag = atan2(mouseY - this.y, mouseX - this.x);
        }
          //caculate the radius
        if (aag > lastangle && aag < lastangle + angle + 0.001) {
            push();
            textAlign('center', 'center');
            textSize(38);
            fill(0);
            percent = round(angles[i]/TWO_PI * 100,2);
            text(label +"," + percent + "%", this.x, this.y);
            pop();
        }
      }
    };
}

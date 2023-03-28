function Trends() {

  // Name for the visualisation to appear in the menu bar.
  this.name = 'Trends in tenure';

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = 'Trends_in_tenure_2008_18';

  // Title to display above the plot.
  this.title = 'Trends in tenure (proportions): 2009-2019';

    // Names for each axis.
  this.xAxisLabel = 'year';
  this.yAxisLabel = 'Percentage';
    
  this.colors = [];

  var marginSize = 45;

  // Layout object to store all common plot layout parameters and
  // methods.
  this.layout = {
    marginSize: marginSize,

    // Locations of margin positions. Left and bottom have double margin
    // size due to axis and tick labels.
    leftMargin: marginSize * 2,
    rightMargin: width - marginSize,
    topMargin: marginSize,
    bottomMargin: height - marginSize * 2,
    pad: 5,

    plotWidth: function() {
      return this.rightMargin - this.leftMargin;
    },

    plotHeight: function() {
      return this.bottomMargin - this.topMargin;
    },

    // Boolean to enable/disable background grid.
    grid: true,

    // Number of axis tick labels to draw so that they are not drawn on
    // top of one another.
    numXTickLabels: 10,
    numYTickLabels: 8,
  };

  // Property to represent whether data has been loaded.
  this.loaded = false;

  // Preload the data. This function is called automatically by the
  // gallery when a visualisation is added.
  this.preload = function() {
    var self = this;
    this.data = loadTable(
      './data/housing/Trends_in_tenure_2008_18.csv', 'csv', 'header',
      // Callback function to set the value
      // this.loaded to true.
      function(table) {
        self.loaded = true;
      });

  };

  this.setup = function() {
    // Font defaults.
    textSize(16);

    // Get min and max years:

      
    this.endYear = 2019;
    this.startYear = 2009;
    this.minY = 999;
    this.maxY = 0;
    this.series = {};
   
    //loop over all the rows
    for(var i = 0; i < this.data.getRowCount(); i++ )
    {
        var row = this.data.getRow(i);
        
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
            this.series[row.getString(0)].push(row.getNum(j));
        }
        
    }
    // slider setup
    this.startSlider = createSlider(this.startYear, this.endYear - 1, this.startYear, 1);
    this.startSlider.position(400, 550);

    this.endSlider = createSlider(this.startYear + 1, this.endYear, this.endYear, 1);
    this.endSlider.position(600, 550);
      
    // button setup
    
      
      
    // colorpicker setup
//    this.colorPicker = createColorPicker(255,255,0);
//    this.colorPicker.size(20);
//    this.colorPicker.position(this.layout.rightMargin+150, this.layout.bottomMargin/2 );

    // line creation
  }
    
  this.destroy = function() {
    this.startSlider.remove();
    this.endSlider.remove();
  };

  this.draw = function() 
  {
    if (!this.loaded) {
      console.log('Data not yet loaded');
      return;
    }
      
    // Prevent slider ranges overlapping.
    if (this.startSlider.value() >= this.endSlider.value()) {
      this.startSlider.value(this.endSlider.value() - 1);
    }
    this.startYear = this.startSlider.value();
    this.endYear = this.endSlider.value();

    // Draw the title above the plot.
    this.drawTitle();
    strokeWeight(1);
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
      


      
    var legend = Object.keys(this.series);
      

      
    for(var j = 0; j < legend.length; j++)
    {
        
        this.colors.push(color(random(0,255),random(0,255),random(0,255)));
        var previous = null;
        // Loop over all rows and draw a line from the previous value to
        // the current.
        for (var i = 0; i < this.series[legend[j]].length; i++) 
        {
        
            
          // Create an object to store data for the current year.
          var current = {
            // Convert strings to numbers.
            'year': this.startYear + i,
            'percentage': this.series[legend[j]][i]
          };

          if (previous != null) {
            // Draw line segment connecting previous year to current
            // year pay gap.
            stroke(this.colors[j]);
            strokeWeight(3);
            line(this.mapYearToWidth(previous.year),
                 this.mapYToHeight(previous.percentage),
                 this.mapYearToWidth(current.year),
                 this.mapYToHeight(current.percentage));
            strokeWeight(10);
            point(this.mapYearToWidth(current.year),
                 this.mapYToHeight(current.percentage));
            
            this.mouseOver(current.year, 
                           current.percentage,
                           createVector(this.mapYearToWidth(current.year),this.mapYToHeight(current.percentage)),
                           createVector(mouseX,mouseY));
          }
          else
          {
            push();
            textAlign(LEFT);
            noStroke();
            fill(this.colors[j]);
            textSize(18);
            text(legend[j], 100 ,this.mapYToHeight(current.percentage) -20)  
            pop();
          }

          // Assign current year to previous year so that it is available
          // during the next iteration of this loop to give us the start
          // position of the next line segment.
          previous = current;
            
        }
        this.makeLegendItem(this.layout.rightMargin-120, this.layout.bottomMargin/1.5 + j * 20 ,legend[j],this.colors[j]);
    }
      
  };

  this.drawTitle = function() {
    fill(0);
    noStroke();
    textAlign('center', 'center');
    textSize(18);

    text(this.title,
         (this.layout.plotWidth() / 2) + this.layout.leftMargin,
         this.layout.topMargin - (this.layout.marginSize / 2));
  };

  this.mapYearToWidth = function(value) {
    return map(value,
               this.startYear,
               this.endYear,
               this.layout.leftMargin,   // Draw left-to-right from margin.
               this.layout.rightMargin);
  };

  this.mapYToHeight = function(value) {
    return map(value,
               this.minY,
               this.maxY,
               this.layout.bottomMargin, // Smaller pay gap at bottom.
               this.layout.topMargin);   // Bigger pay gap at top.
  };
  
  this.mouseOver = function(year,percent,point,mouse){
      if(point.dist(mouse) < 10){
        push();
        textAlign('center', 'center');
        textSize(30);
        fill(255);
        text(round(percent) + "%", mouse.x, mouse.y);
        pop();
      }
      
  };
  
  this.makeLegendItem = function(x, y, label, colour){
      stroke(colour);
      strokeWeight(3);
      line(x, y, x + this.layout.marginSize, y);
      strokeWeight(10);
      point(x + this.layout.marginSize/2,y);

    

      fill(0);
      noStroke();
      textAlign('left', 'center');
      textSize(12);
      text(label, x + this.layout.marginSize + 10, y);
}
}

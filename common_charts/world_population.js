function WorldPopulation() {

  // Name for the visualisation to appear in the menu bar.
  this.name = 'World Population';

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = 'world_population';
    
  var maxAmt = 0;
  var bubbles = [];
  var url;
  this.api = 'http://api.worldbank.org/v2/country/all/indicator/SP.POP.TOTL?format=json&per_page=300';
  this.date = 2010;
  
  // Property to represent whether data has been loaded.
  this.loaded = false;
  this.preload = function() {
    var self = this;
    this.data = loadJSON('http://api.worldbank.org/v2/country/all/indicator/SP.POP.TOTL?format=json&per_page=300&date=2010',
        function(jsondata) {
        self.loaded = true;
      });
  };

  this.setup = function()
  {
    if (!this.loaded) {
      console.log('Data not yet loaded');
      return;
    }
    var self = this;
    this.dateSlider = select('#year');

    this.dateSlider = createSlider(1980,2018,2010,1);
    this.dateSlider.position(500,height+10);
    this.dateSlider.size(500);
    
    this.dateSlider.changed(this.reloadData);
    


    for(var i = 47; i < this.data[1].length; i++)
    {
        var b;
        if(this.data[1][i].country.value != "")
        {
            b = new Bubble(this.data[1][i].country.value);
        } 
        if(this.data[1][i].value != "")
        {
            var n = this.data[1][i].value;
            if(n > maxAmt)
            {
                maxAmt = n; //keep a tally of the highest value
            }
            b.data=n;
        }
        else
        {
            b.data=0;
        }
        bubbles.push(b);
    }
    //present data in the canvas. 
    for(var i = 0; i < bubbles.length; i++)
    {
        bubbles[i].setData(maxAmt);
    }
  };

  this.destroy = function() {
    this.dateSlider.remove();
    clearStorage();

  };
  this.reloadData = function()
  {
    loadJSON(url, 
             function(changedData) 
             {
        for(var i = 47; i < changedData[1].length; i++)
        {
            if(changedData[1][i].value != "")
            {
                var n = int(changedData[1][i].value);
                

                if(n > maxAmt)
                {
                    maxAmt = n; //keep a tally of the highest value
                }
                bubbles[i-47].data=n;
            }
            else
            {
                bubbles[i-47].data=0;
            }
        }
        for(var i = 0; i < bubbles.length; i++)
        {
            bubbles[i].setData(maxAmt);
        }
    });
  };


  this.draw = function()
  {
    background(255);
      
    translate(width/2, height/2);
    url=this.api+ "&date="+ this.dateSlider.value();

    textSize(12);
    for(var i = 0; i < bubbles.length; i++)
    {
        bubbles[i].update(bubbles);
        bubbles[i].draw();
        bubbles[i].moveRandom();
    }
    for(var i = 0; i < bubbles.length; i++)
    {
        bubbles[i].checkMouse(mouseX,mouseY);
    }
    var title = 'WORLD POPULATION in '+ this.dateSlider.value();
    textSize(20);
    fill(0);
    text(title,0,0);
  };
}


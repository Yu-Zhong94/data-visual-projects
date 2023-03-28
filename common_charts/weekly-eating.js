function WeeklyEatingHabit() {

  // Name for the visualisation to appear in the menu bar.
  this.name = 'Weekly Eating Habit';

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = 'weekly-eating';

  // Property to represent whether data has been loaded.
  this.loaded = false;

  // Preload the data. This function is called automatically by the
  // gallery when a visualisation is added.
  this.preload = function() {
    var self = this;
    this.data = loadTable(
      './data/food/finalData.csv', 'csv', 'header',
      // Callback function to set the value
      // this.loaded to true.
      function(table) {
        self.loaded = true;
      });
  };

  this.setup = function() {
    if (!this.loaded) {
      console.log('Data not yet loaded');
      return;
    }

    this.waffles = [];
    this.boxes = [];

    this.days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
		"Sunday"
	];

	this.values = ['Take-away', 'Cooked from fresh', 'Ready meal', 'Ate out',
		'Skipped meal', 'Left overs'
	]
    for(var i=0;i<this.days.length;i++){
        if(i<4){
            this.waffles.push(new Waffle(20+(i*220),20,200,200,8,8,this.data,this.days[i],this.values));
        }
        else
        {
            this.waffles.push(new Waffle(120+(i-4)*220,240,200,200,8,8,this.data,this.days[i],this.values));
        }
    }
  };

 
  this.draw = function() {
    if (!this.loaded) {
      console.log('Data not yet loaded');
      return;
    }


    // Make a title.
//    var title = 'Employee diversity at ' + companyName;

    // Draw the pie chart!
	background(255);
    for(var i=0;i<this.waffles.length;i++){
        this.waffles[i].draw();
    }
    for(var i=0;i<this.waffles.length;i++){
        this.waffles[i].checkMouse(mouseX,mouseY);
    }
  };
}

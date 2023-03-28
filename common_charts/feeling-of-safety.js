function Feeling() {

  // Name for the visualisation to appear in the menu bar.
  this.name = 'Household Feeling of Safety';

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = 'feeling-of-safety';

  // Property to represent whether data has been loaded.
  this.loaded = false;

  // Preload the data. This function is called automatically by the
  // gallery when a visualisation is added.
  this.preload = function() {
    var self = this;
    this.data = loadTable(
      './data/housing/Feelings_of_safety_2018_19.csv', 'csv', 'header',
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

    // Create a select DOM element.
    this.select = createSelect();
    this.select.position(350, 500);

    // Fill the options with all company names.
    var type = this.data.columns;
    // First entry is empty.
    for (var i = 1; i < type.length; i++) {
      this.select.option(type[i]);
    }
  };

  this.destroy = function() {
    this.select.remove();
  };

  // Create a new pie chart object.
  this.pie = new PieChart(width / 2, height / 2, width * 0.4);

  this.draw = function() {
    if (!this.loaded) {
      console.log('Data not yet loaded');
      return;
    }

    // Get the value of the company we're interested in from the
    // select item.
    var type = this.select.value();

    // Get the column of raw data for question.
    var col = this.data.getColumn(type);

    // Convert all data strings to numbers.
    col = stringsToNumbers(col);

    // Copy the row labels from the table (the first item of each row).
    var labels = this.data.getColumn(0);

    // Colour to use for each category.
    var colours = [
        color(0,204,0),
        color(51,255,51),
        color(255,255,51),
        color(255,200,51),
        color(255,153,51),
        color(255,51,51)
    ];

    // Make a title.
    var title = type;

    // Draw the pie chart!
    this.pie.draw(col, labels, colours, title);
  };
}

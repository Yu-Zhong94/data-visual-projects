var data;
var bubbles = [];
var maxAmt;
var api = 'http://api.worldbank.org/v2/country/all/indicator/SP.POP.TOTL?format=json&per_page=300';

function preload()
{
    data = loadJSON('http://api.worldbank.org/v2/country/all/indicator/SP.POP.TOTL?format=json&per_page=300&date=2010');
}

function setup()
{
    createCanvas(1000, 1000);
    dateSlider = select('#year');

    dateSlider = createSlider(1980,2018,2010,1);
    dateSlider.size(1000);
    dateSlider.changed(reloadData);
    
    maxAmt = 0;

    for(var i = 47; i < data[1].length; i++)
    {
        var b;
        if(data[1][i].country.value != "")
        {
            b = new Bubble(data[1][i].country.value);
        } 
        if(data[1][i].value != "")
        {
            var n = data[1][i].value;
            if(n > maxAmt)
            {
                maxAmt = n; //keep a tally of the highest value
            }
            b.data.push(n);
        }
        else
        {
            b.data.push(0);
        }
        bubbles.push(b);
    }
    //present data in the canvas. 
    for(var i = 0; i < bubbles.length; i++)
    {
        bubbles[i].setData();
    }
}

function reloadData()
{
	var url = api + "&date="+dateSlider.value();
    loadJSON(url, gotData);

}

function gotData(data){
    changedData = data;
    maxAmt = 0;

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
        bubbles[i].setData();
    }

}


function draw() 
{
    background(255);

    
    translate(width/2, height/2);

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
    var title = 'WORLD POPULATION in '+ dateSlider.value();
    textSize(50);
    text(title,-350,-400);
}


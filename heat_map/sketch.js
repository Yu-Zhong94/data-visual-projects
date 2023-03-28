var data;
var lifeExp;
var gdp;
var bubbles = [];
var maxAmt;
var maxXax;
var maxYax;
var leftPad;
var rightPad;
var topPad;
var bottomPad;
var maxAmt = 0;
var api = 'http://api.worldbank.org/v2/country/all/';
var format = '/?format=json&per_page=297';
const mappa = new Mappa('Leaflet');
const options = {
  lat: 0,
  lng: 0,
  zoom: 1.5,
  style: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png'
}
function preload(){
    locationdata = loadJSON("http://api.worldbank.org/v2/country/all/?format=json&per_page=297");
    selectedData = loadJSON("http://api.worldbank.org/v2/country/all/indicator/SP.POP.TOTL/?format=json&per_page=297&date=2010");
    
}

function setup()
{
	//scene setup
    canvas = createCanvas(1200, 800);
    myMap = mappa.tileMap(options);
    myMap.overlay(canvas);
    myMap.onChange(drawlocation);
    textAlign(CENTER);
    textStyle(BOLD);
    
    
    //slider setup
    dateSlider = select('#year');
    dateSlider = createSlider(1980,2018,2010,1);
    dateSlider.changed(reloadData);
    //select setup
    indicatorSelect = select('#indicator');
    indicatorSelect = createSelect();
    indicatorSelect.option('population', "SP.POP.TOTL");
    indicatorSelect.option('lifespan', "SP.DYN.LE00.IN");
    indicatorSelect.option('GDP', "NY.GDP.PCAP.CD");
    indicatorSelect.selected('population');
    
    indicatorSelect.changed(reloadData);
    

    for(var i = 0; i < locationdata[1].length; i++)
    {
        latitude = Number(locationdata[1][i].latitude);
        longitude = Number(locationdata[1][i].longitude);
        bubbles.push(new Bubble(locationdata[1][i].id, locationdata[1][i].name,Number(locationdata[1][i].latitude),Number(locationdata[1][i].longitude)));
    }

    for(var i = 0; i < locationdata[1].length; i++){
        for(var j = 0; j < selectedData[1].length; j++){
            if(bubbles[i].id==selectedData[1][j].countryiso3code && selectedData[1][j].value != ""){
                var n = selectedData[1][j].value;

                if(n > maxAmt)
                {
                    maxAmt = n; //keep a tally of the highest value
                }
                if(n!=""){
                    bubbles[i].data=n;
                }
                else{
                    bubbles[i].data=0;
                }
                
            }
        }
    }
    //present data in the canvas. 
    for(var i = 0; i < bubbles.length; i++)
    {
        bubbles[i].setData(maxAmt);
    }

}
function destroy() {
    dateSlider.remove();
    indicatorSelect.remove();
    countrySelect.remove();
  }

function reloadData() 
{
    var url = api +"indicator/"+ indicatorSelect.value() + format + "&date="+dateSlider.value();
    loadJSON(url, gotData);
}

function gotData(data){
    selectedData = data;

    for(var i = 0; i < locationdata[1].length; i++){
        for(var j = 0; j < selectedData[1].length; j++){
            if(bubbles[i].id==selectedData[1][j].countryiso3code && selectedData[1][j].value != ""){
                var n = int(selectedData[1][j].value);
                if(n > maxAmt)
                {
                    maxAmt = n; //keep a tally of the highest value
                }

                if(n!=""){
                    bubbles[i].data=n;
                }
                else{
                    bubbles[i].data=0;
                }
            }
        }
    }
    
    for(var i = 0; i < bubbles.length; i++)
    {
        bubbles[i].setData(maxAmt);
    }
    drawlocation();


}

function draw() 
{
    for(var i = 0; i < bubbles.length; i++)
    {
        bubbles[i].update();
    }
    if(mouseIsPressed){
        for(var i = 0; i < bubbles.length; i++)
        {
            pos = myMap.latLngToPixel(bubbles[i].x,bubbles[i].y);
            bubbles[i].checkMouse(mouseX,
                                  mouseY,
                                  pos.x,
                                  pos.y,
                                  bubbles[i].size * myMap.zoom() / 2 );
        } 
    }


}

function drawlocation(){
        
    clear();
        
    for(var i = 0; i < bubbles.length; i++)
    {

        pos = myMap.latLngToPixel(bubbles[i].x,bubbles[i].y);
        if(bubbles[i].x){
            push();
            textAlign(CENTER);
            noStroke();
            fill(0, 255, 255, 100);
            ellipse(pos.x,pos.y,bubbles[i].size * myMap.zoom());
            pop();
        }

    }
    var title = dateSlider.value() + ' World ' + selectedData[1][0].indicator.value;
    fill(0);
    textSize(30);
    text(title, width/2,40);



}

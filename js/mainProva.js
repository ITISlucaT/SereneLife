// Using an Object Layer to limit movement and changing Map Tiles.
var tmap, smiley, plantsIndex, viewWalls = false;
var x, y, prevx, prevy;
let character;
let temp;

function preload() {
  //tmap = loadTiledMap("backgroundVillage", "data");
  tmap = loadImage("backgroundVillage.png");
  //smiley = loadImage("data/smiley.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  new Canvas(windowWidth, windowHeight);
  
  walls = createGraphics(800, 600); //crea la grafica del layer che gli do
  initializeMap();
  character = new Personaggio();
  console.log(character);
  character.pixelPerfect = true;
  temp = new Sprite(200, 80, 120); 
  // temp.addAni('walk', '../data/character.png', 5)
  sprite.diameter = 100;
  sprite.x = 100;
  sprite. y= 100;
}

function draw() {
  //clear(); 
  background(color(45)); //setto i bordi esterni alla mappa neri
  tmap.draw(x, y);
  temp.debug = mouse.pressing();
  


}

function keyPressed(){
  if(key == 'w' || key == 'W')  character.move();
}
function mousePressed() {
  //if(mouse.presses) temp.changeAni('move');
}

function initializeMap() {
  tmap.setPositionMode("MAP");
  tmap.setDrawMode(CENTER);
  var p = tmap.getMapSize();
  x = p.x / 2;
  y = p.y / 2;
}

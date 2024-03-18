/**
 * @file file principale per gestire il gioco Serene Life
 * @author Torelli Luca 
 * @version 0.0.1
 * https://github.com/ITISlucaT
 * 
 */

var tmap, viewWalls = false;
var tileSize, mapSize;//dimensione del singolo tile e dimensione della mappa(in tile)
var x, y, prevx, prevy; //coordinate della camera
let character, level = 1;//personaggio e livello generale della mappa

const speedCharacter = 0.25;//velocità del personaggio
const speedCamera = 0.25;//velocità della telecamera 
//!!tenere la velocità uguale altrimenti si disallinea
let showError = false;//flag per mostrare il warning di soldi insufficienti
const ERROR_TIME = 60 //durata del messaggio di errore
let errorCounter = ERROR_TIME;//tempo rimasto al messaggio di errore
let isPaused = false;//flag per mettere la pausa
let menuIcn, resumeIcn, exitIcn, bannerIcn;//icone
let menuBtn, resumeBtn, exitBtn;//bottoni
let startTime, totalPausedTime = 0; //tengo anche il tempo di pausa per restituire solo il tempo effettivo della sessione nel gioco
let totalResourcesFarmed = 0;//totale risorse raccolte
let incomePerSecond = 0; //guadagni al secondo

function preload() {
  tmap = loadTiledMap("backgroundVillage", "data");
  /*
Carica i suoni di sfondo
- backgroundMusic: musica di sottofondo
- hitSnd: suono quando si colpisce qualcosa
- moneySnd: suono quando si raccoglie denaro
- levelUpSound: suono quando si costruisce un espansione
*/
  soundFormats('mp3', 'ogg');
  backgroundMusic = loadSound('data/music/backgroundSound.mp3');
  hitSnd = loadSound('data/music/hit.mp3');
  moneySnd = loadSound('data/music/moneyDrop.mp3');
  levelUpSound = loadSound('data/music/levelUp.mp3');

  /*
Carica le immagini
- menuIcn: Icona del menu
- resumeIcn: Icona per riprendere il gioco
- exitIcn: Icona per uscire dal gioco
- bannerIcn: Icona banner titolo
*/
  menuIcn = loadImage('../data/menu/PremadeButtons_Menu.png')
  resumeIcn = loadImage('../data/menu/PremadeButtons_Resume.png');  
  exitIcn = loadImage('../data/menu/PremadeButtons_ExitRed.png');
  bannerIcn = loadImage('../data/menu/Banner_Greenz.png');
}
function setup() {
  new Canvas(windowWidth, windowHeight);//uso la libreria p5 per inizializzare il canva, altrimenti non posso usare gli oggetti della libreria
  imageMode(CENTER);
  initializeMap();
  
  tileSize = tmap.getTileSize();//funzione della libreria p5.tiledmap.js
  mapSize = tmap.getMapSize();
  // console.log(tileSize)
  character = new Personaggio();
  // console.log(character);
  // console.log(tmap);

  // Ridimensiona l'immagine del banner 
  bannerIcn.resize(500, 150)

  // Crea il pulsante del menu
  menuBtn = new Clickable();
  menuBtn.locate(windowWidth - 90, 20);
  menuBtn.resize(50, 50);
  menuBtn.image = menuIcn;
  menuBtn.text = "";
  menuBtn.onPress = function() {
    // Gestisci la pausa del gioco
    isPaused = !isPaused;
    character.sprite.visible = false;
    pauseStartTime = millis();
  };

  // Crea il pulsante per riprendere il gioco
  resumeBtn = new Clickable();
  resumeBtn.locate(windowWidth / 2 - 150, windowHeight / 2 - 50);
  resumeBtn.resize(300, 150);
  resumeBtn.image = resumeIcn;
  resumeBtn.text = "";
  resumeBtn.onPress = function() {
    // Gestisci la ripresa del gioco
    isPaused = !isPaused;
    resumeBtn.hide();
    character.sprite.visible = true;
    const pauseEndTime = millis();
    totalPausedTime += pauseEndTime - pauseStartTime;
  };

  // Crea il pulsante per uscire dal gioco
  exitBtn = new Clickable();
  exitBtn.locate(windowWidth / 2 - 150, windowHeight / 2 + 150);
  exitBtn.resize(300, 150);
  exitBtn.image = exitIcn;
  exitBtn.text = "";
  exitBtn.onPress = function() {
    // Reindirizza alla pagina principale
    window.location.href = 'index.html';
  };

  startTime = millis(); // Registra il tempo di inizio
  backgroundMusic.loop(); // Riproduci la musica di sottofondo
  setInterval(passiveIncome, 1000); // Esegui la funzione passiveIncome ogni secondo
}
let canSell = false;


function draw() { 
  if (!isPaused) {
    const currentTime = millis();
    const elapsedSeconds = (currentTime - startTime - totalPausedTime) / 1000;
    const minutes = floor(elapsedSeconds / 60);
    const seconds = floor(elapsedSeconds % 60);

    background(color(88, 164, 236)); // Imposta il colore del mare per i bordi esterni della mappa

    generateNewItem();

    // Mostra le risorse e altre informazioni
    textSize(30);
    textAlign(LEFT);
    fill(0);
    text("🪙 " + character.resource.gold, 10, 30);
    text("🪵 " + character.resource.wood, 10, 90);
    text("🪨 " + character.resource.minerals, 10, 120);
    text("🐟 " + character.resource.fishes, 10, 150);
    text("🏦/s: " + incomePerSecond, 10, 180);

    // Informazioni sul livello e azioni possibili
    textSize(26);
    result = isNearResources();
    text("⭐Livello: " + level + "⭐", windowWidth - 180, 180);
    cameraMovement();

    // Mostra istruzioni in base alla posizione del personaggio
    if (result) {
      canSell = false;
      text("⚒️Premi Q per raccogliere risorse⚒️", windowWidth / 120, windowHeight - 200);
    } else {
      canSell = true;
      text("🏪Premi C per vendere risorse🏪", windowWidth / 120, windowHeight - 200);
    }

    // Altre opzioni
    text("🏠Premi E per comprare un espansione🏠", windowWidth / 120, windowHeight - 100);
    text(`🕛Durata sessione: ${minutes}min ${seconds}s🕛`, windowWidth * 0.8, windowHeight - 100);
    text(`🫴🏽Risorse totali raccolte:  ${totalResourcesFarmed}🫴🏽`, windowWidth * 0.8, windowHeight - 200);

    // Mostra messaggio di errore 
    if (showError) {
      textSize(40);
      fill(color(255, 0, 0));
      text("⚠️Soldi insufficienti per comprare un espansione⚠️", 600, 900);
      fill(0);
      errorCounter--;

      if (errorCounter == 0) {
        showError = false;
        errorCounter = ERROR_TIME;
      }
    }

    // Disegna il pulsante del menu
    menuBtn.draw();
  } else { // Disegna il menu di pausa
    background(255);
    image(bannerIcn, windowWidth / 2, windowHeight / 2 - 150);
    resumeBtn.draw();
    exitBtn.draw();
  }  
}

  


let result;
function keyPressed() {
  if (canSell == false && (key == 'q' || key == 'Q')) {
    hitSnd.play(); 
    farm(); 
    understandResources(result); 
  }
  if (canSell == true && (key == 'c' || key == 'C')) {
    sellResources(); 
  }
  if (key == 'e' || key == 'E') {
    buyHouses();
  }
  if (key == 'Escape') {
    isPaused = !isPaused; // Attiva/disattiva la pausa
    character.sprite.visible = !character.sprite.visible; // Mostra/nascondi il personaggio
    if (isPaused) {
      pauseStartTime = millis(); // Registra il tempo di inizio della pausa
    } else {
      const pauseEndTime = millis(); // Registra il tempo di fine della pausa
      totalPausedTime += pauseEndTime - pauseStartTime; // Aggiorna il tempo totale di pausa
    }
  }
  mainMovement(); // Gestione del movimento principale
}



// Funzione per gestire il movimento della telecamera
function cameraMovement() {
  if (keyIsPressed) { // ATTENZIONE: tre metodi diversi per gestire l'immissione di tasti per alleggerire
    prevx = x;
    prevy = y;
    if (key == 'a' || key == 'A') x -= speedCamera; // Sposta a sinistra
    if (key == 'd' || key == 'D') x += speedCamera; // Sposta a destra
    if (key == 'w' || key == 'W') y -= speedCamera; // Sposta verso l'alto
    if (key == 's' || key == 'S') y += speedCamera; // Sposta verso il basso

    // Verifica se il tile è all'interno dell'array wallsIndex o resourceIndex
    if (
      wallsIndex.indexOf(tmap.getTileIndex(0, round(x), round(y))) >= 0 ||
      resourceIndex.indexOf(tmap.getTileIndex(level, round(x), round(y))) >= 0
    ) {
      // Se il personaggio colpisce un muro o una risorsa, ripristina la posizione precedente
      x = prevx;
      y = prevy;
      character.sprite.x = character.sprite.prevX;
      character.sprite.y = character.sprite.prevY;
    } else {
      // Altrimenti, aggiorna la posizione precedente del personaggio
      character.sprite.prevX = character.sprite.x;
      character.sprite.prevY = character.sprite.y;
    }
  }
}

function keyReleased() {

  character.sprite.vel.x = 0;
  character.sprite.vel.y = 0;
  if (positionCharacter == 'up'){
    character.sprite.changeAni('standUp');
  }
  else if (positionCharacter == 'right'){
    character.sprite.changeAni('standRight');
  }
  else if (positionCharacter == 'left'){
    character.sprite.changeAni('standRight');
  }else
  character.sprite.changeAni('standDown');
}

//funzione per inizializzare l'oggetto tiled 
function initializeMap() {
  tmap.setPositionMode("MAP");
  tmap.setDrawMode(CENTER);
  var p = tmap.getMapSize();
  x = p.x/2;
  y = p.y/2;
}

let positionCharacter;
function mainMovement() {
  if (kb.presses('up')){
    character.sprite.vel.x = 0;
    character.sprite.vel.y = -speedCharacter;
    positionCharacter = 'up';
  } 
  else if (kb.presses('down')){ 
    character.sprite.vel.y = speedCharacter;
    character.sprite.vel.x = 0;
    positionCharacter = 'down';
  }
  else if (kb.presses('right')) {
    character.sprite.vel.x = speedCharacter;
    character.sprite.vel.y = 0;
    positionCharacter = 'right';
  }
  else if (kb.presses('left')){ 
    character.sprite.vel.x = -speedCharacter;
    character.sprite.vel.y = 0;
    positionCharacter = 'left';
  }
  else {
    character.sprite.vel.y = 0;
    character.sprite.vel.x = 0;
  }

  if (kb.presses('up')){ 
    character.sprite.changeAni('walkUp');
  }else if (kb.presses('down')) {
    character.sprite.changeAni('walkDown');
  }else if (kb.presses('right')){
    character.sprite.changeAni('walkRight');
    character.sprite.mirror.x = false;
  }else if (kb.presses('left')){
    character.sprite.changeAni('walkRight');
    character.sprite.mirror.x = true;
  }else{

}
}


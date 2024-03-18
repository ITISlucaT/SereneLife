const aniDelay = 5;
// Funzione per gestire la raccolta delle risorse
function farm() {
    // Imposta il ritardo dell'animazione di raccolta
    aniFarmDown.frameDelay = aniDelay;
    aniFarmUp.frameDelay = aniDelay;
    aniFarmRight.frameDelay = aniDelay;


    if (positionCharacter == 'up'){
      character.sprite.changeAni('farmUp');
    }else if (positionCharacter == 'right'){
      character.sprite.changeAni('farmRight');
    }else if (positionCharacter == 'left'){
      character.sprite.changeAni('farmRight');
    }else{
      character.sprite.changeAni('farmDown');
    }
    // Incrementa il conteggio totale delle risorse raccolte
    character.totalPick++;
    
}
  

/**
 * Restituisce una matrice 2D che rappresenta le caselle intorno al personaggio.
 * @returns {number[][]} Una matrice 2D di indici delle caselle.
 */
function catchAreaAroundCharacter(){
  
    let tileSize = Number(tmap.getTileSize().x);//NOTA:castare a number in quanto tmap.getTileSize() restituisce un p5.Vector
    let tiles = [[], [], []];
  
    tiles[0][0]= tmap.getTileIndex(level, round(x-tileSize), round(y-tileSize));
    tiles[0][1]= tmap.getTileIndex(level, round(x), round(y-tileSize));
    tiles[0][2] = tmap.getTileIndex(level, round(x+tileSize), round(y-tileSize));
    
    tiles[1][0] = tmap.getTileIndex(level, round(x-tileSize), round(y));
    tiles[1][1]= tmap.getTileIndex(level, round(x), round(y));
    tiles[1][2]  = tmap.getTileIndex(level, round(x+tileSize), round(y));
    
    tiles[2][0] = tmap.getTileIndex(level, round(x-tileSize), round(y+tileSize));
    tiles[2][1] = tmap.getTileIndex(level, round(x), round(y+tileSize));
    tiles[2][2] = tmap.getTileIndex(level, round(x+tileSize), round(y+tileSize));
    
  
    //console.log(tiles);
    return tiles;
  }
/**
 * Enumerazione che rappresenta diversi tipi di risorse.
 */
const Resources = {
    WOOD: 0,
    MINERALS: 1,
    FISHES: 2,
  };
  
//da implementare per riconoscere quale risorsa sta venendo raccolta
/**
 * Riconosce e processa le risorse in base alle caselle fornite.
 * @param {number[][]} caselle - Una matrice 2D di indici delle caselle.
 */

function recognizeResources(tiles){
    for (let i = 0; i < tiles.length; i++){
      for (let j = 0; j < tiles[i].length; j++){
        //if (())
}}}
/**
 * Verifica se ci sono risorse vicino al personaggio.
 * @returns {boolean} True se ci sono risorse vicino, altrimenti False.
 */
function isNearResources(){
    tiles = catchAreaAroundCharacter();
    for (var i = 0; i < tiles.length; i++)
      for (var j = 0; j< tiles[i].length; j++)
        if (tiles[i][j] != 0){
          //console.log("resource found");
          return true;
        }
    return false;
  }

let timerNotNearAResource = 0;
/**
 * Gestisce le risorse in base al risultato fornito.
 * @param {boolean} result - True se ci sono risorse vicino, altrimenti False.
 */
function understandResources(result){
   // result = isNearResources()
    if(result){
    getRandomResources(Resources.MINERALS)
} else {
  
}
}
/**
 * Genera risorse casuali in base al tipo specificato.
 * @param {number} Resources - Il tipo di risorsa (vedi enumerazione Resources).
 */
const WOOD_MOLTIPLICATOR = 5, MINERALS_MOLTIPLICATOR = 2, FISHES_MOLTIPLICATOR = 7;
function getRandomResources(typeOfResource){
let generatedResources;
if (typeOfResource == Resources.WOOD){
    generatedResources = Math.floor(Math.random()*WOOD_MOLTIPLICATOR)
    character.resource.wood += generatedResources;
    totalResourcesFarmed += generatedResources;
}else if (typeOfResource == Resources.MINERALS){
    generatedResources = Math.floor(Math.random()* MINERALS_MOLTIPLICATOR);
    character.resource.minerals += generatedResources;
    totalResourcesFarmed += generatedResources;
}else{
    generatedResources = Math.floor(Math.random()* FISHES_MOLTIPLICATOR);
    character.resource.fishes += generatedResources;
    totalResourcesFarmed += generatedResources;
}
}
/**
 * Vende le risorse (da modificare se si vogliono distinguere i tipi di risorse).
 */
function sellResources(){//da cambiare se voglio distinguere le risorse
    if(character.resource.wood > 0 || character.resource.minerals > 0  || character.resource.fishes > 0){
        moneySnd.play(); 
        character.sellWood();
        character.sellMinerals();
        character.sellFishes();
    }
}
/**
 * Acquista nuove case (livelli) se hai abbastanza denaro.
 */
function buyHouses(){
if (character.getGold() >= levels.houses[level-1].price){
    character.setGold(character.getGold() - levels.houses[level-1].price);
    level += 1;
    levelUpSound.play();
}else{
    showError = true;
}
}
  
/**
 * Disegna il layer corrispondente al livello (Leggi il readMe per le specifiche)
 */
function generateNewItem(){
    tmap.drawLayer(0, x, y);
    tmap.drawLayer(level, x, y);
}
  
/**
 * Funzione di debug per visualizzare informazioni sulla mappa e il personaggio.
 */
function debug() {
    // Mostra istruzioni di movimento e altre informazioni
    text("ADWS per muoverti, C per cambiare mappa, L per limitare il movimento", 10, 50);
    text("Centro: Coordinate mappa: " + round(x * 100) / 100 + ", " + round(y * 100) / 100, 10, 100);
    text("Centro: Coordinate canvas: " + round(tmap.mapToCanvas(x, y).x * 100) / 100 + ", " + round(tmap.mapToCanvas(x, y).y * 100) / 100, 10, 150);
    text("Centro: Coordinate personaggio: " + round(character.sprite.x * 100) / 100 + ", " + round(character.sprite.y * 100) / 100, 10, 200);
    text("Centro: Coordinate telecamera: " + round(tmap.camToMap(x, y).x * 100) / 100 + ", " + round(tmap.camToMap(x, y).y * 100) / 100, 10, 300);
    text("Indice casella sopra: " + tmap.getTileIndex(0, int(round(x)), int(round(y))), 10, 250);
  
    // Mostra le coordinate delle caselle sulla mappa
    textSize(8);
    for (let nx = 0; nx < mapSize.x; nx++) {
      for (let ny = 0; ny < mapSize.y; ny++) {
        const p = tmap.mapToCam(createVector(nx, ny));
        ellipse(p.x, p.y, 4, 4);
        text(nx + "," + ny, p.x, p.y);
      }
    }
  }
  
/**
 * Calcola il reddito passivo in base al livello corrente.
 */
function passiveIncome(){
    if (level == 1){
        incomePerSecond = 10
    }else if (level == 2){
        incomePerSecond = 20
    }else if (level == 3){
        incomePerSecond = 30
    }else if (level == 4) incomePerSecond = 50
    else if (level == 5) incomePerSecond = 80
    else if (level >= 6) incomePerSecond = 120
    if (!isPaused)
    character.resource.gold += incomePerSecond;
}
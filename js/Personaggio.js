
/**
 * Classe rappresentante il personaggio principale del videogioco
 * @class
 */
let aniFarmUp, aniFarmDown, aniFarmRight;
class Personaggio {
    /**
     * Costruttore della classe Personaggio.
     * @constructor
     */
    constructor() {
        /**
         * Oggetto Sprite associato al personaggio. (la classe Sprite è un estensione della classe p5, presente in p5play, offre diversi modi per gestire animazioni e collider)
         * per la documentazione ufficiale: https://p5play.org/learn/index.html
         * @type {Sprite}
         */
        this.sprite = new Sprite();
        this.resource = new Risorse();
        this.sprite.x = windowWidth /2 - tmap.getTileSize().x;
        this.sprite.y = windowHeight /2 - tmap.getTileSize().y;
        this.prevX = this.sprite.x; //per gestire collisioni
        this.prevY = this.sprite.y;
        this.totalPick = 0;
        this._caricaAnimazioni();
    }

    /**
     * Metodo interno per caricare le animazioni del personaggio.
     * Usa il metodo addAni(nomeAnimazione, pathFile, nFileDaInserireNellAnimazione) presente nella classe Sprite per caricare in cache un set di immagini da gestire come animazione
     * @private
     */
    _caricaAnimazioni() {
        this.sprite.addAni('walkDown', '../data/character/ch_down1.png', 6);
        this.sprite.addAni('walkUp', '../data/character/ch_up1.png', 6);
        this.sprite.addAni('walkRight', '../data/character/ch_right1.png', 4);
        //this.sprite.addAni('walkLeft', '../data/character/1_ch_left1.png', 2);
        this.sprite.addAni('standDown', '../data/character/ch_standDown.png');
        this.sprite.addAni('standRight', '../data/character/ch_standRight.png');
        this.sprite.addAni('standUp', '../data/character/ch_standUp.png');
        aniFarmUp=this.sprite.addAni('farmUp', '../data/character/ch_farmUp1.png', 4);
        aniFarmDown=this.sprite.addAni('farmDown', '../data/character/ch_farmDown1.png', 4);
        aniFarmRight=this.sprite.addAni('farmRight', '../data/character/ch_farmRight1.png', 4);
    }

    setGold(gold) {
        this.resource.gold = gold;
    }
    getGold() {
        return this.resource.gold
    }
    sellWood(){
        while(this.resource.wood > 0){
            this.resource.gold += 1;
            this.resource.wood -= 1;
        }
    }
    sellMinerals(){
        while(this.resource.minerals > 0){
            this.resource.gold += 2;
            this.resource.minerals -= 1;
        }
    }
    sellFishes(){
        while(this.resource.fishes > 0){
            this.resource.gold += 0.5;
            this.resource.fishes -= 1;
        }
    }
}

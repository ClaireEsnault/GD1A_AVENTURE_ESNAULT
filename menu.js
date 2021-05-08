class Menu extends Phaser.Scene {
    constructor()
{
        super("Menu");
}


//chargement de l'image
preload()
{
    this.load.image('menu', 'assets/menu.png');

}


    create()
{
    this.add.image(640, 360, 'menu');

}
    update()
{

}

}
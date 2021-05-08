class Scene2 extends Phaser.Scene {
    constructor()
{
        super("Scene2");
}


//chargement de l'image
preload()
{
        this.load.image('mon_tileset', 'assets/mon-tileset.png');
        this.load.tilemapTiledJSON('map_scene1', 'map_scene1.json');
        this.load.spritesheet('dude', 'assets/spritesheet_perso.png', {frameWidth: 64, frameHeight: 64});
        this.load.image('orbe', 'assets/orbe.png');


}


    create()
{
        this.map = this.make.tilemap({ key: 'map_scene1' });
        this.tileset = this.map.addTilesetImage('tileset_def', 'mon_tileset');
        this.sol = this.map.createStaticLayer('sol', this.tileset, 0, 0);
        this.objets = this.map.createDynamicLayer('objets', this.tileset, 0, 0);
        this.murs = this.map.createDynamicLayer('murs', this.tileset, 0, 0);
    
        this.player = this.physics.add.sprite(500, 150, 'dude');
        this.player.direction = 'down';
        this.player.setCollideWorldBounds(true);
    
        this.physics.add.collider(this.player, this.objets);
        this.physics.add.collider(this.player, this.murs);
        this.objets.setCollisionByProperty({collides:true});
        this.murs.setCollisionByProperty({collides:true});
    
        this.groupeBullets = this.physics.add.group();
        this.boutonFeu = this.input.keyboard.addKey('space');
        this.cursors = this.input.keyboard.createCursorKeys();

this.paddleConnected=false;

        this.input.gamepad.once('connected', function (pad) {
            this.paddleConnected = true;
            this.paddle = pad;
            });
    
            this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 8, end: 15 }),
            frameRate: 10,
        });

        this.anims.create({
            key: 'face',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 7 }),
            frameRate: 10,
        });
        
        this.anims.create({
            key: 'dos',
            frames: this.anims.generateFrameNumbers('dude', { start: 16, end: 24 }),
            frameRate: 10,
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 25, end: 33 }),
            frameRate: 10,
        });

        this.anims.create({
            key: 'reste_right',
            frames: [ {key: 'dude', frame: 25}],
        });

        this.anims.create({
            key: 'reste_left',
            frames: [{key: 'dude', frame: 8}],
        });

        this.anims.create({
            key: 'reste_face',
            frames: [{key: 'dude', frame: 2}],
        }); 

        this.anims.create({
            key: 'reste_dos',
            frames: [{key: 'dude', frame: 18}],
        });
    
        this.cameras.main.setBounds(0, 0, 1920, 1080);
        this.cameras.main.setSize(1280, 720);
        this.cameras.main.startFollow(this.player);
    
}
    update()
{
    
let pad = Phaser.Input.Gamepad.Gamepad;

        if(this.input.gamepad.total){   //Si une manette est connecté
            pad = this.input.gamepad.getPad(0);  //pad récupère les inputs du joueur
        }
        
    if (this.cursors.left.isDown || pad.left)
    {
        this.player.direction = 'left';
        this.player.setVelocityX(-300);
        this.player.anims.play('left', true);
        
    }
    else if (this.cursors.right.isDown || pad.right)
    {
        
        this.player.direction = 'right';
        this.player.setVelocityX(300);
        this.player.anims.play('right', true);

    }
    else
    {
        
        this.player.setVelocityX(0);
        
        if(this.player.direction == 'left'){
            this.player.anims.play('reste_left', true);
        }
        
        else if (this.player.direction == 'right'){
            this.player.anims.play('reste_right', true);
        }
  
    }
    
    if(this.cursors.up.isDown || pad.up)
    {
        this.player.direction = 'up';    
        this.player.setVelocityY(-300);
        this.player.anims.play('dos', true);
    
    }
    
        
    else if (this.cursors.down.isDown || pad.down)
    {
        
        this.player.direction = 'down';
        this.player.setVelocityY(300);
        this.player.anims.play('face', true);
    }
        
    else
    {
        
        this.player.setVelocityY(0);
        if (this.player.direction == 'up'){
            this.player.anims.play('reste_dos', true);
        }
        
        else if (this.player.direction == 'down'){
            this.player.anims.play('reste_face', true);
        } 
        
    }

    if (Phaser.Input.Keyboard.JustDown(this.boutonFeu)|| pad.A) {
        if(Tir == true){
            this.tirer(this.player);
        }
    }

}

    
        tirer(player) {
	    var coefDirX;
        var coefDirY;
        if (this.player.direction == 'left') { coefDirX = -1; } else if(this.player.direction == 'right') { coefDirX = 1 } else {coefDirX = 0}
        if (this.player.direction == 'up') {coefDirY = -1;} else if(this.player.direction == 'down') {coefDirY = 1} else {coefDirY =0}
        // on crée la balle a coté du joueur
        var bullet = this.groupeBullets.create(this.player.x + (25 * coefDirX), this.player.y - 4 , 'orbe');
        // parametres physiques de la balle.
        bullet.setCollideWorldBounds(false);
        bullet.body.allowGravity =false;
        bullet.setVelocity(1000 * coefDirX, 1000 * coefDirY); // vitesse en x et en y
    }
    
} // FIN DE LA SCENE
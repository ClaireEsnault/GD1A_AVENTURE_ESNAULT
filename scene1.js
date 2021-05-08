class Scene1 extends Phaser.Scene {
    constructor()
{
        super("Scene1");
}


//chargement de l'image
preload()
{
        this.load.image('mon_tileset', 'assets/mon-tileset.png');
        this.load.tilemapTiledJSON('map_scene2', 'map_scene2.json');
        this.load.spritesheet('dude', 'assets/spritesheet_perso.png', {frameWidth: 64, frameHeight: 64});
        this.load.image('clef_grise', 'assets/clef_grise.png');
        this.load.image('orbe', 'assets/orbe.png');
        this.load.image('ennemi', 'assets/ennemi.png');
        this.load.image('clef_jaune', 'assets/clef_jaune.png');
        this.load.image('super_orbe', 'assets/super_orbe.png');
        this.load.image('bloc', 'assets/bloc_collider.png');
        this.load.image('potion', 'assets/potion.png');
}


    create()
{
        this.map = this.make.tilemap({ key: 'map_scene2' });
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

        this.clef_grise = this.physics.add.image(175,945, 'clef_grise');
        this.groupeBullets = this.physics.add.group();
        this.boutonFeu = this.input.keyboard.addKey('space');
        this.ennemi = this.physics.add.image(950, 1000, 'ennemi');
        this.bloc = this.physics.add.image(1795, 990, 'bloc');
        this.potion = this.physics.add.image(1800, 300, 'potion');

        var tween = this.tweens.add({
        targets: this.ennemi,
        x: 1100,
        duration: 2500,
        yoyo: true,
        repeat: -1,
        flipX: true,
        onStart: function () { console.log('onStart'); console.log(arguments); },
        onComplete: function () { console.log('onComplete'); console.log(arguments); },
        onYoyo: function () { console.log('onYoyo'); console.log(arguments); },
        onRepeat: function () { console.log('onRepeat'); console.log(arguments); },
    });
    
        this.cursors = this.input.keyboard.createCursorKeys();
        this.orbe = this.physics.add.group();
        this.superOrbe = this.physics.add.group();
        this.clef_jaune = this.physics.add.group();

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
    
    this.physics.add.overlap(this.player, this.clef_grise, this.getClef, null, this);
    this.physics.add.overlap(this.player, this.orbe, this.getOrbe, null, this);
    this.physics.add.overlap(this.player, this.ennemi, this.hitEnnemi, null,this);
    this.physics.add.overlap(this.groupeBullets, this.ennemi, this.Hit, null, this);
    this.physics.add.overlap(this.player, this.clef_jaune, this.getClefJaune, null, this);
    this.physics.add.overlap(this.player, this.superOrbe, this.getSuperOrbe, null, this);
    this.physics.add.overlap(this.player, this.bloc, this.hitBloc, null, this);
    this.physics.add.overlap(this.player, this.potion, this.getPotion, null, this);
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
    
    if(vie == 0){
        this.physics.pause();
        game_over = true;
    }

} // FIN UPDATE
    
     getClef(player, clef_grise){
        this.clef_grise.disableBody(true, true);
        this.map.removeTileAt(16, 1, true, true, 2);
        this.map.removeTileAt(17, 1, true, true, 2);
        this.map.removeTileAt(18, 1, true, true, 2);
        this.map.removeTileAt(16, 2, true, true, 2);
        this.map.removeTileAt(17, 2, true, true, 2);
        this.map.removeTileAt(18, 2, true, true, 2);
        var orbe1 = this.orbe.create(600, 85, 'orbe');

    }
    
    getOrbe(player, orbe1){
        orbe1.disableBody(true, true);
        Tir = true;
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
    
    hitEnnemi(player, ennemi){
     
    if (!invulnerabilite){
        vie -= 1;
        invulnerabilite = true;
        
        if(vie > 0){
            this.clignotement = this.time.addEvent({ delay : 200, repeat: 9, callback: function(){this.player.visible = !this.player.visible;}, callbackScope: this});
        }
        
        this.tempsInvulnerabilite = this.time.addEvent({ delay : 2000, callback: function(){invulnerabilite = false}, callbackScope: this});
    }

}
    
        Hit (bullet, ennemi) {
        bullet.destroy();
        var clef_jaune1 = this.clef_jaune.create(ennemi.x, ennemi.y, 'clef_jaune');
        this.ennemi.destroy();
    }
    
     getClefJaune(player, clef_jaune1){
        clef_jaune1.disableBody(true, true);
        this.map.removeTileAt(34, 27, true, true, 2);
        this.map.removeTileAt(35, 27, true, true, 2);
        this.map.removeTileAt(36, 27, true, true, 2);
        this.map.removeTileAt(34, 28, true, true, 2);
        this.map.removeTileAt(35, 28, true, true, 2);
        this.map.removeTileAt(36, 28, true, true, 2);
        var superOrbe1 = this.superOrbe.create(1150, 945, 'super_orbe');

    }
    
    getSuperOrbe(player, superOrbe1){
        superOrbe1.disableBody(true, true);
        this.map.removeTileAt(53, 27, true, true, 1);
        this.map.removeTileAt(54, 27, true, true, 1);
        this.map.removeTileAt(55, 27, true, true, 1);
        this.map.removeTileAt(53, 28, true, true, 1);
        this.map.removeTileAt(54, 28, true, true, 1);
        this.map.removeTileAt(55, 28, true, true, 1);
        
    }
    
    hitBloc(player, bloc){
        this.scene.start('Scene2');
    }
    
    getPotion(player, potion){
        vie += 1;
        if(vie >= 3){
            vie = 3;
        }
        this.potion.disableBody(true, true);       
    }
}// FIN SCENE
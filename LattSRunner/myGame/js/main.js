//game screen size
var game = new Phaser.Game(800, 600, Phaser.AUTO); 

//global variables
var cursors = null;
var score = 0;
var scoreText;
var dog;
var foodTime;
var newFood;
var food = [];
var arrayNumber;
var screen = [];
var sushi;  
var burger;
var cheese;
var pasta;
var pizza;
var salad;
var taco;
var chocolate;
var sprite;
var sprite1;
var sprite2;
var sprite3;
var row = [];
var row0;
var row1;
var row2;
var heart0;
var heart1;
var heart2;
var i = 0;
var random;
var chocolateTime;
var cSpawn;

// define MainMenu state and methods
var MainMenu = function(game) {};
MainMenu.prototype = {
	preload: function() {
		game.load.image('start', 'assets/img/start.png');
	},
	create: function() {
		game.scale.pageAlignHorizontally = true;
		var start = game.add.sprite(0, 0, 'start');
	},
	update: function() {
		// main menu logic
		if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
			game.state.start('Instructions');
		}
	}
}

// define instruction state and methods
var Instructions = function(game) {};
Instructions.prototype = {
	preload: function() {
		game.load.image('instruction1', 'assets/img/instruction1.png');
	},
	create: function() {
		var instruction = game.add.sprite(0, 0, 'instruction1');
	},
	update: function() {
		// instructions logic
		if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
			game.state.start('GamePlay');
		}
	}
}

// define GamePlay state and methods
var GamePlay = function(game) {};
GamePlay.prototype = {

	preload: function() {
		console.log('GamePlay: preload');
//audio
		game.load.audio('song', 'assets/audio/song.mp3');
		game.load.audio('beep', 'assets/audio/tone1.mp3');
		game.load.audio('bark', 'assets/audio/dog.m4a');
//images
		game.load.image('chocolate', 'assets/img/chocolate.png');
		game.load.image('heart', 'assets/img/heart.png');
		game.load.image('line', 'assets/img/line.png');
		game.load.image('belt1', 'assets/img/belt1.png');
		game.load.image('bkrd', 'assets/img/bkrd.png');
//texture atlas
		game.load.atlas('Food', 'assets/img/Food1.png', 'assets/img/Food1.json');
//sprites
		game.load.spritesheet('dog', 'assets/img/dog.png', 358, 382);
	},

	create: function() {

//import packages

	    	cursors = game.input.keyboard.createCursorKeys();
		game.physics.startSystem(Phaser.Physics.ARCADE);
//audio
		this.song = game.add.audio('song');
		this.song.play('', 0, 1, true);
		this.beep = game.add.audio('beep');
		this.bark = game.add.audio('bark');

//background
		var belt = game.add.sprite(0, 0, 'belt1');

		i = 0;
		score = 0;
		foodTime = 200;
		chocolateTime = 200;
		cSpawn = 5000;

//conveyer belt lines start here
	
		sprite = game.add.sprite(game.world.centerX, 20, 'line');
		sprite.scale.setTo(5, 1);
		sprite.anchor.set(0.5);
		
		sprite1 = game.add.sprite(game.world.centerX, 165, 'line');
		sprite1.scale.setTo(5, 1);
		sprite1.anchor.set(0.5);
		
		sprite2 = game.add.sprite(game.world.centerX, 310, 'line');
		sprite2.scale.setTo(5, 1);
		sprite2.anchor.set(0.5);

		sprite3 = game.add.sprite(game.world.centerX, 455, 'line');
		sprite3.scale.setTo(5, 1);
		sprite3.anchor.set(0.5);
		
//conveyer belt lines end here
		
//yellow cover up
		game.add.sprite(0, 0, 'bkrd');

//array of food
		food = [ 'burger.png', 'cheese.png', 'pasta.png', 'pizza.png', 'salad.png', 'sushi1.png'];
		newFood = game.add.group();
		newFood.enableBody = true;
		game.time.events.loop(2000, makeFood);

//chocolate stuff
		chocolate = game.add.group();
		chocolate.enableBody = true;
		chocolate.scale.setTo(0.6, 0.6);
		game.time.events.loop(cSpawn, makeChocolate);

//dog stuff
		dog = game.add.group();
		dog.enableBody = true;
		dog = game.add.sprite(game.world.width - 490, game.world.height - 250, 'dog');
		dog.scale.setTo(0.5, 0.5);
		var run = dog.animations.add('run');
		dog.animations.play('run', 10, true);
		game.physics.arcade.enable(dog);
		dog.body.setSize(150, 300, 100, 50);
		dog.body.collideWorldBounds = true;

//heart
		hearts = game.add.group();
		hearts.enableBody = true;

		heart0 = hearts.create(650, 20, 'heart');

		heart1 = hearts.create(700, 20, 'heart');

		heart2 = hearts.create(750, 20, 'heart');
		
		heart = [heart0, heart1, heart2];

//score tracking
		scoreText = game.add.text(16, 16, 'Score: ' + score, { fontSize: '24px', fill: '#000' });
	},

	update: function() {
		arrayNumber = game.rnd.integerInRange(0, food.length-1);
		
//moving left
		if(cursors.left.isDown){
			dog.x = 51.6;
		}

//moving right
		else if(cursors.right.isDown){
			dog.x = 564.16;
		}
		
//center when no arrows are clicked

		else{
			dog.x = 310;
		}

//collect food
		game.physics.arcade.overlap(dog, newFood, collectFood, null, this);
		
		function collectFood (dog, f) {
			f.kill();
			this.beep.play('', 0, 0.5, false);
			score += 5;
			scoreText.text = 'Score: ' + score;
		};

//collect chocolate

		game.physics.arcade.overlap(dog, chocolate, collectChocolate, null, this);
	
		function collectChocolate (dog, c) {
			c.destroy();
			this.bark.play('', 0, 1, false);
			i++;
			if (i == 1){ 
				heart2.kill();
				//this.bark.play('', 0, 1, false);
			}
			else if (i == 2){
				heart1.kill();
				//this.bark.play('', 0, 1, false);
			}
			else if (i == 3){
				heart0.kill();
				//this.bark.play('', 0, 1, false);
			}
			//console.log('eating');
		};

//check last heart
		if(i == 3){
			game.state.start('GameOver');
		}

		if(i == 1){
			chocolateTime = 300;
			foodTime = 300;
			cSpawn = 2000;
		}

		if(i == 2){
			chocolateTime = 400;
			foodTime = 400;
		}

//lines moving
		sprite.y += 3;
		if(sprite.y >= game.height){
			sprite.kill();
			sprite.reset(game.world.centerX, 30);
		}

		sprite1.y += 3;
		if(sprite1.y >= game.height){
			sprite1.kill();
			sprite1.reset(game.world.centerX, 30);
		}

		sprite2.y += 3;
		if(sprite2.y >= game.height){
			sprite2.kill();
			sprite2.reset(game.world.centerX, 30);
		}

		sprite3.y += 3;
		if(sprite3.y >= game.height){
			sprite3.kill();
			sprite3.reset(game.world.centerX, 30);
		}

	//	if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) { 
	//		game.state.start('GameOver');
	//	}	
	}

}
function makeChocolate(){
	random = game.rnd.integerInRange(1, 3);
		if(random == 1){
			c = chocolate.create(320, 30, 'chocolate');
			c.scale.setTo(0.6, 0.6);
			c.body.setSize(75, 93);
			c.body.velocity.y = chocolateTime;
			c.body.velocity.x = -50;
		}
		if(random == 2){
			c = chocolate.create(630, 30, 'chocolate');
			c.scale.setTo(0.6, 0.6);
			c.body.setSize(75, 93);
			c.body.velocity.y = chocolateTime;	
		}
		if(random == 3){
			c = chocolate.create(900, 30, 'chocolate');
			c.scale.setTo(0.6, 0.6);
			c.body.setSize(75, 93);
			c.body.velocity.y = chocolateTime;	
			c.body.velocity.x = 50;
		}
}

function makeFood(){
	random = game.rnd.integerInRange(1,3);
	if(random == 1){
		f = newFood.create(160, 30, 'Food', food[arrayNumber]);
		f.scale.setTo(0.6, 0.6);
		f.body.velocity.y = foodTime;
		f.body.velocity.x = -50;
		f.body.setSize(100, 100, 50);
	}
	if(random == 2){
		f = newFood.create(350, 30, 'Food', food[arrayNumber]);
		f.scale.setTo(0.6, 0.6);
		f.body.velocity.y = foodTime;	
		f.body.setSize(100, 100, 50);
	}
	if(random == 3){
		f = newFood.create(530, 30, 'Food', food[arrayNumber]);
		f.scale.setTo(0.6, 0.6);
		f.body.velocity.y = foodTime;	
		f.body.velocity.x = 50;
		f.body.setSize(100, 100, 50);
	}
}

// define GameOver state and methods
var GameOver = function(game) {};
GameOver.prototype = {
	preload: function() {
		game.load.image('gameover1', 'assets/img/gameover1.png');
	},
	create: function() {
		game.add.sprite(0, 0, 'gameover1');
		game.sound.stopAll();
		scoreText = game.add.text(450, 125, score, { fontSize: '50px', fill: '#black' });
	},
	update: function() {
		// GameOver logic
		if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
			game.state.start('MainMenu');
		}
	}
}

// add states to StateManager and start MainMenu
game.state.add('MainMenu', MainMenu);
game.state.add('Instructions', Instructions);
game.state.add('GamePlay', GamePlay);
game.state.add('GameOver', GameOver);
game.state.start('MainMenu');

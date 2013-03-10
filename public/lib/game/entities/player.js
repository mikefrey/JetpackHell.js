ig.module(
	'game.entities.player'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityPlayer = ig.Entity.extend({
	size: {x: 8, y:14},
	offset: {x: 4, y: 2},
	gravityFactor: 0,

	correctionMultiplier: 1.2,

	maxVel: {x: 200, y:100 },
	friction: {x: 200, y: 0},

	type: ig.Entity.TYPE.A,
	checkAgainst: ig.Entity.TYPE.NONE,
	collides: ig.Entity.COLLIDES.PASSIVE,

	animSheet1: new ig.AnimationSheet( 'media/character_with_legs.png', 16, 24 ),
	animSheet2: new ig.AnimationSheet( 'media/character_attacking.png', 16, 24 ),

	flip: false,
	accelHoriz: 500,
	health: 10,

	init: function( x, y, settings ) {
		this.parent( x, y, settings )

		// Add the animations
		this.setAnimationSheet();
	},

	setAnimationSheet: function() {
		this.anims.idle = new ig.Animation( this.animSheet1, 1, [0] );
		this.anims.fly = new ig.Animation( this.animSheet1, 0.07, [1,2]);
		this.anims.attack = new ig.Animation( this.animSheet2, 5, [0,1,2], true);
	},

	update: function() {
		this.pos.y = ig.game.screen.y + ((ig.system.height/ 3) * 2)
		// no vertical acceleration
		this.accel.y = 0

		this.vel.y = -ig.game.scrollSpeed

		// correct the players vertical height on the screen
		var target = ig.game.screen.y + (ig.system.height/3)*2
		if (this.pos.y > target) this.vel.y *= this.correctionMultiplier

		// move left or right
		if( ig.input.state('left')) {
			this.accel.x = -this.accelHoriz
			this.flip = true
		}
		else if( ig.input.state('right') ) {
			this.accel.x = this.accelHoriz
			this.flip = false
		}
		else {
			this.accel.x = 0;
		}

		this.currentAnim = this.anims.fly

		// shoot
		if( ig.input.pressed('shoot') ) {
			var x = this.pos.x + (this.flip ? -18 : 6 );
			var y = this.pos.y + 6;
			this.currentAnim = this.anims.attack;
			ig.game.spawnEntity( EntitySword, x+1, y-14, {flip:this.flip, owner: this} );
		}

		this.currentAnim.flip.x = this.flip;

		// move!
		this.parent();
	},

	handleMovementTrace: function( res ) {
		this.parent(res);

	}

});

EntitySword = ig.Entity.extend({
	size: {x: 24, y: 32},
  owner: null,

	type: ig.Entity.TYPE.NONE,
	checkAgainst: ig.Entity.TYPE.B,
	collides: ig.Entity.COLLIDES.NONE,

	animSheet: new ig.AnimationSheet( 'media/swing_full.png', 24, 32 ),

	init: function( x, y, settings ) {
		this.parent( x, y, settings );

		this.addAnim( 'swing', 0.07, [0,1,2], true );
		this.currentAnim.flip.x = settings.flip;
	},

	update: function() {
    var x_offset = this.owner.flip ? -23 : 7.5;
    this.pos.x = this.owner.pos.x + x_offset;
    this.pos.y = this.owner.pos.y - 3.5;

		if (this.currentAnim.loopCount) return this.kill();
    this.animationRun = 1;
		this.parent();
	},

	handleMovementTrace: function( res ) {
		this.parent( res );
		if( res.collision.x || res.collision.y ) {
			// this.kill();
		}
	},

	// This function is called when this entity overlaps anonther entity of the
	// checkAgainst group. I.e. for this entity, all entities in the B group.
	check: function( other ) {
		other.receiveDamage( 10, this );
		this.kill();
	}

});

});

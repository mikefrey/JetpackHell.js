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

	maxVel: {x: 200, y:100 },
	friction: {x: 200, y: 0},

	type: ig.Entity.TYPE.A,
	checkAgainst: ig.Entity.TYPE.NONE,
	collides: ig.Entity.COLLIDES.PASSIVE,

	animSheet: new ig.AnimationSheet( 'media/player.png', 16, 24 ),

	flip: false,
	accelHoriz: 400,
	health: 10,

	init: function( x, y, settings ) {
		this.parent( x, y, settings )

		// Add the animations
		this.addAnim( 'idle', 1, [0] )
		this.addAnim( 'fly', 0.07, [1,2] )
	},


	update: function() {
		// no vertical acceleration
		this.accel.y = 0

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
			var x = this.pos.x + (this.flip ? -6 : 6 );
			var y = this.pos.y + 6;
			ig.game.spawnEntity( EntityProjectile, x, y, {flip:this.flip} );
		}

		// set the current animation, based on the player's speed
		// if( this.vel.y < 0 ) {
		// 	this.currentAnim = this.anims.jump;
		// }
		// else if( this.vel.y > 0 ) {
		// 	this.currentAnim = this.anims.fall;
		// }
		// else if( this.vel.x != 0 ) {
		// 	this.currentAnim = this.anims.run;
		// }
		// else {
		// 	this.currentAnim = this.anims.idle;
		// }

		this.currentAnim.flip.x = this.flip;

		// move!
		this.parent();
	},

	handleMovementTrace: function( res ) {
		this.parent(res);

	}

});


EntityProjectile = ig.Entity.extend({
	size: {x: 8, y: 4},
	maxVel: {x:400, y:0},

	ttl: 5,
	ttlTimer: null, // time to live timer

	type: ig.Entity.TYPE.NONE,
	checkAgainst: ig.Entity.TYPE.B,
	collides: ig.Entity.COLLIDES.PASSIVE,

	animSheet: new ig.AnimationSheet( 'media/projectile.png', 8, 4 ),

	init: function( x, y, settings ) {
		this.parent( x, y, settings );

		this.addAnim( 'idle', 1, [0] );
		this.currentAnim.flip.x = settings.flip;

		this.vel.x = (settings.flip ? -this.maxVel.x : this.maxVel.x)
		this.vel.y = 0

		this.ttlTimer = new ig.Timer()
		this.ttlTimer.set(this.ttl)
	},

	update: function() {
		if (this.ttlTimer.delta() > 0)
			return this.kill()

		this.parent()
	},

	handleMovementTrace: function( res ) {
		this.parent( res );
		if( res.collision.x || res.collision.y ) {
			this.kill();
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

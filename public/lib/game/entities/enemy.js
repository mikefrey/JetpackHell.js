ig.module(
  'game.entities.enemy'
)
.requires(
  'impact.entity'
)
.defines(function(){

EntityEnemy = ig.Entity.extend({
  size: {x: 19.5, y: 26},
  offset: {x: 2, y: 0},
  gravityFactor: 0,

  maxVel: {x: 50, y: 50},
  friction: {x: 200, y: 0},

  type: ig.Entity.TYPE.B,
  checkAgainst: ig.Entity.TYPE.A,
  collides: ig.Entity.COLLIDES.PASSIVE,

  animSheet: new ig.AnimationSheet( 'media/skull.png', 24, 31 ),

  flip: true,
  accelHoriz: 500,
  health: 10,

  driftIteration: 0,

  init: function( x, y, settings ) {
    this.parent( x, y, settings )

    // Add the animations
    this.setAnimationSheet();
  },

  setAnimationSheet: function() {
    this.anims.fly = new ig.Animation( this.animSheet, 0.20, [0,1,2,1]);
  },

  update: function() {
    // no vertical acceleration
    this.accel.y = 0

    if (this.flip)
      this.vel.x = this.maxVel.x
    else
      this.vel.x = -this.maxVel.x

    this.currentAnim = this.anims.fly

    this.currentAnim.flip.x = this.flip;

    var heightDrift = (Math.PI/32) * this.driftIteration

    this.pos.y += Math.sin(heightDrift)
    this.driftIteration = this.driftIteration === 128 ? 0 : this.driftIteration + 1

    // move!
    this.parent();
  },

  handleMovementTrace: function( res ) {
    this.parent(res);
    if (res.collision.x) {
      this.flip = !this.flip
    }
  },

  kill: function() {
    var x = this.pos.x
    var y = this.pos.y
    for (var i = 0; i < 8; i++) {
      ig.game.spawnEntity(EntitySlime, x, y)
    }
    this.parent()
  }

});

EntitySlime = ig.Entity.extend({
  size: {x: 8, y: 8},
  offset: {x: 2, y: 2},
  owner: null,

  ttl: 3,
  ttlTimer: null,

  type: ig.Entity.TYPE.NONE,
  checkAgainst: ig.Entity.TYPE.NONE,
  collides: ig.Entity.COLLIDES.NEVER,

  animSheet: new ig.AnimationSheet( 'media/slime.png', 8, 8 ),

  init: function( x, y, settings ) {
    this.parent( x, y, settings );

    this.vel = {
      x: Math.floor(Math.random()*100),
      y: Math.floor(Math.random()*100)
    }

    this.addAnim( 'idle', 0.07, [0,1], false );
    this.currentAnim = this.anims.idle

    this.ttlTimer = new ig.Timer()
    this.ttlTimer.set(this.ttl)
  },

  update: function() {
    if (this.ttlTimer.delta() > 0)
      return this.kill()
    this.parent();
  }

});

});

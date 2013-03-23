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

  startY: 0,
  travelX: 0,

  init: function( x, y, settings ) {
    this.parent( x, y, settings )

    this.startY = y
    this.travelX = Math.random()*10000|0

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

    // calculate the y position
    var amplitude = 15
    var period = 0.1
    var angle = this.travelX * (Math.PI / 180)
    this.pos.y = this.startY + Math.sin(angle * period) * amplitude

    // add the current velocity to traveled x
    this.travelX += this.maxVel.x

    // move!
    this.parent();
  },

  handleMovementTrace: function( res ) {
    this.parent(res);
    if (res.collision.x) {
      this.flip = !this.flip
    }
  },

  check: function( other ) {
    other.receiveDamage( 10, this );
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
  maxVel: {x: 500, y: 500},
  owner: null,
  health: 1,

  ttl: 0.4,
  ttlTimer: null,

  type: ig.Entity.TYPE.C,
  checkAgainst: ig.Entity.TYPE.NONE,
  collides: ig.Entity.COLLIDES.NEVER,

  animSheet: new ig.AnimationSheet( 'media/slime.png', 8, 8 ),

  init: function( x, y, settings ) {
    this.parent( x, y, settings );

    this.vel = {
      x: Math.floor(Math.random()*20),
      y: Math.floor(Math.random()*20)
    }

    this.yAngleFactor = Math.floor(Math.random()*80);

    this.addAnim( 'idle', 0.07, [0,1], false );
    this.currentAnim = this.anims.idle

    this.ttlTimer = new ig.Timer()
    this.ttlTimer.set(this.ttl)
  },

  handleMovementTrace: function( res ) {
    // This completely ignores the trace result (res) and always
    // moves the entity according to its velocity
    this.pos.x += this.vel.x * ig.system.tick;
    this.pos.y += this.vel.y * ig.system.tick;
  },

  interceptFuelBar: function() {
    this.vel = {
     x: ig.game.screen.x + 0 - this.pos.x,
     y: ig.game.screen.y - this.yAngleFactor - this.pos.y
    };
    this.vel.x * this.ttlTimer.delta();
    this.vel.y * this.ttlTimer.delta();

    if (this.pos.x < ig.game.screen.x + 32 && this.pos.y < ig.game.screen.y + 56) {
      console.log("die!")
      ig.game.fuelBar.absorbDamned(this.health);
      this.kill();
    }
  },

  update: function() {
    if (this.ttlTimer.delta() > 0) {
      this.interceptFuelBar();
    }
      // return this.kill()
    this.parent();
  }

});

});

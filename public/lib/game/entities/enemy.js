ig.module(
  'game.entities.enemy'
)
.requires(
  'impact.entity'
)
.defines(function(){

EntityEnemy = ig.Entity.extend({
  size: {x: 8, y:14},
  offset: {x: 4, y: 2},
  gravityFactor: 0,

  maxVel: {x: 200, y:100 },
  friction: {x: 200, y: 0},

  type: ig.Entity.TYPE.B,
  checkAgainst: ig.Entity.TYPE.A,
  collides: ig.Entity.COLLIDES.PASSIVE,

  animSheet: new ig.AnimationSheet( 'media/character_with_legs.png', 16, 24 ),

  flip: false,
  accelHoriz: 500,
  health: 10,

  init: function( x, y, settings ) {
    this.parent( x, y, settings )

    // Add the animations
    this.setAnimationSheet();
  },

  setAnimationSheet: function() {
    this.anims.fly = new ig.Animation( this.animSheet, 0.07, [1,2]);
  },

  update: function() {
    // no vertical acceleration
    this.accel.y = 0

    this.currentAnim = this.anims.fly

    this.currentAnim.flip.x = this.flip;

    // move!
    this.parent();
  },

  handleMovementTrace: function( res ) {
    this.parent(res);
    if (res.collision.x) {
      this.flip = !this.flip
    }
  }

});

});

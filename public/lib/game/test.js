ig.module(
  'game.main'
)
.requires(
  'impact.game',
  'impact.font',
  'impact.debug.debug',

  'game.entities.testPlayer',
  'game.entities.crate',
  'game.levels.test'
)
.defines(function(){

MyGame = ig.Game.extend({

  scrollSpeed: 1,
  gravity: 100, // All entities are affected by this

  // Load a font
  font: new ig.Font( 'media/04b03.font.png' ),
  clearColor: '#1b2026',

  init: function() {
    // Bind keys
    ig.input.bind( ig.KEY.UP_ARROW, 'up' );
    ig.input.bind( ig.KEY.DOWN_ARROW, 'down' );
    ig.input.bind( ig.KEY.LEFT_ARROW, 'left' );
    ig.input.bind( ig.KEY.RIGHT_ARROW, 'right' );
    ig.input.bind( ig.KEY.X, 'jump' );
    ig.input.bind( ig.KEY.C, 'shoot' );

    if( ig.ua.mobile ) {
      ig.input.bindTouch( '#buttonLeft', 'left' );
      ig.input.bindTouch( '#buttonRight', 'right' );
      ig.input.bindTouch( '#buttonShoot', 'shoot' );
      ig.input.bindTouch( '#buttonJump', 'jump' );
    }

    // Load the LevelTest as required above ('game.level.test')
    this.loadLevel( LevelTest );
  },

  loadLevel: function( data ) {
    this.parent( data );
    for( var i = 0; i < this.backgroundMaps.length; i++ ) {
      this.backgroundMaps[i].preRender = true;
    }

    var player = this.getEntitiesByType(EntityTestPlayer)[0]
    if (player) {
      this.screen.y = player.pos.y - (ig.system.height/3)*2
    }
  },

  update: function() {

    // this.scrollSpeed += ig.system.tick * (10/this.scrollSpeed)
    // this.scrollSpeed = 30
    // this.screen.y -= ig.system.tick * this.scrollSpeed

    // don't allow the screen to go above 0 for now.
    // if (this.screen.y < 0) this.screen.y = 0

    // screen follows the player
    var player = this.getEntitiesByType(EntityTestPlayer)[0];

    if (player) {
      this.screen.x = player.pos.x - ig.system.width/2
      this.screen.y = player.pos.y - ig.system.height/2
    }

    // Update all entities and BackgroundMaps
    this.parent();
  },

  draw: function() {
    // Draw all entities and BackgroundMaps
    this.parent();

    // player position
    // var player = this.getEntitiesByType( EntityPlayer )[0];
    // if (player) ig.game.font.draw('Player vel-y: ' + player.vel.y, 2, 2 );

    // if( !ig.ua.mobile ) {
    //  this.font.draw( 'Arrow Keys, X, C', 2, 2 );
    // }
  }
});


if( ig.ua.iPad ) {
  ig.Sound.enabled = false;
  ig.main('#canvas', MyGame, 60, 240, 160, 2);
}
else if( ig.ua.mobile ) {
  ig.Sound.enabled = false;
  var width = 320;
  var height = 320;
  ig.main('#canvas', MyGame, 60, 160, 160, 1);

  var c = ig.$('#canvas');
  c.width = width;
  c.height = height;

  var pr = 2;//ig.ua.pixelRatio;
  if( pr != 1 ) {
    //~ c.style.width = (width / pr) + 'px';
    //~ c.style.height = (height / pr) + 'px';
    c.style.webkitTransformOrigin = 'left top';
    c.style.webkitTransform =
      //~ 'translate3d('+(width / (4 * pr))+'px, '+(height / (4 * pr))+'px, 0)' +
      //~ 'scale3d('+pr+', '+pr+', 0)' +
      'scale3d(2,2, 0)' +
      '';
  }
  //~ ig.system.canvas.style.width = '320px';
  //~ ig.system.canvas.style.height = '320px';
  //~ ig.$('#body').style.height = '800px';

      //~ 320
   //~ 80 480  80 // div 320/1.5 = 213
  //~ 160 640 160 // div 320/2 = 160


}
else {
  ig.main('#canvas', MyGame, 60, 500, 300, 2);
}

});

ig.module(
  'game.entities.player'
)
.requires(
  'impact.entity'
)
.defines(function(){
FuelBar = ig.Class.extend({
  fuelLevel: 0;

  init: function(x, y) {
    this.pos.x = x;
    this.pos.y = y;

    this.fuelLevel = 100;
  },

  update: function() {
    this.drawFuelLevel();
  },

  draw: function() {
    // canvas stuff here
  }
});

});
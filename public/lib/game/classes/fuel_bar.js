ig.module(
  'game.classes.fuel_bar'
)
.requires(
  // 'impact.class'
)
.defines(function(){

FuelBar = ig.Class.extend({
  fuelLevel: 0,

  init: function() {
    // this.pos.x = x;
    // this.pos.y = y;

    this.fuelLevel = 100;
  },

  updateFuelLevel: function(increase) {
    this.fuelLevel += increase;
  },

  update: function() {
    // this.drawFuelLevel();
    this.parent();
  },

  draw: function() {
    // canvas stuff here
    ig.system.context.fillStyle = "rgb(255,0,0)";
    ig.system.context.beginPath();
    ig.system.context.rect(
                    (ig.game.screen.x + 20) * ig.system.scale, 
                    (this.owner.pos.y - ig.game.screen.y - 180) * ig.system.scale, 
                    50, 
                    100
                );
    ig.system.context.closePath();
    ig.system.context.fill();
    this.parent();
  }
});

});
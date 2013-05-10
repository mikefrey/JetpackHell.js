ig.module(
  'game.classes.fuel-bar'
)
.defines(function(){

var FuelBar = ig.Class.extend({
  fuelLevel: 0,
  pos: {
    x: 100,
    y: 100
  },

  init: function() {
    this.pos.x = 100;
    this.pos.y = 100;
    console.log("fuel bar initiated!")
    this.fuelLevel = 100;
  },

  absorbDamned: function(damnedHP) {
    this.updateFuelLevel(damnedHP);
    if (this.fuelLevel > 100) this.fuelLevel = 100;
  },

  updateFuelLevel: function(increase) {
    this.fuelLevel += increase;
  },

  update: function() {
    // this.pos.x = ig.game.screen.x + 20;
    // this.pos.y = this.owner.pos.y - 10;
    if (this.fuelLevel > 0) this.fuelLevel -= 0.1;
  },

  draw: function() {
    // canvas stuff here
    // border
    ig.system.context.fillStyle = "rgb(255,255,255)";
    ig.system.context.beginPath();
    ig.system.context.rect(
                    15,
                    15,
                    52, 
                    102
                );
    ig.system.context.closePath();
    ig.system.context.fill();
    // fuel
    ig.system.context.fillStyle = "rgb(255,0,0)";
    ig.system.context.beginPath();
    ig.system.context.rect(
                    66,
                    116,
                    -50,
                    -100 * (this.fuelLevel/100)
                );
    ig.system.context.closePath();
    ig.system.context.fill();
  }
});

return fuelBar = new FuelBar();

});
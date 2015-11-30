function Gameboard(){
  this.states = ['alabama', 'arizona', 'arkansas', 'california', 'colorado', 'connecticut', 'maryland', 'dc', 'florida', 'georgia', 'idaho', 'illinois', 'indiana', 'iowa', 'kansas', 'kentucky', 'louisiana', 'maine', 'maryland', 'massachusetts', 'michigan', 'minnesota', 'mississippi', 'missouri', 'montana', 'nebraska', 'nevada', 'newhampshire', 'newjersey', 'newmexico', 'newyork', 'northcarolina', 'northdakota', 'ohio', 'oklahoma', 'oregon', 'pennsylvania', 'rhodeisland', 'southcarolina', 'southdakota', 'tennessee', 'texas', 'utah', 'vermont', 'virginia', 'washington', 'westvirginia', 'wisconsin', 'wyoming'];
  this.layers = {};
  this.stateProperties = {};
  this.bordering = {};
  this.userStates = {};
  this.vacantStates = {};
  this.enemyStates = {};
}

Gameboard.prototype.createBoard = function(map, layerColor, cb){
  var that = this;
  var layer;
  var i = 1;

  getStatesData(function(states){
    for(var state in states){
      
      //create layer
      layer = createGeoJson(states[state], layerColor);

      //add to layers
      that.layers[state] = layer;

      //add to properties
      that.stateProperties[state] = states[state];

      //add to map
      map.addLayer(layer);
    }

    cb();
  });
};

Gameboard.prototype.clearBoard = function(map){
  map.eachLayer(function(layer){
    map.removeLayer(layer);
  });
};

Gameboard.prototype.createState = function(map, state, layerColor){
  var layer = this.layers[state];
  console.log(layer, state, 'here');
  var that = this;
  var group = {};

  layer.setStyle({color: layerColor});
  
  map.addLayer(layer);
};

Gameboard.prototype.createLayerGroup = function(map, group, groupColor, clickFn){

  for(var state in this[group]){
    if (this[group].hasOwnProperty(state)){
      this.createState(map, state, groupColor);
    }
  }
};

Gameboard.prototype.initGame = function(map){
  var that = this;
  async.series([
    function(callback){
      that.createBoard(map, 'purple', function(){
        callback(null, 'one');
      });
    },
    function(callback){
      that.createState(map, 'oregon', 'green');
      callback(null, 'three');
    }
  ], function(err,results){
    if(err){
      console.log(err);
    } else {
      console.log('done!', results);
    }
  });
};


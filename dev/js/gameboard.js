function Gameboard(){
  this.states = ['alabama', 'arizona', 'arkansas', 'california', 'colorado', 'connecticut', 'maryland', 'dc', 'florida', 'georgia', 'idaho', 'illinois', 'indiana', 'iowa', 'kansas', 'kentucky', 'louisiana', 'maine', 'maryland', 'massachusetts', 'michigan', 'minnesota', 'mississippi', 'missouri', 'montana', 'nebraska', 'nevada', 'newhampshire', 'newjersey', 'newmexico', 'newyork', 'northcarolina', 'northdakota', 'ohio', 'oklahoma', 'oregon', 'pennsylvania', 'rhodeisland', 'southcarolina', 'southdakota', 'tennessee', 'texas', 'utah', 'vermont', 'virginia', 'washington', 'westvirginia', 'wisconsin', 'wyoming'];
  this.layers = {};
  this.userStates = {};
}

Gameboard.prototype.createBoard = function(map, layerColor){
  var that = this;
  var layer;
  this.states.forEach(function(name){
    getStateData(name, function(data){
      
      layer = createGeoJson(data, layerColor);
      console.log(layer);
      that.layers[name] = layer;
      map.addLayer(layer);
      return that.layers;
      
    });
  });
};

Gameboard.prototype.clearBoard = function(map){
  map.eachLayer(function(layer){
    map.removeLayer(layer);
  });
};

Gameboard.prototype.createLayer = function(map, state, layerColor){
  var layer;
  var stateName;
  var that = this;

  getStateData(state, function(data){
    layer = createGeoJson(data, layerColor);

    that.layers[state] = layer;
    map.addLayer(layer);
  });
};


function setTile(tile, attr) {
  var layer = L.tileLayer(tile, {
    attribution: attr
  });

  this.addLayer(layer);
}

function getStateData(name, cb){
  $.get("/api/map/states/" + name, function(data){
    cb(data);
  });
}

function getStatesData(cb){
  $.get("/api/map/states", function(data){
    cb(data);
  });
}

function createGeoJson(data, stateColor){
  var layer = L.geoJson(data, {
    style: function(){
      return {
        color: stateColor
      };
    }
  });
  return layer;
}

function addToMap(layer){
  this.addLayer(layer);
}

function addToUserStates(state, game, group, map){
  game['addToGroup'](state, group, function(){
    game['newTurn'](map);
  });
}

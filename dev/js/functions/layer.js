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

function addClick(layer, fn){
  layer.on('click', fn);
}

function consle(data){
  return console.log(data);
}

function touching(state, cb){
  getStateData(state, function(data){
    cb(data.properties.touching);
  });
}
//now create clickedy click click


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

function createGeoJson(data, col){
  var layer = L.geoJson(data, {
    style: function(){
      return {
        color: col
      };
    },
    onEachFeature: function(feature, layr){
      layr.on('click', function(){
        feature.properties.touching.forEach( function(state){
            var name = state.toLowerCase();
            console.log(name);
          });
          
        });
      }
    });

  return layer;
}

function addToMap(layer){
  this.addLayer(layer);
}
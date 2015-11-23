$('document').ready(function(){
  $.get("/api/map/access", function(data){
    var states = data.map + '?access_token=' + data.token;
    
    //init map and set location
    var map = createMap('map', [38.925, -98.481], 4);
    setTile.call(map, states, '<a href="http://mapbox.com">Mapbox</a>');
  });
}); //end ready

function createMap(id, coords, scale){
  return L.map(id).setView(coords, scale);
}


function setTile(tile, attr) {
  var layer = L.tileLayer(tile, {
    attribution: attr
  });

  this.addLayer(layer);
}





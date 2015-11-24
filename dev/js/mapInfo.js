$('document').ready(function(){
  $.get("/api/map/access", function(data){
    var states = data.map + '?access_token=' + data.token;
    var mapOptions = {
      zoomControl: false,
      minZoom: 4,
      maxZoom: 4,
      dragging: false
    };
    
    //init map and set location
    var map = createMap('map', mapOptions, [38.925, -98.481], 4);
    setTile.call(map, states, '<a href="http://mapbox.com">Mapbox</a>');
    var alabama;

    getStateData('alabama', function(data){
      alabama = createGeoJson(data, 'green');
      map.addLayer(alabama);
    });



  });
}); //end ready

function createMap(id, options, coords, scale){
  return L.map(id, options).setView(coords, scale);
}


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
      return {color: col};
    },
    onEachFeature: function(feature, layr){
      layr.on('click', function(){
        console.log(feature.properties.touching);
      });
    }
  });

  return layer;
}


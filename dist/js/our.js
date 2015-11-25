function inObj(key){
  if(this.hasOwnPropety(key)){
    return true;
  }

  return false;
}

function createMap(id, options, coords, scale){
  return L.map(id, options).setView(coords, scale);
}
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


// console.log('test');


var alabama = 'hey';
var game = new Gameboard();

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
    var map = createMap('map', mapOptions, [38.925, -94.481], 4);
    setTile.call(map, states, '<a href="http://mapbox.com">Mapbox</a>');

    game.createBoard(map, 'yellow');

    getStateData('alabama', function(data){
      alabama = createGeoJson(data, 'green');
      console.log(alabama);
      addToMap.call(map, alabama);
    });

    

    // map.addLayer();

    


  });
}); //end ready




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


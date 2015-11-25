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
  this.vacantStates = {};
  this.enemyStates = {};
}

Gameboard.prototype.createBoard = function(map, layerColor){
  var that = this;
  var layer;
  var i = 1;

  async.each(this.states, function(state, callback){
    getStateData(state, function(data){
      layer = createGeoJson(data, layerColor);
      that.layers[state] = layer;
      callback();
    });
  }, function(err){
    // if any of the file processing produced an error, err would equal that error
    if( err ) {
      // One of the iterations produced an error.
      // All processing will now stop.
      console.log('A file failed to process');
    } else {
      console.log('All files have been processed successfully');
    }
  });//end each
};

Gameboard.prototype.clearBoard = function(map){
  map.eachLayer(function(layer){
    map.removeLayer(layer);
  });
};

Gameboard.prototype.createState = function(map, state, layerColor){
  var layer = this.layers[state];

  layer.setStyle({color: layerColor});
  console.log(layer);
  map.addLayer(layer);
};

Gameboard.prototype.createLayerGroup = function(map, group, groupColor){
  console.log('hey!', this[group]);

  for(var state in this[group]){
    if (this[group].hasOwnProperty(state)){
      console.log('hey!');
      this.createState(map, state, groupColor);
    }
  }
};

Gameboard.prototype.initGame = function(map){
  var that = this;
  async.series([
    function(callback){
      that.createBoard(map, 'transparent');
      callback(null, 'one');
    },
    function(callback){
      that.createLayerGroup(map, 'layers', 'yellow');
      callback(null, 'two');
    },
    function(callback){
      getStateData('alabama', function(data){
        var alabama = createGeoJson(data, 'green');
        addToMap.call(map, alabama);
      });
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


// console.log('test');


var alabama = 'hey';
var game = new Gameboard();
var b;

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
    b = map;

    game.initGame(map);

    // game.createBoard(map, 'transparent');
    // console.log(game.layers, 'layers');
    // game.createLayerGroup(map, 'layers', 'yellow');

    getStateData('alabama', function(data){
      alabama = createGeoJson(data, 'green');
      console.log(alabama);
      addToMap.call(map, alabama);
    });

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


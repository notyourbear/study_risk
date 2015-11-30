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


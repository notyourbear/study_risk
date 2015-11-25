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




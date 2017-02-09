function genRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(array) {
  var m = array.length, t, i;

  // While there remain elements to shuffle…
  while (m) {

    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}

function addButton(locationId, buttonId, buttonClass, text, prepend){
  var button = "<button id='"+buttonId+"' class='"+buttonClass+"'>"+text+"</button>";

  if(prepend === 'prepend'){
    $('#'+locationId).prepend(button);
  } else {
    $('#'+locationId).append(button);
  }
}

function cleanSpot(placeId){
  $('#'+placeId).html('');
}


function addForm(locationId, formId){
  var $place = $('#'+locationId);

  var source = $('#'+formId).html();
  var template = Handlebars.compile(source);
  $place.append(template);
}

function checkForForm(buttonId, formId){
  var $place = $('#'+buttonId);
  var classed = $place.hasClass('active');
  if(classed){
    cleanSpot(formId);
    return true;
  }
  return false;
}

function postableForm(formId, href, redirectUrl){
  $place = $('#'+formId);

  $place.submit(function(e){
    e.preventDefault();
    var $this = $(this);
    var user = {
      email: $this.find('input:text').val(),
      password: $this.find('input:password').val()
    };

    $.post(href, user, function(u){
      redirect(redirectUrl);
    });
  });
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

function createMap(id, options, coords, scale){
  return L.map(id, options).setView(coords, scale);
}

function getListId(){
  var pathname = window.location.pathname;
  var id = "";
  var i = 6;

  for(i; i<pathname.length; i++){
    id += pathname[i];
  }

  return id;
}
function redirect(url){
  window.location.href = url;
}
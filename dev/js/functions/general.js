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
  console.log('hey');
  if(classed){
    cleanSpot(formId);
    return true;
  }
  return false;
}
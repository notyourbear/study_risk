var listsObj = {
  lists: {}
};

var radiosObj = {
  question: {}
};
var currentList;

$('document').ready(function(){
 
 getLists(function(listData){
  getRadios(function(radioData){
      var radios = {radios:radioData.radio};

      listData.lsts.forEach(function(entry) {
        listsObj.lists[entry.id] = entry;
      });

      radios.radios.forEach(function(q){
        radiosObj.question[q.id] = genRadioQ(q);
      });
      console.log('radios', radiosObj);
      console.log('listsObj.lists', listsObj);
      getListsView('theLists');
      
      

  }); //end get radios
 }); //end get lists
}); //end ready

function cleanSpot(placeId){
  $('#'+placeId).html('');
}

function startGame(listId){
  var href = "/game/"+listId;
  redirect(href);
}

function changeText(locationId, text, clss){
  cleanSpot(locationId);
  var $place = $('#'+locationId);
  $place.html(text);
  
  if(clss){
    $place.addClass(clss);
  }
  
}

function addButton(locationId, buttonId, buttonClass, text, prepend){
  var button = "<button id='"+buttonId+"' class='"+buttonClass+"'>"+text+"</button>";

  if(prepend === 'prepend'){
    $('#'+locationId).prepend(button);
  } else {
    $('#'+locationId).append(button);
  }
  
}

function genRadioQ(q){
  var radio = {
    question: q.question,
    id: q.id,
    answer: q.answer,
    falseAnswers: [],
    lists: []
  };

  q.Lists.forEach(function(l){
    radio.lists.push(l.id);
  });

  for(var i = 1; i <=5; i++){
    var fls = "false"+i;

    if(q[fls]!==""){
      radio.falseAnswers.push(q[fls]);
      radio[fls] = q[fls];
    }
  }

  return radio;
}
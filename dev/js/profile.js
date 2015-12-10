var listsObj = {};
var lists;
var radiosObj = {
  question: {}
};
var currentList;
$('document').ready(function(){
 
 getLists(function(listData){
  getRadios(function(radioData){
      lists = {lists:listData.lsts};
      var radios = {radios:radioData.radio};

      lists.lists.forEach(function(entry) {
        listsObj[entry.id] = entry;
      });

      radios.radios.forEach(function(q){
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

        radiosObj.question[q.id] = radio;
      });
      console.log('radios', radiosObj);
      console.log('lists', lists);
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

function changeText(locationId, text){
  cleanSpot(locationId);
  var $place = $('#'+locationId);
  $place.html(text);
}

function addButton(locationId, buttonId, buttonClass, text){
  var button = "<button id='"+buttonId+"' class='"+buttonClass+"'>"+text+"</button>";
  $('#'+locationId).append(button);
}
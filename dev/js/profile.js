var listsObj = {};
var radiosObj = {
  question: {}
};
var currentList;
$('document').ready(function(){
 
 getLists(function(listData){
  getRadios(function(radioData){
      var lists = {lists:listData.lsts};
      var radios = {radios:radioData.radio};
      console.log('lists', lists);
      console.log('radios', radios);

      lists.lists.forEach(function(entry) {
        listsObj[entry.id] = entry;
      });

      radios.radios.forEach(function(q){
        var radio = {
          question: q.question,
          id: q.id,
          answer: q.answer,
          falseAnswers: []
        };

        for(var i = 1; i <=5; i++){
          var fls = "false"+i;

          if(q[fls]!==""){
            radio.falseAnswers.push(q[fls]);
          }
        }

        radiosObj.question[q.id] = radio;
      });
      

      var source = $("#lists-template").html();
      var template = Handlebars.compile(source);

      var html = template(lists);

      $('#theLists').append(html);
      getCreateListForm('getListForm', 'selectedList', function(){
        submitNewList('createNewLists');
      });
      

  }); //end get radios
 }); //end get lists
}); //end ready

function getCreateListForm(buttonId, placeId, cb){
  $('#'+buttonId).on('click', function(){
    cleanSpot(placeId);
    var $place = $('#'+placeId);
    var source = $("#newList-template").html();
    
    var template = Handlebars.compile(source);

    $place.append(source);
    cb();
  });
}

function getCreateRadioForm(buttonId, placeId, cb){
  $('#'+buttonId).on('click', function(){
    cleanSpot(placeId);
    var $place = $('#'+placeId);
    var source = $("#newRadio-template").html();
    
    var template = Handlebars.compile(source);

    $place.append(source);
    cb();
  });
}

function getListView(placeId, listId){
  cleanSpot(placeId);
  var $place = $('#'+placeId);
  var context = listsObj[listId];
  currentList = listId;
  console.log('the current list', listId);

  var source = $('#listView-template').html();
  var template = Handlebars.compile(source);
  var html = template(context);

  $place.append(html);
  getQuestionsView('theLists');

  getCreateRadioForm('getRadioForm', 'selectedList', function(){
        submitNewRadio('createNewRadio');
      });
  
  changeText('profile-callout', "You can add or remove questions from the selected list");
}

function getQuestionsView(placeId){
  cleanSpot(placeId);
  var $place = $('#'+placeId);
  var context = radiosObj;

  var source = $('#questions-template').html();
  var template = Handlebars.compile(source);
  var html = template(context);

  $place.append(html);

}

function submitNewList(id, href, obj){
  $('#'+id).on('submit', function(e){
    e.preventDefault();

    var $this = $(this);

    var list = {
      name: $('#newlist-name').val(),
      description: $('#newlist-desc').val(),
      private: $this.find('input:checkbox').prop('checked') ? true : false
    };

    
    $.post("/api/lists", list, function(list){
      if(list){
        console.log('yay!', list);
      }
    });
  });
}

function submitNewRadio(id, href, obj){
  $('#'+id).on('submit', function(e){
    e.preventDefault();

    var $this = $(this);

    var radio = {
      question: $('#newquestion-question').val(),
      answer: $('#newquestion-answer').val(),
      false1: $('#newquestion-false1').val() || null,
      false2: $('#newquestion-false2').val() || null,
      false3: $('#newquestion-false3').val() || null,
      false4: $('#newquestion-false4').val() || null,
      false5: $('#newquestion-false5').val() || null
    };

    
    $.post("/api/radios", radio, function(radio){
      if(radio){
        console.log('yay!', radio);
      }
    });
  });
}

function getLists(cb){
  $.get("/api/lists/user", function(data){
    cb(data);
  });
}

function getRadios(cb){
  $.get("/api/radios/user", function(data){
    cb(data);
  });
}

function deleteList(id){
  $.ajax({
   url: '/api/lists/delete/'+id,
   type: 'DELETE',
   success: function(response) {
     console.log(response);
   }
  });
}

function cleanSpot(placeId){
  $('#'+placeId).html('');
}

function addToList(questId, listId){
  var obj = {
    listId: listId,
    questionId: questId
  };

  if(listId !== undefined){
    $.post("/api/radios/list", obj, function(list){
      console.log('ADDED!', list);
    });
  }
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
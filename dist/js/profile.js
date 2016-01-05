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

function getListView(placeId, listId){
  cleanSpot(placeId);
  var $place = $('#'+placeId);
  var context = listsObj.lists[listId];
  currentList = listId;

  var source = $('#listView-template').html();
  var template = Handlebars.compile(source);
  var html = template(context);

  $place.append(html);
  getQuestionsView('theLists');
}

function getListsView(placeId){
  cleanSpot(placeId);
  var source = $("#lists-template").html();
  var template = Handlebars.compile(source);
  var html = template(listsObj);
 
  $('#'+placeId).append(html);

  cleanSpot('profileButtons');

  addButton('profileButtons', 'getCreateListForm', 'button small secondary hollow', 'Create a new list');
  getCreateListForm('getCreateListForm', 'selectedList', function(){
    submitNewList('createNewLists');
  });

  changeText('profile-callout', "<h2>Your Lists</h2><h3>Select with which list to play</h3>");
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

    
    $.post("/api/lists", list, function(l){
      if(l){
        console.log('yay!', l);
        //add to listsObj
        listsObj.lists[l.id]=l;
        //change to listView
        getListView('selectedList', l.id);
      }
    });
  });
}

function getLists(cb){
  $.get("/api/lists/user", function(data){
    cb(data);
  });
}

function deleteList(id){
  $.ajax({
   url: '/api/lists/delete/'+id,
   type: 'DELETE',
   success: function(response) {
     console.log(response);
     cleanSpot('selectedList');
     changeText('selectedList', '<div style="color: #417365; background: #f5fafa;" class="row"><div class="small-12 columns"> <h1>List has been deleted</h1> </div></div>', 'deleted');
     //get rid of listsObj list
     delete listsObj.lists[id];
     //recall listsview
     getListsView('theLists');
   }
  });
}

function getEditListForm(placeId, listId){
  cleanSpot(placeId);
  var $place = $('#'+placeId);
  var source = $('#listEdit-template').html();
  var template = Handlebars.compile(source);
  var context = listsObj.lists[listId];
  var html = template(context);
  $place.append(html);

  editList('listEditForm', listId);
}

// create editList
function editList(formId, listId){
  $('#'+formId).on('submit', function(e){
    e.preventDefault();

    var list = {
      id: listId,
      name: $('#editList-name').val(),
      description: $('#editList-description').val(),
      private: $('#editList-private').prop('checked') ? true : false
    };

    $.ajax({
      method: "PUT",
      url: "/api/lists",
      data: list,
      success: function(l){
        console.log('EDITED!', l);
        //update list obj
        listsObj.lists[listId] = l;
        //change to list view
        getListView('selectedList', listId);
      }
    });
  });
  
}


function updateListQuestionTotal(way, id){
  var $place = $('#'+id);
  var total = $place.html();
  var num = total - "";
  
  if(way === "++"){
    num++;
  } else {
    num--;
  }

  $place.html(num);
}

function getRadios(cb){
  $.get("/api/radios/user", function(data){
    cb(data);
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

        var newQ = {
          id: radio.id,
          question: radio.question,
          answer: radio.answer,
          lists: [],
          falseAnswers: [],
          inCurrentList: false
        };

        var fls = '';

        for(var i = 1; i <= 5; i++){
          fls = 'false'+i;
          if(radio[fls] !== ''){
            newQ.falseAnswers.push(radio[fls]);
          }
        }
        console.log('newQ', newQ);

        //append to radiosObj
        radiosObj.question[newQ.id] = newQ;

        //add to page
        addToQuestionList(newQ.id);
        
      }
    });
  });
}

function addToQuestionList(qId){
  var source = $('#createdQuestion-template').html();
  var template = Handlebars.compile(source);
  var html = template(radiosObj.question[qId]);

  if($("#question-"+qId).length){
    $("#question-"+qId).remove();
  }
    
  $('#theLists').append(html);
}

function getQuestionsView(placeId){
  cleanSpot(placeId);
  var $place = $('#'+placeId);
  var i = 0;
  
  for(var q in radiosObj['question']){
    console.log(radiosObj['question'][q], 'q');
    radiosObj['question'][q]['inCurrentList'] = false;
    for(i = 0; i<radiosObj['question'][q]['lists'].length; i++){
      console.log('currentList', currentList);
      console.log('list', radiosObj['question'][q]['lists'][i]);
      if(radiosObj['question'][q]['lists'][i] === currentList){
        radiosObj['question'][q]['inCurrentList'] = true;
      }
    }
  }
  console.log(radiosObj);
  var source = $('#questions-template').html();
  var template = Handlebars.compile(source);
  var html = template(radiosObj);
  
  $place.append(html);
  changeText('profile-callout', "<h2>Your Questions</h2><h3>You can add or remove questions from the selected list</h3>");

  cleanSpot('profileButtons');
  addButton('profileButtons', 'getListsView', 'button small hollow secondary', 'View all Lists');
  
  addButton('profileButtons', 'getRadioForm', 'button small hollow secondary', 'Create a new question');
  getCreateRadioForm('getRadioForm', 'selectedList', function(){
      submitNewRadio('createNewRadio');
    });

  $('#getListsView').on('click', function(){
    getListsView('theLists');
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

function addToList(qId, listId){
  var obj = {
    listId: listId,
    questionId: qId
  };

  if(listId !== undefined){
    $.post("/api/radios/list", obj, function(list){
      console.log('ADDED!', list);
      //remove button from correct question;
      $('#question-'+qId).find('button.btLeft').remove();
      //add outline to the question list
      var $place = $('#listView-questions');
      var source = $("#addQuestionToList-template").html();
      var template = Handlebars.compile(source);
      var context = radiosObj.question[qId];
      var html = template(context);
      $place.append(html);
      
      //update the count
      updateListQuestionTotal('++', 'listView-amountOfQs');
    });
  }
}

function removeQFromList(qId, listId){
  var obj = {
    listId: listId,
    questionId: qId
  };

  if(listId !== undefined){
    $.post("/api/radios/removefromlist", obj, function(list){
      console.log('removed!', list);
      //remove question from list
      $("#listQuestion-"+qId).remove();
      //append add to list button on the correct question
        //question-qid

      var place = "question-" + qId + " .button-group";
      console.log(place);
      addButton(place, "questionButton-"+qId, "button hollow secondary btLeft", "Add to list", 'prepend');

      updateListQuestionTotal('--', 'listView-amountOfQs');

      $("#questionButton-"+qId).on('click', function(){
        console.log('GO!');
        addToList(qId, currentList);
      });
    });
  }
}

function getQuestionView(placeId, qId){
  cleanSpot(placeId);
  var $place = $('#'+placeId);

  
  var source = $('#questionEdit-template').html();
  var template = Handlebars.compile(source);
  var context = radiosObj.question[qId];
  var html = template(context);

  $place.append(html);
}

function deleteQuestion(qId, qvId, qlId){
  //api call to delete the question
    $.ajax({
     url: '/api/radios/delete/'+qId,
     type: 'DELETE',
     success: function(response) {
       console.log(response);
        //remove it from questionView
        changeText(qvId, '<div class="small-12 columns"> Question has been deleted</div>', 'deleted');
        //remove it from questionList
        $('#'+qlId).remove();
     }
    });
}

function getEditQuestionForm(placeId, qId){
  cleanSpot(placeId);
  var $place = $('#'+placeId);

  var source = $('#questionEdit-template').html();
  var template = Handlebars.compile(source);
  var context = radiosObj.question[qId];
  var html = template(context);

  $place.append(html);
  editQuestion('questionEditForm', qId);
}

function editQuestion(formId, qId){
  $('#'+formId).on('submit', function(e){
    e.preventDefault();

    var radio = {
      id: qId,
      question: $('#editQuestion-question').val(),
      answer: $('#editQuestion-answer').val(),
      false1: $('#editQuestion-false1').val() || null,
      false2: $('#editQuestion-false2').val() || null,
      false3: $('#editQuestion-false3').val() || null,
      false4: $('#editQuestion-false4').val() || null,
      false5: $('#editQuestion-false5').val() || null
    };

    $.ajax({
      method: "PUT",
      url: "/api/radios",
      data: radio,
      success: function(q){
        console.log('EDITED!', q);
        //change the radiosObj[id] from response
        radiosObj.question[q.id] = genRadioQ(q);
        //call the question view 
        getQuestionView('selectedList', q.id);
        //change the questionS view entry
        addToQuestionList(q.id);
      }
    });
  });
}
$('document').ready(function(){
  $('#logoutButton').on('click', function(){
    $.get('/api/users/logout', function(logged){
      redirect('/');
    });
  });
});
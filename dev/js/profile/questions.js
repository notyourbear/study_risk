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
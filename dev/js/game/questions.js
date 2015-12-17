function clear(id){
  $('#'+id).html('');
}

function getQuestions(listId, cb){
  $.get("/api/lists/"+listId, function(list){
    cb(list);
  });
}


function populateQuestion(questions, cb){
    var q = questions[genRandomInt(0, questions.length-1)];
    shuffle(q['possibleAnswers']);
    cb(q);
}

function placeQuestion(id, context, cb){
  var source = $('#question-template').html();
  var template = Handlebars.compile(source);

  var html = template(context);

  $('#'+id).append(html);

  cb();
}

function validateQuestion(answers, context, successCb, failCb){
  $('.'+ answers).click(function(){
    var $this = $(this);
    if($this.is(':checked') && $this.val() === context.answer) {
      successCb();
    } else {
      failCb();
    }
  });
}

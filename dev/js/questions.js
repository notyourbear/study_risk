function clear(id){
  $('#'+id).html('');
}

function getQuestion(cb){
  $.get("/api/questions/question", function(data){
    cb(data);
  });
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
    if($this.is(':checked') && $this.val() === context.correctAnswer) {
      successCb();
    } else {
      failCb();
    }
  });
}

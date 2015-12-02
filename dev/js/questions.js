var context = {
    question: "It's tricky to rock a rhyme",
    correctAnswer: "for doggies",
    answers: [
      "that's right on time",
      "no it's not",
      "baka!",
      "for doggies"
    ]
  };

function clear(id){
  $('#'+id).html('');
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

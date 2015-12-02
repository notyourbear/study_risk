var context = {
    question: "It's tricky to rock a rhyme",
    answers: [
      "that's right on time",
      "no it's not",
      "baka!"
    ]
  };

function clear(id){
  $('#'+id).html('');
}

function placeQuestion(id, context){
  var source = $('#question-template').html();
  var template = Handlebars.compile(source);

  var html = template(context);

  $('#'+id).append(html);
}

function validateQuestion(answers){
  $('.'+ answers).click(function(){
    if ($(this).is(':checked'))
    {
      console.log($(this).val());
    }
  });
}
//start by turning this into a function

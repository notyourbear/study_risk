$('document').ready(function(){
  var source = $("#question-template").html();
  var template = Handlebars.compile(source);

  var context = {
    question: "It's tricky to rock a rhyme",
    answers: [
      "that's right on time",
      "no it's not",
      "baka!"
    ]
  };

  var html = template(context);

  $('#questionField').append(html);

  $('.answers').click(function(){
    if ($(this).is(':checked'))
    {
      console.log($(this).val());
    }
  });


});

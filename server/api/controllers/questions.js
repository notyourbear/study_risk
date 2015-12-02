var sendJsonResponse = function(res, status, content){
  res.status(status);
  res.json(content);
};

module.exports.single = function(req, res, next){
  var question = {
    question: "It's tricky to rock a rhyme",
    correctAnswer: "for doggies",
    answers: [
      "that's right on time",
      "no it's not",
      "baka!",
      "for doggies"
    ]
  };

  sendJsonResponse(res, '200', question);
};

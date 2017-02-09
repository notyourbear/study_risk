var game = new Gameboard();
var questionSet = [];

$('document').ready(function(){
  ////get params
  var pathname = window.location.pathname;
  var listId = getListId();

  //profile button
  $('#gameProfileButton').on('click', function(){
    redirect('/users/profile');
  });

  //logout button
  $('#gameLogoutButton').on('click', function(){
    $.get('/api/users/logout', function(){
      redirect('/');
    });
  });

  $.get("/api/map/access", function(data){
    getQuestions(listId, function(questionList){
      questionList.Radios.forEach(function(radio){
        var question = {
          question: radio.question,
          answer: radio.answer,
          possibleAnswers: []
        };

        question.possibleAnswers.push(radio.answer);

        var fls = "";

        for(var i = 1; i<=5; i++){
          fls = "false" + i;
          if(radio[fls] !== ""){
            question.possibleAnswers.push(radio[fls]);
          }
        }
        questionSet.push(question);
      });

      var states = data.map + '?access_token=' + data.token;
      var mapOptions = {
        zoomControl: false,
        minZoom: 4,
        maxZoom: 4,
        dragging: false
      };

      //init map and set location
      var map = createMap('map', mapOptions, [39.925, -96.481], 4);
      setTile.call(map, states, '<a href="http://mapbox.com">Mapbox</a>');
      b = map;

      game.initGame(map);



    });
  });

}); //end ready

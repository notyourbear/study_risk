function Gameboard(){
  this.states = ['alabama', 'arizona', 'arkansas', 'california', 'colorado', 'connecticut', 'maryland', 'dc', 'florida', 'georgia', 'idaho', 'illinois', 'indiana', 'iowa', 'kansas', 'kentucky', 'louisiana', 'maine', 'maryland', 'massachusetts', 'michigan', 'minnesota', 'mississippi', 'missouri', 'montana', 'nebraska', 'nevada', 'newhampshire', 'newjersey', 'newmexico', 'newyork', 'northcarolina', 'northdakota', 'ohio', 'oklahoma', 'oregon', 'pennsylvania', 'rhodeisland', 'southcarolina', 'southdakota', 'tennessee', 'texas', 'utah', 'vermont', 'virginia', 'washington', 'westvirginia', 'wisconsin', 'wyoming'];
  this.layers = {};
  this.stateProperties = {};
  this.bordering = {};
  this.userStates = {};
  this.vacantStates = {};
  this.enemyStates = {};
  this.userStatesColors = ['#b8b453', '#9c9c44', '#96964d', '#8f8e4f'];
  this.borderStatesColors = ['#fce8c7'];
  this.currentUserStateColor = 0;
  this.currentBorderStatesColor = 0;
}

Gameboard.prototype.updateColor = function(current, type){
  if(this[current] === this[type].length - 1){
    this[current] = 0;
  } else {
    this[current] += 1;
  }
};

Gameboard.prototype.createBoard = function(map, layerColor, cb){
  var that = this;
  var layer;
  var i = 1;

  getStatesData(function(states){
    for(var state in states){

      //create layer
      layer = createGeoJson(states[state], layerColor);

      //add to layers
      that.layers[state] = layer;

      //add to properties
      that.stateProperties[state] = states[state];

      //add to map
      map.addLayer(layer);
    }

    cb();
  });
};

Gameboard.prototype.clearBoard = function(map, cb){
  map.eachLayer(function(layer){
    map.removeLayer(layer);
  });
  cb();
};

Gameboard.prototype.createState = function(map, state, layerColorCurrent, layerColorArray, clickFn){
  var layer = this.layers[state];
  var that = this;
  var num = this[layerColorCurrent];
  layer.setStyle({
    color: that[layerColorArray][num],
  });

  that.updateColor(layerColorCurrent, layerColorArray);

  layer.off('click');
  layer.on('click', function(){

    if(clickFn === undefined){

    } else {
      populateQuestion(questionSet ,function(question){
        async.series([
          function(callback){
            clear('questionField');
            callback(null, {'one': 'cleared field'});
          },
          function(callback){
            placeQuestion('questionField', question, function(){
              callback(null, {'one': 'placedQuestion'});
            });
          },
          function(callback){
            validateQuestion('answers', question, function(){

              return clickFn(state, that, 'userStates', map);
            }, function(){

              return that.newTurn(map);
            });

            callback(null, {'two': 'border group created'});
          }
          ], function(err,results){
          if(err){
            console.log(err);
          }
        });
      });
    }

  });

  map.addLayer(layer);
};

Gameboard.prototype.createLayerGroup = function(map, group, colorCurrent, colorArray, clickFn, cb){

  for(var state in this[group]){
    if (this[group].hasOwnProperty(state)){
      this.createState(map, state, colorCurrent, colorArray, clickFn);
    }
  }
  cb();
};

Gameboard.prototype.addToGroup = function(stateName, groupName, cb){
  //adds to group name
  this[groupName][stateName] = stateName;
  cb();
};

Gameboard.prototype.createBorderingGroup = function(cb){
  var that = this;
  var arr = [];
  this.bordering = {};

  //run through states in user group
  for(var state in this.userStates){
    if(this.userStates.hasOwnProperty(state)){
        arr = this.stateProperties[state].properties.touching;

        arr.forEach(function(borderingState){
          that.addToGroup(borderingState, 'bordering', function(){

            //double check that borderingState is not in user owned states

            if(that.userStates.hasOwnProperty(borderingState)){
              //if so, delete it from the bordering list
              delete that.bordering[borderingState];
            }
          });
        });
    }
  }
  cb();
};

Gameboard.prototype.initGame = function(map){
  var that = this;
  var randomState = this.states[genRandomInt(0, this.states.length-1)];
  async.series([
    function(callback){
      that.createBoard(map, 'transparent', function(){

        callback(null, {'one': 'map created'});
      });
    },
    function(callback){
      that.addToGroup(randomState, 'userStates', function(){

        callback(null, {'two': 'state added to user group'});
      });
    },
    function(callback){
      that.createBorderingGroup(function(){

        callback(null, {'three': 'created touching list'});
      });
    },
    function(callback){
      that.createLayerGroup(map, 'bordering', 'currentBorderStatesColor', 'borderStatesColors', addToUserStates, function(){

        callback(null, {'five': 'added touching list to map'});
      });
    },
    function(callback){
      that.createLayerGroup(map, 'userStates', 'currentUserStateColor','userStatesColors', undefined, function(){
        callback(null, {'four': 'added user list to map'});
      });
    }
  ], function(err,results){
    if(err){
      console.log(err);
    }
  });
};

Gameboard.prototype.newTurn = function(map){
  var that = this;
  async.series([
    function(callback){
      that.clearBoard(map, function(){
        clear('questionField');
        callback(null, {'one': 'clearedBoard'});
      });
    },
    function(callback){
      that.createBorderingGroup(function(){
        callback(null, {'two': 'border group created'});
      });
    },
    function(callback){
      that.createLayerGroup(map, 'bordering', 'currentBorderStatesColor', 'borderStatesColors', addToUserStates, function(){
        callback(null, {'five': 'added touching list to map'});
      });
    },
    function(callback){
      that.createLayerGroup(map, 'userStates', 'currentUserStateColor' , 'userStatesColors', undefined, function(){
        callback(null, {'four': 'added user list to map'});
      });
    },
    ], function(err,results){
    if(err){
      console.log(err);
    }
  });
};

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

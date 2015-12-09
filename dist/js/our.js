function Gameboard(){
  this.states = ['alabama', 'arizona', 'arkansas', 'california', 'colorado', 'connecticut', 'maryland', 'dc', 'florida', 'georgia', 'idaho', 'illinois', 'indiana', 'iowa', 'kansas', 'kentucky', 'louisiana', 'maine', 'maryland', 'massachusetts', 'michigan', 'minnesota', 'mississippi', 'missouri', 'montana', 'nebraska', 'nevada', 'newhampshire', 'newjersey', 'newmexico', 'newyork', 'northcarolina', 'northdakota', 'ohio', 'oklahoma', 'oregon', 'pennsylvania', 'rhodeisland', 'southcarolina', 'southdakota', 'tennessee', 'texas', 'utah', 'vermont', 'virginia', 'washington', 'westvirginia', 'wisconsin', 'wyoming'];
  this.layers = {};
  this.stateProperties = {};
  this.bordering = {};
  this.userStates = {};
  this.vacantStates = {};
  this.enemyStates = {};
}

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

Gameboard.prototype.createState = function(map, state, layerColor, clickFn){
  var layer = this.layers[state];
  var that = this;
  
  layer.setStyle({
    color: layerColor,
  });

  layer.off('click');
  layer.on('click', function(){
    
    console.log(clickFn);
    if(clickFn === undefined){
      console.log('MEOW');
    } else {
      populateQuestion(questionSet ,function(question){
        async.series([
          function(callback){
            clear('questionField');
            callback(null, {'one': 'placedQuestion'});
          },
          function(callback){
            placeQuestion('questionField', question, function(){
              callback(null, {'one': 'placedQuestion'});
            });
          },
          function(callback){
            validateQuestion('answers', question, function(){
              console.log('correct!');
              return clickFn(state, that, 'userStates', map);
            }, function(){
              console.log('false!');
              return that.newTurn(map);
            });
            
            callback(null, {'two': 'border group created'});
          }
          ], function(err,results){
          if(err){
            console.log(err);
          } else {
            console.log('done!', results);
          }
        });
      });
    }

  });
  
  map.addLayer(layer);
};

Gameboard.prototype.createLayerGroup = function(map, group, groupColor, clickFn, cb){
  console.log(group, this[group]);
  for(var state in this[group]){
    if (this[group].hasOwnProperty(state)){
      this.createState(map, state, groupColor, clickFn);
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
  async.series([
    function(callback){
      that.createBoard(map, 'transparent', function(){
        console.log('done! 1');
        callback(null, {'one': 'map created'});
      });
    },
    function(callback){
      that.addToGroup('oregon', 'userStates', function(){
        console.log('done! 2');
        callback(null, {'two': 'state added to user group'});
      });
    },
    function(callback){
      that.createBorderingGroup(function(){
        console.log('done! 3');
        callback(null, {'three': 'created touching list'});
      });
    },
    function(callback){
      that.createLayerGroup(map, 'bordering', 'orange', addToUserStates, function(){
        console.log('done! 5');
        callback(null, {'five': 'added touching list to map'});
      });
    },
    function(callback){
      that.createLayerGroup(map, 'userStates', 'green', undefined, function(){
        console.log('done! 4');
        callback(null, {'four': 'added user list to map'});
      });
    }
  ], function(err,results){
    if(err){
      console.log(err);
    } else {
      console.log('done!', results);
    }
  });
};

Gameboard.prototype.newTurn = function(map){
  console.log('new turn!');
  var that = this;
  async.series([
    function(callback){
      that.clearBoard(map, function(){
        clear('questionField');
        console.log('done! clearboard');
        callback(null, {'one': 'clearedBoard'});
      });
    },
    function(callback){
      that.createBorderingGroup(function(){
        console.log('done! border group created');
        callback(null, {'two': 'border group created'});
      });
    },
    function(callback){
      that.createLayerGroup(map, 'bordering', 'orange', addToUserStates, function(){
        console.log('done! 5');
        callback(null, {'five': 'added touching list to map'});
      });
    },
    function(callback){
      that.createLayerGroup(map, 'userStates', 'green', undefined, function(){
        console.log('done! 4');
        callback(null, {'four': 'added user list to map'});
      });
    },
    ], function(err,results){
    if(err){
      console.log(err);
    } else {
      console.log('done!', results);
    }
  });
};


// console.log('test');


var alabama = 'hey';
var game = new Gameboard();
var b;
var questionSet = [];

$('document').ready(function(){
  ////get params
  var pathname = window.location.pathname;
  var listId = getListId();

  $.get("/api/map/access", function(data){
    getQuestions(listId, function(questionList){
      console.log(questionList);

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
      var map = createMap('map', mapOptions, [38.925, -94.481], 4);
      setTile.call(map, states, '<a href="http://mapbox.com">Mapbox</a>');
      b = map;

      game.initGame(map);



    });
  });
    


    

  
}); //end ready




var listsObj = {};
var radiosObj = {
  question: {}
};
var currentList;
$('document').ready(function(){
 
 getLists(function(listData){
  getRadios(function(radioData){
      var lists = {lists:listData.lsts};
      var radios = {radios:radioData.radio};
      console.log('lists', lists);
      console.log('radios', radios);

      lists.lists.forEach(function(entry) {
        listsObj[entry.id] = entry;
      });

      radios.radios.forEach(function(q){
        var radio = {
          question: q.question,
          id: q.id,
          answer: q.answer,
          falseAnswers: []
        };

        for(var i = 1; i <=5; i++){
          var fls = "false"+i;

          if(q[fls]!==""){
            radio.falseAnswers.push(q[fls]);
          }
        }

        radiosObj.question[q.id] = radio;
      });
      

      var source = $("#lists-template").html();
      var template = Handlebars.compile(source);

      var html = template(lists);

      $('#theLists').append(html);
      getCreateListForm('getListForm', 'selectedList', function(){
        submitNewList('createNewLists');
      });
      getCreateRadioForm('getRadioForm', 'selectedList', function(){
        submitNewRadio('createNewRadio');
      });





  }); //end get radios
 }); //end get lists
}); //end ready

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

function getListView(placeId, listId){
  cleanSpot(placeId);
  var $place = $('#'+placeId);
  var context = listsObj[listId];
  currentList = listId;
  console.log('the current list', listId);

  var source = $('#listView-template').html();
  var template = Handlebars.compile(source);
  var html = template(context);

  $place.append(html);
  getQuestionsView('theLists');
}

function getQuestionsView(placeId){
  cleanSpot(placeId);
  var $place = $('#'+placeId);
  var context = radiosObj;

  var source = $('#questions-template').html();
  var template = Handlebars.compile(source);
  var html = template(context);

  $place.append(html);
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

    
    $.post("/api/lists", list, function(list){
      if(list){
        console.log('yay!', list);
      }
    });
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
      }
    });
  });
}

function getLists(cb){
  $.get("/api/lists/user", function(data){
    cb(data);
  });
}

function getRadios(cb){
  $.get("/api/radios/user", function(data){
    cb(data);
  });
}

function deleteList(id){
  $.ajax({
   url: '/api/lists/delete/'+id,
   type: 'DELETE',
   success: function(response) {
     console.log(response);
   }
  });
}

function cleanSpot(placeId){
  $('#'+placeId).html('');
}

function addToList(questId, listId){
  var obj = {
    listId: listId,
    questionId: questId
  };

  if(listId !== undefined){
    $.post("/api/radios/list", obj, function(list){
      console.log('ADDED!', list);
    });
  }
}
function clear(id){
  $('#'+id).html('');
}

function getQuestions(listId, cb){
  $.get("/api/lists/"+listId, function(list){
    cb(list);
  });
}


function populateQuestion(questions, cb){
    cb(questions[genRandomInt(0, questions.length-1)]);
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

function genRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function setTile(tile, attr) {
  var layer = L.tileLayer(tile, {
    attribution: attr
  });

  this.addLayer(layer);
}

function getStateData(name, cb){
  $.get("/api/map/states/" + name, function(data){
    cb(data);
  });
}

function getStatesData(cb){
  $.get("/api/map/states", function(data){
    cb(data);
  });
}

function createGeoJson(data, stateColor){
  var layer = L.geoJson(data, {
    style: function(){
      return {
        color: stateColor
      };
    }
  });
  return layer;
}

function addToMap(layer){
  this.addLayer(layer);
}

function consoleState(state){
  return console.log('HEY', state);
}

function addToUserStates(state, game, group, map){
  game['addToGroup'](state, group, function(){
    console.log(game[group]);
    game['newTurn'](map);
  });
}


function createMap(id, options, coords, scale){
  return L.map(id, options).setView(coords, scale);
}

function getListId(){
  var pathname = window.location.pathname;
  var id = "";
  var i = 6;

  for(i; i<pathname.length; i++){
    id += pathname[i];
  }

  return id;
}
function redirect(url){
  window.location.href = url;
}
$('document').ready(function(){

  $('#loginForm').submit(function(e){
    e.preventDefault();
    var $this = $(this);
    var user = {
      email: $this.find('input:text').val(),
      password: $this.find('input:password').val()
    };

    $.post("/api/users/login", user, function(user) {
      console.log(user);
      //redirect user
      redirect('/users/profile');
    });
  });

  $('#logoutButton').click(function(){
    console.log('CLICKED!');
    $.get("/api/users/logout", function(result){
        console.log(result);
        //redirect user
        redirect('/users/login');
    });
  });

});
$('document').ready(function(){

  $('#signupForm').submit(function(e){
    e.preventDefault();
    var $this = $(this);
    var newUser = {
      email: $this.find('input:text').val(),
      password: $this.find('input:password').val()
    };

    $.post("/api/users", newUser, function(result) {
      console.log(result);
    });
  });

});
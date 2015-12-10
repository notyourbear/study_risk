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
var lists;
var radiosObj = {
  question: {}
};
var currentList;
$('document').ready(function(){
 
 getLists(function(listData){
  getRadios(function(radioData){
      lists = {lists:listData.lsts};
      var radios = {radios:radioData.radio};

      lists.lists.forEach(function(entry) {
        listsObj[entry.id] = entry;
      });

      radios.radios.forEach(function(q){
        var radio = {
          question: q.question,
          id: q.id,
          answer: q.answer,
          falseAnswers: [],
          lists: []
        };

        q.Lists.forEach(function(l){
          radio.lists.push(l.id);
        });

        for(var i = 1; i <=5; i++){
          var fls = "false"+i;

          if(q[fls]!==""){
            radio.falseAnswers.push(q[fls]);
          }
        }

        radiosObj.question[q.id] = radio;
      });
      console.log('radios', radiosObj);
      console.log('lists', lists);
      getListsView('theLists');
      
      

  }); //end get radios
 }); //end get lists
}); //end ready

function cleanSpot(placeId){
  $('#'+placeId).html('');
}

function startGame(listId){
  var href = "/game/"+listId;
  redirect(href);
}

function changeText(locationId, text){
  cleanSpot(locationId);
  var $place = $('#'+locationId);
  $place.html(text);
}

function addButton(locationId, buttonId, buttonClass, text){
  var button = "<button id='"+buttonId+"' class='"+buttonClass+"'>"+text+"</button>";
  $('#'+locationId).append(button);
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

function getListView(placeId, listId){
  cleanSpot(placeId);
  var $place = $('#'+placeId);
  var context = listsObj[listId];
  currentList = listId;

  var source = $('#listView-template').html();
  var template = Handlebars.compile(source);
  var html = template(context);

  $place.append(html);
  getQuestionsView('theLists');
}

function getListsView(placeId){
  cleanSpot(placeId);
  var source = $("#lists-template").html();
  var template = Handlebars.compile(source);
  var html = template(lists);
 
  $('#'+placeId).append(html);

  cleanSpot('profileButtons');

  addButton('profileButtons', 'getCreateListForm', 'button', 'Create a new list');
  getCreateListForm('getCreateListForm', 'selectedList', function(){
    submitNewList('createNewLists');
  });

  changeText('profile-callout', "Select with which list to play");
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

function getLists(cb){
  $.get("/api/lists/user", function(data){
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

function updateListQuestionTotal(way, id){
  var $place = $('#'+id);
  var total = $place.html();
  var num = total - "";
  
  if(way === "++"){
    num++;
  } else {
    num--;
  }

  $place.html(num);
}

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

        //add to page
        var source = $('#createdQuestion-template').html();
        var template = Handlebars.compile(source);
        var html = template(newQ);

        $('#theLists').append(html);

        //append to radiosObj
        radiosObj.question[newQ.id] = newQ;
      }
    });
  });
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
  changeText('profile-callout', "You can add or remove questions from the selected list");

  cleanSpot('profileButtons');
  addButton('profileButtons', 'getListsView', 'button', 'View all Lists');
  
  addButton('profileButtons', 'getRadioForm', 'button', 'Create a new question');
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
      $('#question-'+qId).find('button').remove();
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
      addButton("question-"+qId, "questionButton-"+qId, "button", "Add to current list");

      updateListQuestionTotal('--', 'listView-amountOfQs');

      $("#questionButton-"+qId).on('click', function(){
        console.log('GO!');
        addToList(qId, currentList);
      });
    });
  }
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
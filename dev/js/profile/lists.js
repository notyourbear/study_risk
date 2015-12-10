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
  var context = listsObj.lists[listId];
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
  var html = template(listsObj);
 
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

function getEditListForm(placeId, listId){
  cleanSpot(placeId);
  var $place = $('#'+placeId);
  var source = $('#listEdit-template').html();
  var template = Handlebars.compile(source);
  var context = listsObj.lists[listId];
  var html = template(context);
  $place.append(html);

  editList('listEditForm', listId);
}

// create editList
function editList(formId, listId){
  $('#'+formId).on('submit', function(e){
    e.preventDefault();

    var list = {
      id: listId,
      name: $('#editList-name').val(),
      description: $('#editList-description').val(),
      private: $('#editList-private').prop('checked') ? true : false
    };

    $.ajax({
      method: "PUT",
      url: "/api/lists",
      data: list,
      success: function(l){
        console.log('EDITED!', l);
        //update list obj
        //update lists
        //change to list view
      }
    });
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

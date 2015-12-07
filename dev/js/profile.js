var listsObj = {};
$('document').ready(function(){
 
 getLists(function(data){
  var lists = {lists:data.lsts};
  
  console.log('lists', lists);
  lists.lists.forEach(function(entry) {
    listsObj[entry.id] = entry;
  });
  

  var source = $("#lists-template").html();
  var template = Handlebars.compile(source);

  var html = template(lists);

  $('#theLists').append(html);
  console.log('hey');
  getCreateListForm('getListForm', 'selectedList', function(){
    submitNewList('createNewLists');
  });
 });
});

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
  console.log(context);

  var source = $('#listView-template').html();
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

function cleanSpot(placeId){
  $('#'+placeId).html('');
}
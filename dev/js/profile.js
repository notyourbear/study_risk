$('document').ready(function(){
 
 getLists(function(data){
  var lists = {lists:data.lsts};
  console.log('lists', lists);

  var source = $("#lists-template").html();
  var template = Handlebars.compile(source);

  var html = template(lists);
  console.log(source);

  $('#theLists').append(html);

  submitNewList('createNewLists');
 });
});

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
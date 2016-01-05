$('document').ready(function(){
  $('#logoutButton').on('click', function(){
    $.get('/api/users/logout', function(logged){
      redirect('/');
    });
  });
});
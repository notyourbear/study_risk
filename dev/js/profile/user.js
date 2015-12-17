$('document').ready(function(){
  $('#logoutButton').on('click', function(){
    console.log('hey');
    $.get('/api/users/logout', function(logged){
      console.log(logged);
      redirect('/');
    });
  });
});
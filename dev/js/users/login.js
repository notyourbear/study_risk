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

  $('#logout').click(function(){
    $.get("/api/users/logout", function(result){
        console.log(result);
        //redirect user
        redirect('/users/login');
    });
  });

});
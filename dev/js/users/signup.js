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
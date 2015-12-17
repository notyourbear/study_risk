$('document').ready(function(){

function postableForm(formId, href, redirectUrl){
  $place = $('#'+formId);

  $place.submit(function(e){
    e.preventDefault();
    var $this = $(this);
    var user = {
      email: $this.find('input:text').val(),
      password: $this.find('input:password').val()
    };

    $.post(href, user, function(u){
      redirect(redirectUrl);
    });
  });
}
  // $('#loginForm').submit(function(e){
  //   e.preventDefault();
  //   var $this = $(this);
  //   var user = {
  //     email: $this.find('input:text').val(),
  //     password: $this.find('input:password').val()
  //   };

  //   $.post("/api/users/login", user, function(user) {
  //     console.log(user);
  //     //redirect user
  //     redirect('/users/profile');
  //   });
  // });

  // $('#logoutButton').click(function(){
  //   console.log('CLICKED!');
  //   $.get("/api/users/logout", function(result){
  //       console.log(result);
  //       //redirect user
  //       redirect('/users/login');
  //   });
  // });

  $('#indexLoginButton').on('click', function(){
    var formed = checkForForm('indexLoginButton', 'indexForm');
    $(this).toggleClass('active');

    var placeId = 'indexForm';

    
    if(!formed){
      addForm(placeId, 'login-template');
      postableForm('loginForm', '/api/users/login', '/users/profile');
    }
    
  });

});

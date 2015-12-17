$('document').ready(function(){

  $('#indexLoginButton').on('click', function(){
    var placeId = 'indexForm';
    var formed = checkForForm('indexLoginButton', 'indexForm');

    $(this).toggleClass('active');

    if(!formed){
      addForm(placeId, 'login-template');
      postableForm('loginForm', '/api/users/login', '/users/profile');
    }
  });

});

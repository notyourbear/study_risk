$('document').ready(function(){

  $('#indexLoginButton').on('click', function(){
    var placeId = 'indexForm';
    var signupId = 'indexSignupButton';
    var formed = checkForForm('indexLoginButton', placeId);

    var signupActive = checkForForm(signupId, placeId);

    if(signupActive){
      $('#'+signupId).toggleClass('active');
    }

    $(this).toggleClass('active');
    cleanSpot(placeId);
    if(!formed){

      addForm(placeId, 'login-template');
      postableForm('loginForm', '/api/users/login', '/users/profile');
    }
  });

});

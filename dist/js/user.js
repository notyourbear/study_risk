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

$('document').ready(function(){

  $('#indexSignupButton').on('click', function(){
    var placeId = 'indexForm';
    var loginId = 'indexLoginButton';
    var formed = checkForForm('indexSignupButton', placeId);
    var loginActive = checkForForm(loginId, placeId);

    if(loginActive){
      $('#'+loginId).toggleClass('active');
    }

    $(this).toggleClass('active');
    if(!formed){
      addForm(placeId, 'signup-template');
      postableForm('signupForm', '/api/users', '/users/profile');
    }
  });


});
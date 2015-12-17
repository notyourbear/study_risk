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
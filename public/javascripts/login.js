// get Modals and set click to close modal.
var loginmodal = document.getElementById('id01');
var signupmodal = document.getElementById('id02');

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == loginmodal) {
        loginmodal.style.display = "none";
    }
    if (event.target == signupmodal) {
      signupmodal.style.display = "none";
    }
}

// DISPLAY THE APPROPRIATE MODULE

if (openState == "signup") { document.getElementById('id02').style.display='block';} 
else if (openState == "login"){ document.getElementById('id01').style.display='block';}





// Angular Login/Signup
// define module
var formApp = angular.module('formApp', []);

// create controller
formApp.controller('formController', function($scope, $http) {
  // create object for form info.  Use $scope to allow data to pass between controller and view
  $scope.formData = {};
  $scope.loginFormData = {};

  // process the form
  $scope.signUp = function() {

    // Reset messages
    $scope.message = null;
    $scope.errorUsername = null;
    $scope.errorEmail = null;
    $scope.errorPassword = null;

    $http({
      method  : 'POST',
      url     : 'http://kodemechanic.com:8080/user',
      data    : $.param($scope.formData),
      headers : { 'Content-Type': 'application/x-www-form-urlencoded' }       
    })
    .success(function(data){
      if(!data.success){        
        $scope.errorUsername = data.errors.username;
        $scope.errorEmail = data.errors.email;
        $scope.errorPassword = data.errors.password;
      } else {
        // if succcessful bind success message to message.
        $scope.message = data.message + ".  Logging in...";
        
        //  Authenticate
//        authenticateUser($scope.formData.username, $scope.formData.password, data, function,{
//	  console.log("completed Login");
//        }); 
                    
      }
    })
  }

  function authenticateUser(username, password){
	console.log("inside authenticateUser:  " + username + "  " + password);
  };

  $scope.login = function() {
    $scope.LoginMessage = null;
    $scope.errorLoginUsername = null;
    $scope.errorLoginPassword = null;

    console.log($scope.loginFormData);

    // Encode id/pw for Basic auth adn retrieve token response.
    var creds = $scope.loginFormData.username + ":" + $scope.loginFormData.password;
    console.log(creds);

    var encodedCreds = "Basic " + btoa(creds);
    console.log(encodedCreds);

    $http({
      method  : 'POST',
      url     : 'http://kodemechanic.com:8080/user/authenticate',
      data    : ($scope.loginFormData),
      headers : { 
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': encodedCreds
      }
    })
    .success(function(data){
      if(!data.success){
        $scope.errorLoginUsername = data.errors.username;
        $scope.errorLoginPassword = data.errors.password;
      } else {
        $scope.LoginMessage = data.message;

        // authentication successful, Use Token to get Dashboard.
        console.log("AUTHENTICATION SUCCESSFUL, TOKEN RETURNED!");
        
        // Send bearer token to dashboard JS
        
        setAuthToken("Bearer oisjdh234io1u09fgjh34rtqha9078utnqr234");

        console.log("auth token set to:  " + authToken);

        // Close signup/Login modals to show dashboard.
        loginmodal.style.display = "none";
        signupmodal.style.display = "none";
      }
    })
  }

});


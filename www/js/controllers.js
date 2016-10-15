angular.module('dywthm.controllers', [])

.controller('LoginCtrl', function($scope, $state, $timeout) {

  // Form data for the login modal
  $scope.loginData = {};

  $scope.badLoginPopup = function (){
    var alertPopup = $ionicPopup.alert({
         title: 'Invalid Credentials!',
         template: 'Are you sure you typed them in correctly?'
      });

      alertPopup.then(function(res) {
         // Custom functionality....
      });
  };

  $scope.noConnectionPopup = function (){
    var alertPopup = $ionicPopup.alert({
         title: 'Cannot connect to server!',
         template: 'Please verify your internet connection!'
      });

      alertPopup.then(function(res) {
         // Custom functionality....
      });
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
       $state.go('app.home');
    }, 1000);
  };
})


.controller('HomeCtrl', function($scope, Dolls) {
  var dolls = Dolls.all();
  $scope.dolls = dolls;
  var date = new Date();
  $scope.date = date.toUTCString();
})

.controller('DollsCtrl', function($scope, Dolls) {
  var dolls = Dolls.all();
  $scope.dolls = dolls;
})

.controller('DollCtrl', function($scope, $stateParams, Dolls) {
  var doll = Dolls.get($stateParams.dollId);
  $scope.doll = doll;
});

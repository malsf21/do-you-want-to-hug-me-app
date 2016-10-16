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
  var dolls = Dolls.getAll();
  $scope.dolls = dolls;
  var date = new Date();
  $scope.date = date.toLocaleTimeString() + ", "+ date.toDateString();
  if (date.getHours() > 18){
    $scope.greeting = "Evening";
  }
  else if (date.getHours() > 12){
    $scope.greeting = "Afternoon";
  }
  else if (date.getHours() > 4){
    $scope.greeting = "Morning";
  }
  else{
    $scope.greeting = "Evening";
  }
  $scope.chartConfig = {
    title: {
         text: 'The Hug Graph'
     },
     xAxis: {
         categories: ['Beginning of Time', 'Last Year', 'Last Month', 'Yesterday', 'Today']
     },
     series: [{
         data: [0, dolls["lifetime"]-dolls["yearly"], dolls["lifetime"]-dolls["monthly"], dolls["lifetime"]-dolls["daily"], dolls["lifetime"]],
         name: 'Hugs'
     }]
   }
})

.controller('DollsCtrl', function($scope, Dolls) {
  var dolls = Dolls.all();
  $scope.dolls = dolls;
})

.controller('DollCtrl', function($scope, $stateParams, Dolls) {
  var doll = Dolls.get($stateParams.dollId);
  $scope.doll = doll;
  $scope.chartConfig = {
    title: {
         text: 'The Hug Graph'
     },
     xAxis: {
         categories: ['Beginning of Time', 'Last Year', 'Last Month', 'Yesterday', 'Today']
     },
     series: [{
         data: [0, doll["lifetime"]-doll["yearly"], doll["lifetime"]-doll["monthly"], doll["lifetime"]-doll["daily"], doll["lifetime"]],
         name: 'Hugs'
     }]
   }
})

.controller('AccountCtrl', function($scope, $ionicModal, $timeout) {

  // Form data for the login modal
  $scope.accountData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/password.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closePassword = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.password = function() {
    $scope.modal.show();
  };

  $scope.updatePassword = function() {
    console.log('Updating Account', $scope.accountData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
       $scope.closePassword();
    }, 1000);
  };
});

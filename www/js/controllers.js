angular.module('dywthm.controllers', [])

.controller('LoginCtrl', function($scope, $state, $http, $ionicPopup, $timeout, Database, Sync) {

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

  Database.checkLogin(function (success){
    console.log("checking if logged in");
    if (success == 1){
      $state.go('app.home');
    } else if (success == 0){
      $scope.noConnectionPopup();
    }
  });

  $scope.doLogin = function(user) {

    console.log('Doing login', $scope.loginData);
    Sync.login($scope.loginData.email, $scope.loginData.password, function(code){
      if (code == 0){
        $scope.noConnectionPopup();
      } else if (code == 1){
        $state.go('app.home');
      } else {
        $scope.badLoginPopup();
      }
    })
  };
})


.controller('HomeCtrl', function($rootScope, $ionicHistory, $location, $state, $stateParams, $ionicPlatform, $scope, Plushes, Database, Sync, $timeout) {

  if (navigator.connection.type == Connection.NONE){
    console.log("no connection");
    $rootScope.noInternet = true;
  } else {
    console.log("yes connection");
    $rootScope.noInternet = false;
  }

  document.addEventListener("offline", function(){

    $rootScope.noInternet = true;

    $scope.$apply();

    console.log("lost connection");

  }, false);
  document.addEventListener("online", function(){

    $rootScope.noInternet = false;

    $scope.$apply();

    console.log("gained connection");

  }, false);
  $rootScope.refreshDash = function(){

    document.addEventListener('deviceready', function() {

      $scope.dashData = {};

      $timeout($scope.onTimeout, 1000);

      Sync.now(function () {

        Database.getUser(function (userData) {

          $scope.name = userData.name;

          $scope.$apply();
        });

        Database.getPlushes(function (plushData) {

          $scope.dashData.cpCount = panelData.length;

          $scope.$apply();

          $scope.$broadcast('scroll.refreshComplete');
        });

        Database.getPresses(function (pressData) {
          daily = 0;
          montly = 0;
          yearly = 0;
          lifetime = 0;
          /*
          hours = 0;
          avg = 0;
          */
          for (i = 0; i < pressData.length; i++) {
            current = new Date();
            lifetime += 1;
            if (current - pressData["i"]["date"] <= 365*24*60*60){
              yearly += 1;
            }
            if (current - pressData["i"]["date"] <= 30*24*60*60){
              monthly += 1;
            }
            if (current - pressData["i"]["date"] <= 24*60*60){
              daily += 1;
            }
          }
          /*
          avg = parseFloat(lifetime)/parseFloat(hours);
          avg = Number(avg).toFixed(1);
          */
          $scope.daily = daily;
          $scope.monthly = monthly;
          scope.yearly = yearly;
          scope.lifetime = lifetime;
          $scope.avg = 10;

          $scope.$apply();
        });
      });
    });
  }
  $scope.refreshDash();
  var date = new Date();
  if (date.getHours() >= 18){
    $scope.greeting = "Evening";
  }
  else if (date.getHours() >= 12){
    $scope.greeting = "Afternoon";
  }
  else if (date.getHours() >= 4){
    $scope.greeting = "Morning";
  }
  else{
    $scope.greeting = "Evening";
  }
  $scope.date = date.toLocaleTimeString() + ", "+ date.toDateString();
  $scope.chartConfig = {
    title: {
         text: 'The Hug Graph'
     },
     xAxis: {
         categories: ['Beginning of Time', 'Last Year', 'Last Month', 'Yesterday', 'Today']
     },
     series: [{
         data: [0, $scope.lifetime-$scope.yearly, $scope.lifetime-$scope.monthly, $scope.lifetime-$scope.daily, $scope.lifetime],
         name: 'Hugs'
     }]
   }
})

.controller('PlushesCtrl', function($scope, $rootScope, Database, Sync) {
  $scope.noPlushes = true;
  function getPlushes() {
    Database.getPlushes(function (plushesData) {

      if (plushesData.length == 0){
        $scope.noPlushes = false;
      } else {
        $scope.noPlushes = true;
      }

      $scope.plushes = plushesData;

      $scope.$apply();
    });
  }

  $rootScope.refreshPlushes = function(){
    Sync.now(function () {
      getPlushes();
      $scope.$broadcast('scroll.refreshComplete');
    })
  }

  getPlushes();
})

.controller('PlushCtrl', function($scope, $stateParams, Plushes, Database, Sync) {
  var plush = Plushes.get($stateParams.plushId, function (plush){
    $scope.plush = plush;

    Presses.get(function (pressData) {
      daily = 0;
      montly = 0;
      yearly = 0;
      lifetime = 0;
      /*
      hours = 0;
      avg = 0;
      */
      for (i = 0; i < pressData.length; i++) {
        current = new Date();
        lifetime += 1;
        if (current - pressData["i"]["date"] <= 365*24*60*60){
          yearly += 1;
        }
        if (current - pressData["i"]["date"] <= 30*24*60*60){
          monthly += 1;
        }
        if (current - pressData["i"]["date"] <= 24*60*60){
          daily += 1;
        }
      }
      /*
      avg = parseFloat(lifetime)/parseFloat(hours);
      avg = Number(avg).toFixed(1);
      */
      $scope.daily = daily;
      $scope.monthly = monthly;
      scope.yearly = yearly;
      scope.lifetime = lifetime;
      $scope.avg = 10;

      $scope.$apply();
    });
  });
  $scope.plush = plush;
  $scope.chartConfig = {
    title: {
         text: 'The Hug Graph'
     },
     xAxis: {
         categories: ['Beginning of Time', 'Last Year', 'Last Month', 'Yesterday', 'Today']
     },
     series: [{
         data: [0, $scope.lifetime-$scope.yearly, $scope.lifetime-$scope.monthly, $scope.lifetime-$scope.daily, $scope.lifetime],
         name: 'Hugs'
     }]
   }
})

.controller('AccountCtrl', function($scope, $ionicModal, $timeout, $state, $ionicHistory, Database) {

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

  $scope.logout = function() {
    Database.logout(function (){
      $ionicHistory.clearCache();
      $ionicHistory.clearHistory();
      $state.go('login.login');
    });
  };
});

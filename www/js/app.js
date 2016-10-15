// Ionic dywthm App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'dywthm' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'dywthm.controllers' is found in controllers.js
angular.module('dywthm', ['ionic', 'dywthm.controllers', 'dywthm.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html'
  })

  .state('login', {
    url: '/l',
    abstract: true,
    templateUrl: 'templates/login-menu.html'
  })

  .state('login.login', {
    url: '/login',
    views: {
      'loginContent': {
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
      }
    }
  })

  .state('app.home', {
    url: '/home',
    views: {
      'menuContent': {
        templateUrl: 'templates/home.html',
        controller: 'HomeCtrl'
      }
    }
  })

  .state('app.account', {
    url: '/account',
    views: {
      'menuContent': {
        templateUrl: 'templates/account.html'
      }
    }
  })

  .state('app.add', {
      url: '/add',
      views: {
        'menuContent': {
          templateUrl: 'templates/add.html'
        }
      }
    })
    .state('app.dolls', {
      url: '/dolls',
      views: {
        'menuContent': {
          templateUrl: 'templates/dolls.html',
          controller: 'DollsCtrl'
        }
      }
    })

  .state('app.single', {
    url: '/dolls/:dollId',
    views: {
      'menuContent': {
        templateUrl: 'templates/doll.html',
        controller: 'DollCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/l/login');
});

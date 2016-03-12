// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js

angular.module('starter', ['ionic', 'starter.controllers', 'starter.directive','chart.js', 'ngMaterial'])

.run(function($ionicPlatform, $location) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    localStorage.setItem('setGoal', '0');
    $location.url('/splash');  
//      var isGoalSet = localStorage.getItem('isGoalSet');
//      console.log(isGoalSet);
//      if (!isGoalSet || isGoalSet == null || isGoalSet == false) {
//        $location.url('/splash');
//      }
    
  });
    
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
  $ionicConfigProvider.tabs.position('bottom');

  $stateProvider
    .state('splash', {
      url: '/splash',
      templateUrl: 'templates/splash.html',
      //controller: 'SplashCtrl'
  })
  
  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })

  .state('app.power', {
    url: "/power",
    views: {
      'tab-power': {
        templateUrl: "templates/power.html"
        //contoller : 'PowerCtrl'
      }
    }
  })

  .state('app.water', {
    url: "/water",
    views: {
      'tab-water': {
        templateUrl: "templates/water.html"
      }
    }
  })

  .state('app.fuel', {
    url: "/fuel",
    views: {
      'tab-fuel': {
        templateUrl: "templates/fuel.html",
        controller: 'PlaylistsCtrl'
      }
    }
  })

//    .state('app.single', {
//      url: "/playlists/:playlistId",
//      views: {
//        'tab-playlists': {
//          templateUrl: "templates/playlist.html",
//          controller: 'PlaylistCtrl'
//        }
//      }
//    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/power');
});



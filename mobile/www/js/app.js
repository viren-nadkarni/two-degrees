// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js

angular.module('starter', ['ionic', 'starter.controllers', 'starter.directive', 'chart.js', 'ngMaterial'])

.run(function ($ionicPlatform, $location) {
    
    localStorage.setItem('setGoal', '0');
    $ionicPlatform.ready(function () {
        
        $location.url('/splash');
        
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }

    });

})

.config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
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
                templateUrl: "templates/fuel.html"
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
})

.directive('countUp', ['$compile', function ($compile, $timeout) {
    return {
        restrict: 'E',
        replace: false,
        scope: {
            countTo: "=countTo",
            interval: '=interval',
            incrementBy: '=incrementBy'
        },
        controller: ['$scope', '$element', '$attrs', '$timeout', function ($scope, $element, $attrs, $timeout) {
            $scope.millis = 0;
            if ($element.html().trim().length === 0) {
                $element.append($compile('<span>{{millis}}</span>')($scope));
            } else {
                $element.append($compile($element.contents())($scope));
            }

            var i = 0;

            function timeloop() {
                setTimeout(function () {
                    if (($scope.countTo - $scope.millis) >= $scope.incrementBy) {
                        $scope.millis = $scope.incrementBy + $scope.millis;
                        i = $scope.incrementBy + i;
                    } else {
                        $scope.millis++;
                        i++;
                    }
                    $scope.$digest();

                    if (i < $scope.countTo) {
                        timeloop();
                    }
                }, $scope.interval)
            }
            timeloop();
       }]
    }
}]);

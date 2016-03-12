var app = angular.module('twodegres', ['ngRoute','chart.js']).config(function($routeProvider, $locationProvider) {
  $routeProvider
  .when('/', {
    templateUrl: 'scripts/views/Dashboard.html',
    controller: 'DashboardController'
  })
});

app.directive('countUp', ['$compile',function($compile,$timeout) {
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

            var i=0;
            function timeloop () {
                setTimeout(function () {
					if(($scope.countTo-$scope.millis)>= $scope.incrementBy){
						$scope.millis = $scope.incrementBy + $scope.millis;
						i = $scope.incrementBy + i;
					}else{
						$scope.millis ++;
						i++;
					}
                    $scope.$digest();
                    
                    if (i<$scope.countTo) {
                        timeloop();
                    }
                }, $scope.interval)
            }
            timeloop();
        }]
    }}]);


app.config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common["X-Requested-With"];
        $httpProvider.defaults.headers.common["Accept"] = "application/json";
        $httpProvider.defaults.headers.common["Content-Type"] = "application/json";
    }
]);

Chart.defaults.global.colours = [{
    fillColor: 'rgba(47, 132, 71, 0.8)',
    strokeColor: 'rgba(47, 132, 71, 0.8)',
    highlightFill: 'rgba(47, 132, 71, 0.8)',
    highlightStroke: 'rgba(47, 132, 71, 0.8)'
}];

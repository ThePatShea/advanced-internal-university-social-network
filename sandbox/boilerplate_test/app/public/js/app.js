var MyApp = angular.module('MyApp', []).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'bubbleList.html', 
        controller: "bubbleListCtrl"
      }).
      when('/bubble', {
        templateUrl: 'bubbleShow.html', 
        controller: "BubbleShowCtrl"
      });
    $locationProvider.html5Mode(true);
  }]);

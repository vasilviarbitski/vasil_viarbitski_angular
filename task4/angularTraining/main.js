var myApp = angular.module('myApp', ['ngRoute', 'ngAnimate']);

myApp.config(['$routeProvider', function($routeProvider){
  $routeProvider
  .when('/', {
    templateUrl: 'app/search.html',
    controller: 'myCtrl'
  }).otherwise ({
    redirectTo: '/'
  });

}]);

myApp.controller('myCtrl', ['$scope', '$http',  function($scope,$http){

$scope.orderName = function(){
  $scope.order = 'name';
};

$scope.orderCity = function(){
  $scope.order = 'city';
};

$scope.orderAge = function(){
  $scope.order = 'age';
};

$http.get('data/users.json').success(function(data){
  $scope.users = data;
});

}]);

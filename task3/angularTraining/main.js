  var myApp = angular.module('myApp', ['ngRoute']);

  myApp.controller('myCtrl', ['$scope', '$http', '$rootScope', function($scope,$http,$rootScope) {
    $http.get('/data/users.json').success(function(data){

      $rootScope.users = data;
      });
  }]);

  myApp.config(['$routeProvider',function ($routeProvider) {
    $routeProvider
    .when('/', {
     templateUrl : '/app/pages/main.html'
   })
    .when('/login', {
     templateUrl : '/app/pages/login.html',
     controller : 'loginCtrl'
   })
   .when('/info', {
    templateUrl : '/app/pages/info.html',
    controller : 'loginCtrl'
  })

   .when('/dashboard' , {
     resolve: {
       "check": function ($location, $rootScope) {
        if (!$rootScope.loggedIn){
           $location.path('/');
        }
      }
     },
     templateUrl: '/app/pages/dashboard.html',
     controller : 'dashboardCtrl'
     })
     .otherwise({
     redirectTo: '/'
   });
 }]);

  myApp.controller('loginCtrl', [ '$scope', '$location','$rootScope' , function ($scope, $location,$rootScope) {

    $scope.showInfo = function() {
      return true;
    };

      $scope.sendData = function () {
      $scope.counter = 0;
      for (var i = 0;i<$rootScope.users.length;i++){
        if ($scope.username == $rootScope.users[i].name && $scope.password == $rootScope.users[i].password){
          $rootScope.loggedIn = true;
          $rootScope.user = $scope.username;
          $location.path('/dashboard');
          $rootScope.index = i;
          $scope.counter++;
          $scope.showInfo();

                    };
      };
      if ($scope.counter == 0){
        alert('There are no users with name/password you typed in!');
      }
  };
  }]);

  myApp.controller('dashboardCtrl', ['$scope', '$rootScope', '$location', function ($scope, $rootScope, $location){
    $scope.index = $rootScope.index;
    $scope.user = $rootScope.user;
    $scope.password = $rootScope.users[$scope.index].password;
    $scope.changeName = function () {
      $rootScope.users[$scope.index].name = $scope.newName;
      $scope.user = $scope.newName;

    };
    $scope.changePassword = function () {
      $rootScope.users[$scope.index].password = $scope.newPassword;
      $scope.password = $scope.newPassword;

    };
  }]);

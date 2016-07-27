var myApp = angular.module('myApp', []);
myApp.controller('myController', ['$scope', '$http', function ($scope, $http) {
  $scope.state = false;
  $scope.addUser = function (){
    if (($scope.userForm.usern.$valid == true)
    && ($scope.userForm.age.$valid == true)
    && ($scope.userForm.date.$valid == true)
    && ($scope.age>18)
    && ($scope.age<65)
    && (/(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d/.test($scope.date))
    && (/^[A-Z]{1}[a-z]{2,20}$/.test($scope.usern))
    ){
    $scope.users.push({
      usern : $scope.usern,
      age: $scope.age,
      date : $scope.date
    });
    $scope.state = false;
    $scope.usern = "";
    $scope.age = "";
    $scope.date = "";
  }
  else {
    $scope.state = true;
  }
  }
  $scope.users = [
    {
      "usern": "Name",
      "age": "Age",
      "date": "Date"
    },
    {
      "usern": "Vasil Viarbitski",
      "age": "31",
      "date": "23/07/1985"
    }
  ];

}]);

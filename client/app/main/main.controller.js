'use strict';

angular.module('jobscaperManagerApp')
  .controller('MainCtrl', function ($scope, $http, $location, socket, Auth) {
    $scope.awesomeThings = [];

    if (!Auth.isLoggedIn) {
      $location.path('/login');
    }

    if (_.has(Auth.getCurrentUser(),'organization')) {
      $http.get('/api/organizations/'+Auth.getCurrentUser().organization).success(function(organization) {
        $scope.organization = organization;
        console.log($scope.organization);
        socket.syncUpdates('organization', $scope.organization);
      });
    }


    $scope.addThing = function() {
      if($scope.newThing === '') {
        return;
      }
      $http.post('/api/things', { name: $scope.newThing });
      $scope.newThing = '';
    };

    $scope.deleteThing = function(thing) {
      $http.delete('/api/things/' + thing._id);
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('thing');
    });
  });

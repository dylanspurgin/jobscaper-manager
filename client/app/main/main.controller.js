'use strict';

angular.module('jobscaperManagerApp')
  .controller('MainController', function ($scope, $rootScope, $location, socket, Auth, DataService, $state, $log) {

    $scope.menu = [];

    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.isManager = Auth.isManager;
    $scope.currentUser = Auth.currentUser;

    var fetchData = function () {
      if (Auth.isLoggedIn() && _.has($scope.currentUser, 'organization')) {
        DataService.getOrgData($scope.currentUser.organization)
          .then(function (organization) {
            $scope.organization = organization;
            socket.syncUpdates('api/organizations', $scope.organization);
          })
          .catch(function (err) {
            $log.error('error getting organization data', err);
          });
      }
    };


    $scope.logout = function () {
      Auth.logout();
      $state.go('app.login');
    };

    $scope.isActive = function (state) {
      return $state.is(state);
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('organization');
    });

    $rootScope.$on('login', function () {
      fetchData();
    });


    var init = function () {
      fetchData();
    };

    init();

  });

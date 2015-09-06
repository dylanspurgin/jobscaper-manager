'use strict';

angular.module('jobscaperManagerApp')
  .controller('MainController', function ($scope, $rootScope, $location, socket, Auth, DataService, $state, $log) {

    $scope.headerMenuIsCollapsed = true; // Should the hamburger menu be open or closed to start (only active on small screens)

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


    $scope.currentUser = Auth.currentUser;

    $scope.isLoggedIn = function () {
      return Auth.isLoggedIn();
    };

    $scope.isManager = function () {
      return Auth.isManager() || Auth.isAdmin();
    };

    $scope.logout = function () {
      Auth.logout();
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

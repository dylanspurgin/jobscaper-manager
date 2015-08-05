'use strict';

angular.module('jobscaperManagerApp')
  .controller('MainController', function ($scope, $location, socket, Auth, DataService, $state, $log) {

    if (!Auth.isLoggedIn) {
      $state.go('app.login');
    }

    var fetchOrgData = function () {
      Auth.getCurrentUser()
        .then(function (currentUser) {
          DataService.getOrgData(currentUser.organization)
            .then(function (organization) {
              console.log('organization', organization);
              $scope.organization = organization;
              socket.syncUpdates('organization', $scope.organization);
            })
            .catch(function (err) {
              $log.error('error getting organization data', err);
            });
        })
        .catch(function (err) {
          $log.error('Error getting current user', err);
        });
    };

    if (_.has(Auth.getCurrentUser(), 'organization')) {
      fetchOrgData();
    }

    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    }];

    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;

    $scope.logout = function () {
      Auth.logout();
      $state.go('app.login');
    };

    $scope.isActive = function (state) {
      return state === state.current;
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('organization');
    });

    $scope.$on('login', function () {
      fetchOrgData();
    })
  });

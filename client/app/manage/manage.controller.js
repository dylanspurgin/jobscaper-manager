'use strict';

angular.module('jobscaperManagerApp')
  .controller('ManageController', function ($scope, $http, Auth, User) {

    // Use the User $resource to fetch all users
    User.getAllByOrg(Auth.currentUser.organization)
      .then(function (users) {
        $scope.users = users;
      })
      .catch(function (err) {
        // TODO - handle server response error
      });

    $scope.addUser = function () {
      var newUser = User.addUser(Auth.currentUser.organization);
      newUser.open = true;
      newUser.edit = true;
      $scope.users.unshift(newUser);
    };

    $scope.cancelEdit = function (user) {
      if (!_.isUndefined(user._id)) {
        user.edit = false;
      } else {
        _.remove($scope.users, user);
      }
    };

    $scope.delete = function(user) {
      User.remove({ id: user._id });
      angular.forEach($scope.users, function(u, i) {
        if (u === user) {
          $scope.users.splice(i, 1);
        }
      });
    };
  });

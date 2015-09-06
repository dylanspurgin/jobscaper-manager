'use strict';

angular.module('jobscaperManagerApp')
  .controller('LoginController', function ($scope, Auth, $state, $window) {
    $scope.user = {};
    $scope.errors = {};

    $scope.login = function (form) {
      $scope.submitted = true;

      if (form.$valid) {
        Auth.login({
          email: $scope.user.email,
          password: $scope.user.password
        })
          .then(function () {
            // Logged in, redirect to home
            $state.go('app.jobs');
          })
          .catch(function (err) {
            $scope.errors.other = err.message;
          });
      }
    };

    // Used for 3rd party (google, facebook, etc) auth
    //$scope.loginOauth = function (provider) {
    //  $window.location.href = '/auth/' + provider;
    //};
  });

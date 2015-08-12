'use strict';

angular.module('jobscaperManagerApp')
  .factory('Auth', function Auth($location, $rootScope, $http, User, $cookieStore, $q, Restangular) {

    var _currentUser = {},
      _loginEndpoint = '/auth/local';

    if ($cookieStore.get('token')) {
      User.get().then(function(user) {
        _.merge(_currentUser,user);
      });
    }

    return {

      /**
       * Authenticate user and save token
       *
       * @param  {Object}   user     - login info
       * @return {Promise}
       */
      login: function (user) {
        var deferred = $q.defer();
        Restangular.all(_loginEndpoint).post({
          email: user.email,
          password: user.password
        })
          .then(function (response) {
            $cookieStore.put('token', response.token);
            User.get().then(function(user) {
              _.merge(_currentUser,user);
              $rootScope.$broadcast('login');
            });
            deferred.resolve(response);
          })
          .catch(function (err) {
            this.logout();
            deferred.reject(err);
            return cb(err);
          });
        return deferred.promise;
      },

      /**
       * Delete access token and user info
       *
       * @param  {Function}
       */
      logout: function () {
        $cookieStore.remove('token');
        _currentUser.length = 0;
      },

      /**
       * Create a new user
       * TODO - refactor to use Restangular
       *
       * @param  {Object}   user     - user info
       * @param  {Function} callback - optional
       * @return {Promise}
       */
      createUser: function (user, callback) {
        var cb = callback || angular.noop;

        return User.save(user,
          function (data) {
            $cookieStore.put('token', data.token);
            User.get().then(function(user) {
              _.merge(_currentUser,user);
            });
            return cb(user);
          },
          function (err) {
            this.logout();
            return cb(err);
          }.bind(this)).$promise;
      },

      /**
       * Change password
       * TODO - refactor to use Restangular
       *
       * @param  {String}   oldPassword
       * @param  {String}   newPassword
       * @param  {Function} callback    - optional
       * @return {Promise}
       */
      changePassword: function (oldPassword, newPassword, callback) {
        var cb = callback || angular.noop;

        return User.changePassword({id: _currentUser._id}, {
          oldPassword: oldPassword,
          newPassword: newPassword
        }, function (user) {
          return cb(user);
        }, function (err) {
          return cb(err);
        }).$promise;
      },

      ///**
      // * Gets all available info on authenticated user
      // *
      // * @return {Object} user
      // */
      //getCurrentUser: function () {
      //  return currentUser;
      //},
      //
      currentUser: _currentUser,

      /**
       * Check if a user is logged in
       *
       * @return {Boolean}
       */
      isLoggedIn: function () {
        return _currentUser.hasOwnProperty('role');
      },

      /**
       * Waits for currentUser to resolve before checking if user is logged in
       */
      isLoggedInAsync: function () {
        var deferred = $q.defer();
        User.get()
          .then(function (user) {
            deferred.resolve(user.hasOwnProperty('role'));
          })
          .catch(function () {
            deferred.resolve(false);
          });
        return deferred.promise;
      },

      /**
       * Check if a user is an admin
       *
       * @return {Boolean}
       */
      isAdmin: function () {
        return _currentUser.role === 'admin';
      },

      /**
       * Get auth token
       */
      getToken: function () {
        return $cookieStore.get('token');
      }
    };
  });

'use strict';

angular.module('jobscaperManagerApp')
  .factory('Auth', function Auth($location, $rootScope, $http, User, $cookieStore, $q, Restangular) {

    var currentUser = {},
      _loginEndpoint = '/auth/local';

    if ($cookieStore.get('token')) {
      currentUser = User.get();
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
            currentUser = User.get();
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
        currentUser = {};
      },

      /**
       * Create a new user
       * TODO - refactor to user Restangular
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
            currentUser = User.get();
            return cb(user);
          },
          function (err) {
            this.logout();
            return cb(err);
          }.bind(this)).$promise;
      },

      /**
       * Change password
       * TODO - refactor to user Restangular
       *
       * @param  {String}   oldPassword
       * @param  {String}   newPassword
       * @param  {Function} callback    - optional
       * @return {Promise}
       */
      changePassword: function (oldPassword, newPassword, callback) {
        var cb = callback || angular.noop;

        return User.changePassword({id: currentUser._id}, {
          oldPassword: oldPassword,
          newPassword: newPassword
        }, function (user) {
          return cb(user);
        }, function (err) {
          return cb(err);
        }).$promise;
      },

      /**
       * Gets all available info on authenticated user
       *
       * @return {Object} user
       */
      getCurrentUser: function () {
        return currentUser;
      },

      /**
       * Check if a user is logged in
       *
       * @return {Boolean}
       */
      isLoggedIn: function () {
        return currentUser.hasOwnProperty('role');
      },

      /**
       * Waits for currentUser to resolve before checking if user is logged in
       */
      isLoggedInAsync: function (cb) {
        currentUser
          .then(function (user) {
            cb(user.hasOwnProperty('role'));
          })
          .catch(function () {
            cb(false);
          });
      },

      /**
       * Check if a user is an admin
       *
       * @return {Boolean}
       */
      isAdmin: function () {
        return currentUser.role === 'admin';
      },

      /**
       * Get auth token
       */
      getToken: function () {
        return $cookieStore.get('token');
      }
    };
  });

'use strict';

angular.module('jobscaperManagerApp')
  .factory('User', function (Restangular) {

    var
      _endpoint = '/api/users',
      _getEndpoint = 'me',
      _passwordEndpoint = 'password';

    var _userMixins = {
      changePassword: function () {
        return this.customPUT(_passwordEndpoint);
      }
    };

    Restangular.extendModel(_endpoint, function (model) {
      angular.extend(model, _userMixins);
      return model;
    });

    var
      publicApi = {
        get: function () {
          return Restangular.one(_endpoint, _getEndpoint).get();
        }
      };

    return publicApi;

  });

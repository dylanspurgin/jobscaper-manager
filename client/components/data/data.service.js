'use strict';

angular.module('jobscaperManagerApp')
  .factory('DataService', function (Restangular) {

    var
      _endpoint = 'api/organizations';

    var
      publicApi = {
        getOrgData: function (id) {
          return Restangular.one(_endpoint, id).get().then(function (orgData) {
            return orgData;
          });
        }
      };

    return publicApi;

  });

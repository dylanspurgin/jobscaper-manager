'use strict';

angular.module('jobscaperManagerApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'btford.socket-io',
  'restangular',
  'ui.router',
  'ui.bootstrap'
])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider, RestangularProvider, $httpProvider) {

    RestangularProvider.setRestangularFields({
      id: '_id'
    });

    $urlRouterProvider
      .otherwise('/jobs');

    $stateProvider
      .state('app', {
        url: '',
        abstract: true,
        templateUrl: 'app/main/main.html',
        controller: 'MainController'
      })

      .state('app.jobs', {
        url: '/jobs',
        authenticate: true,
        views: {
          'content': {
            templateUrl: 'app/jobs/jobs.html',
            controller: 'JobsController'
          }
        }
      })
      .state('app.login', {
        url: '/login',
        views: {
          'content': {
            templateUrl: 'app/account/login/login.html',
            controller: 'LoginController'
          }
        }
      })
      .state('app.signup', {
        url: '/signup',
        views: {
          'content': {
            templateUrl: 'app/account/signup/signup.html',
            controller: 'SignupController'
          }
        }
      })
      .state('app.settings', {
        url: '/settings',
        authenticate: true,
        views: {
          'content': {
            templateUrl: 'app/account/settings/settings.html',
            controller: 'SettingsController',
          }
        }
      })
      .state('app.admin', {
        url: '/admin',
        authenticate: true,
        views: {
          'content': {
            templateUrl: 'app/admin/admin.html',
            controller: 'AdminController'
          }
        }
      })
      .state('app.manage', {
        url: '/manage',
        authenticate: true,
        views: {
          'content': {
            templateUrl: 'app/manage/manage.html',
            controller: 'ManageController'
          }
        }
      });


    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('authInterceptor');
  })

  .factory('authInterceptor', function ($rootScope, $q, $cookieStore, $location, $log) {
    var path = $location.path();
    return {
      // Add authorization token to headers
      request: function (config) {
        config.headers = config.headers || {};
        if ($cookieStore.get('token')) {
          config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
        }
        return config;
      },

      // Intercept 401s and redirect you to login
      responseError: function (response) {
        if (response.status === 401 &&
            path !== '/signup' &&
            path !== '/login') {
          $log.info('401 response received. Going to login state.');
          // remove any stale tokens
          $cookieStore.remove('token');
          $location.path('/login');
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      }
    };
  })

  .run(function ($rootScope, $state, Auth, $log) {
    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$stateChangeStart', function (event, next) {
      Auth.isLoggedInAsync()
        .then(function (isLoggedIn) {
          if (!isLoggedIn && next.authenticate) {
            $log.info('User is not authenticated. Going to login state.');
            event.preventDefault();
            $state.go('app.login');
          }
        })
        .catch(function () {
          event.preventDefault();
          $state.go('app.login');
        });
    });
  });

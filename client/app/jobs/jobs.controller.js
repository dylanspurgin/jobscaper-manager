'use strict';

angular.module('jobscaperManagerApp')
  .controller('JobsController', function ($scope, $timeout, $log) {

    var findJobIndex = function (job) {
      return _.findIndex($scope.organization.jobs, job);
    };

    $scope.setJobUnderEdit = function (job, isUnderEdit) {
      job.open = true;
      $scope.organization.jobs[findJobIndex(job)].isUnderEdit = isUnderEdit;
    };

    $scope.findJobCopy = function (job) {
      return $scope.organization.jobsCopy[findJobIndex(job)];
    };

    $scope.save = function (job) {
      $scope.organization.jobs[findJobIndex(job)] = $scope.findJobCopy(job);
      $scope.organization.save()
        .then(function (/*organization*/) {
          var job = $scope.organization.jobs[findJobIndex(job)];
          if (job !== undefined) {
            $scope.organization.jobs[findJobIndex(job)].open = true;
          }
        })
        .catch(function (/*error*/) {
          $log.error('Error saving job', job);
          // TODO - display error modal
        })
        .finally(function () {
          $scope.setJobUnderEdit(job,false);
        });
    };

    $scope.cancel = function (job) {
      $scope.organization.jobsCopy[findJobIndex(job)] = $scope.organization.jobs[findJobIndex(job)];
      $scope.setJobUnderEdit(job, false);
    };


    $scope.datePickerFormat = 'yyyy/MM/dd';
    $scope.dateOptions = {
      formatYear: 'yy',
      startingDay: 1
    };
    //$scope.datePickerOpen = false;
    $scope.datePickerOpen = [];
    $scope.openDatePicker = function (index) {
      $timeout(function () {
        $scope.datePickerOpen[index] = true;
      });
    }

  });

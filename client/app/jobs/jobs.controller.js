'use strict';

angular.module('jobscaperManagerApp')
  .controller('JobsController', function ($scope, $timeout) {

    var findJobIndex = function (job) {
      return _.findIndex($scope.organization.jobs, job);
    };

    var setJobEditUnderEdit = function (job, isUnderEdit) {
      job.open = true;
      $scope.organization.jobs[findJobIndex(job)].isUnderEdit = isUnderEdit;
    };

    $scope.findJobCopy = function (job) {
      return $scope.organization.jobsCopy[findJobIndex(job)];
    };

    $scope.edit = function (job) {
      setJobEditUnderEdit(job,true);
    };

    $scope.save = function (job) {
      _.merge($scope.organization.jobs[findJobIndex(job)],$scope.findJobCopy(job));
      $scope.organization.save()
        .then(function (jobResponse) {

        })
        .catch(function (err) {
          $log.error('Error saving job', job);
        })
        .finally(function () {
          setJobEditUnderEdit(job,false);
        });
    };

    $scope.cancel = function (job) {
      setJobEditUnderEdit(job,false);
    };


    $scope.addJob = function () {
      var newJob = $scope.organization.addJob();
      setJobEditUnderEdit(newJob,true);
    };

    $scope.addTask = function (job) {
      job.addTask().open = true;
    };

    $scope.addSubTask = function (task) {
      task.addSubTask().open = true;
    };

    $scope.datePickerFormat = 'yyyy/MM/dd';
    $scope.dateOptions = {
      formatYear: 'yy',
      startingDay: 1
    };
    $scope.datePickerOpen = false;
    $scope.openDatePicker = function () {
      $timeout(function () {
        $scope.datePickerOpen = true;
      });
    }

  });

'use strict';

angular.module('jobscaperManagerApp')
  .factory('DataService', function (Restangular) {

    var
      _endpoint = 'api/organizations';

    var _subTaskMixins = {
      addMaterial: function () {
        var newMaterial = {
          name: '',
          quantity: 1
        };
        this.materials.unshift(newMaterial);
        return newMaterial;
      }
    };

    var _taskMixins = {
      addSubTask: function () {
        var newSubTask = {
          name: '',
          description: '',
          complete: false,
          materials: []
        };
        _.mixin(newSubTask,_subTaskMixins);
        this.subTasks.unshift(newSubTask);
        return newSubTask;
      }
    };

    var _jobMixins = {
      addTask: function () {
        var newTask = {
          name:'',
          description:'',
          subTasks: []
        };
        _.mixin(newTask,_taskMixins);
        this.tasks.unshift(newTask);
        return newTask;
      }
    };

    var _organizationMixins = {
      addJob: function () {
        var newJob = {
          name: 'New Job',
          description: '',
          startDate: '', // TODO - use moment.js
          contactName: '',
          contactPhone: '',
          contactEmail: '',
          address1: '',
          address2: '',
          city: '',
          state: '',
          zip: '',
          active: true,
          tasks: []
        };
        _.mixin(newJob,_jobMixins);
        this.jobs.unshift(newJob);
        this.jobsCopy.unshift(newJob);
        return newJob;
      },
      jobsCopy: [] // Copy of jobs list used for editing
    };


    Restangular.extendModel(_endpoint, function (model) {
      angular.extend(model, _organizationMixins);
      return model;
    });


    var
      publicApi = {
        getOrgData: function (id) {
          return Restangular.one(_endpoint, id).get().then(function (orgData) {
            _.each(orgData.jobs, function (job) {
              _.mixin(job,_jobMixins);
              _.each(job.tasks, function (task) {
                _.mixin(task,_taskMixins);
                _.each(task.subTasks, function (subTask) {
                  _.mixin(subTask,_subTaskMixins);
                })
              });
            });
            orgData.jobsCopy = _.cloneDeep(orgData.jobs);
            return orgData;
          });
        }
      };

    return publicApi;

  });

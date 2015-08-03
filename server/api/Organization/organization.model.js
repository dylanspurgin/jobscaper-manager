'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


//var childSchema = new Schema({ name: 'string' });
//var parentSchema = new Schema({
//  children: [childSchema]
//});
//var Parent = mongoose.model('Parent', parentSchema);
//var parent = new Parent({ children: [{ name: 'Matt' }, { name: 'Sarah' }] })
//parent.children[0].name = 'Matthew';
//parent.save(callback);


var MaterialSchema = new Schema({
  name: String,
  quantity: Number
});

var SubTaskSchema = new Schema({
  name: String,
  description: String,
  complete: Boolean,
  materials: [MaterialSchema]
});


var TaskSchema = new Schema({
  name: String,
  description: String,
  subTasks: [SubTaskSchema]
});

TaskSchema
  .virtual('complete')
  .get(function() {
    return  _.where(this.subTasks, {complete: true}).length === this.subTasks.length;
});

TaskSchema
  .virtual('subTasksCompleteCount')
  .get(function() {
    return _.where(this.subTasks, {complete: true}).length;
  });

TaskSchema
  .virtual('subTaskCount')
  .get(function() {
    return this.subTasks.length;
  });


var JobSchema = new Schema({
  name: String,
  description: String,
  dateCreated: Date,
  contactName: String,
  contactPhone: String,
  address1: String,
  address2: String,
  city: String,
  state: String,
  zip: String,
  active: Boolean,
  //percentComplete
  tasks: [TaskSchema]
});

JobSchema
  .virtual('status')
  .get(function() {
    return {
      complete: _.where(this.tasks, {complete: true}).length === this.subTasks.length,
      numberCompleted: _.where(this.tasks, {complete: true}).length,
      numberTotal: this.tasks.length
    };
  });

var OrganizationSchema = new Schema({
  jobs: [JobSchema],
  requestCodes: [Number] // Users attempting to gain access to an org must enter a code listed here. Remove once used.
});

module.exports = mongoose.model('Organization', OrganizationSchema);

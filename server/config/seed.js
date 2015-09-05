/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var Organization = require('../api/organization/organization.model');
var User = require('../api/user/user.model');

Organization.find({}).remove(function() {
  Organization.create({
    name: 'Lone Star Natives',
    requestCodes: [1234],
    jobs: [
      {
        name: '11239 Harrold Ct',
        description: 'Quisque porttitor rutrum ultricies. Fusce vehicula ex ornare, interdum mi et, posuere nisl. Donec ornare molestie felis, eget pulvinar ligula varius id. Fusce pellentesque a massa nec blandit. Vestibulum in tincidunt nulla, a aliquet diam.',
        startDate: new Date(),
        contactName: 'Jim Brown',
        contactPhone: '512 333 5533',
        contactEmail: 'jim.brown@gmail.com',
        address1: '11239 Harrold Ct',
        address2: '',
        city: 'Austin',
        state: 'Tx',
        zip: '77882',
        active: true,
        tasks: [
          {
            name: 'Concrete Walkway',
            description: 'Approximately 8 4\'x2\' concrete pavers from front door to front gate.',
            subtasks: [
              {
                name: 'Grading',
                description: 'grade the area where pavers will go',
                complete: true,
                materials: []
              },
              {
                name: 'Pavers',
                description: '8 of them',
                complete: false,
                materials: [{
                  name: 'Quickcrete',
                  quantity: 14
                }]
              }
            ]
          }
        ]
      }
    ]
  },
  function (err, org) {
    if (err) {
      console.log('Error creating organization seed data.',err);
      return false;
    }
    User.find({}).remove(function() {
      User.create({
        name: 'Leslie Lilly',
        email: 'leslie@lonestarnatives.com',
        organization: org._id,
        role: 'manager',
        password: '1234',
        provider: 'local'
      }, function (err, user) {
        if (err) {
          console.log('Error creating user seed data', err);
          return false;
        }
        console.log('done creating seed data');
      });
    });
  });
});

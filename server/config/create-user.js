'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var User = require('../api/user/user.model');
var mongoose = require('mongoose');
var config = require('./environment');

// Connect to database
mongoose.connect(config.mongo.uri, config.mongo.options);
mongoose.connection.on('error', function(err) {
    console.error('MongoDB connection error: ' + err);
    process.exit(1);
  }
);


// process.argv is array of command line options. 0 is 'node' and 1 is '/some/path/to/create-user.js'

if (process.argv[4] === undefined) {
  console.log('Please provide command line arguments name, email, password, role<optional>, organization id<optional>');
  process.exit(1);
}

var
  name = process.argv[2],
  email = process.argv[3],
  pw = process.argv[4],
  role = process.argv[5] || 'user',
  org = process.argv[6] || null,
  provider = 'local';


User.findOne({email: email}).exec(function (err , user) {
  if (user) {
    console.log('User with email address ' + email + ' already exists!');
    process.exit(1);
  }
});

User.create({
  name: name,
  email: email,
  password: pw,
  role: role,
  organization: org,
  provider: provider
}, function (err, user) {
  if (err) {
    console.log('Error creating user!', err);
    process.exit(1);
  }
  console.log('done creating user', user._id);
  process.exit(0);
});

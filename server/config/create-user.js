'use strict';

var User = require('../api/user/user.model');

// process.argv is array of command line options. 0 is 'node' and 1 is '/some/path/to/create-user.js'

if (process.argv[4] === undefined) {
  console.log('Please provide command line arguments name, email, password, role<optional>, organization id<optional>');
  return false;
}

var
  name = process.argv[2],
  email = process.argv[3],
  pw = process.argv[4],
  role = process.argv[5] || 'user',
  org = process.argv[6] || '',
  provider = 'local';


User.findOne({email: email}, function (err , user) {
  if (!err || user) {
    console.log('User with email address ' + email + ' already exists!');
    return false;
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
    return false;
  }
  console.log('done creating user', user._id);
});

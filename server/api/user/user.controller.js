'use strict';

var User = require('./user.model');
var Organization = require('../organization/organization.model');
var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');
var _ = require('lodash');

var validationError = function (res, err) {
  return res.status(422).json(err);
};

/**
 * Get list of users
 */
exports.index = function (req, res) {

  // If user's role is 'admin', get all
  if (req.user.role === 'admin') {
    User.find({}, '-salt -hashedPassword', function (err, users) {
      if (err) return res.status(500).send(err);
      res.status(200).json(users);
    });

  // If user's role is 'manager', get all for org
  } else if (req.user.role === 'manager') {
    User.find({organization:req.user.organization}, '-salt -hashedPassword', function (err, users) {
      if (err) return res.status(500).send(err);
      res.status(200).json(users);
    });

  // If user's role is 'user', get self only
  } else if (req.user.role === 'user') {
    User.findById(req.user._id, function (err, user) {
      if (err) return next(err);
      return res.status(200).json(user);
    });
  } else {
    // TODO - Add proper error response here
    return res.status(401).send({});
  }

};

/**
 * Creates a new user
 * TODO - Allow users to create their own account, require them to enter a code supplied by admin to access an org
 */
exports.create = function (req, res, next) {
  var newUser = new User(req.body);
  newUser.provider = 'local';
  newUser.role = newUser.role || 'user';
  newUser.save(function (err, user) {
    if (err) return validationError(res, err);
    var token = jwt.sign({_id: user._id}, config.secrets.session, {expiresInMinutes: 60 * 5});
    res.json({token: token});
  });
};

/**
 * Get a single user
 */
exports.show = function (req, res, next) {
  var userId = req.params.id;

  User.findById(userId, function (err, user) {
    if (err) return next(err);
    if (!user) return res.status(401).send('Unauthorized');
    res.json(user.profile);
  });
};

/**
 * Deletes a user
 * restriction: 'admin'
 */
exports.destroy = function (req, res) {
  User.findByIdAndRemove(req.params.id, function (err, user) {
    if (err) return res.status(500).send(err);
    return res.status(204).send('No Content');
  });
};

/**
 * Update a user
 * @param req
 * @param res
 */
exports.update = function (req, res) {
  var organizationRequestCodeUsed = 0;
  if (req.body._id) {
    delete req.body._id;
  }
  User.findById(req.params.id, function (err, user) {
    if (err) {
      return handleError(res, err);
    }
    if (!user) {
      return res.status(404).send('Not Found');
    }
    // Validate users attempting to gain access to a new org
    if (user.organization && user.organization.toString() !== req.body.organization) {
      if (!user.organizationRequestCode) {
        return res.status(400).send('Bad request. No organization request code found.');
      }
      Organization.findById(req.body.organization, function (err, org) {
        if (err) {
          return handleError(res, err);
        }
        if (!org) {
          return res.status(400).send('Bad request. Organization does not exist.');
        }
        if (_.indexOf(org.requestCodes,req.body.organizationRequestCode)===-1) {
          return res.status(403).send('Bad access code');
        }
        organizationRequestCodeUsed = req.body.organizationRequestCode;
      });
    }

    var updated = _.merge(user, req.body);
    updated.save(function (err) {
      if (err) {
        return handleError(res, err);
      }

      // Remove organization request code if used
      if (organizationRequestCodeUsed) {
        Organization.findById(req.body.organization, function (err, org) {
          _.pull(org.requestCodes, organizationRequestCodeUsed);
          org.save(function (err) {
            if (err) {
              return handleError(res, err);
            }
          })
        });
      }

      return res.status(200).json(user);
    });
  });
};

/**
 * Change a users password
 */
exports.changePassword = function (req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  User.findById(userId, function (err, user) {
    if (user.authenticate(oldPass)) {
      user.password = newPass;
      user.save(function (err) {
        if (err) return validationError(res, err);
        res.status(200).send('OK');
      });
    } else {
      res.status(403).send('Forbidden');
    }
  });
};

/**
 * Get my info
 */
exports.me = function (req, res, next) {
  var userId = req.user._id;
  User.findOne({
    _id: userId
  }, '-salt -hashedPassword', function (err, user) { // don't ever give out the password or salt
    if (err) return next(err);
    if (!user) return res.status(401).send('Unauthorized');
    res.json(user);
  });
};

/**
 * Authentication callback
 */
exports.authCallback = function (req, res, next) {
  res.redirect('/');
};

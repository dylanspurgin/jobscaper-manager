/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /organizations              ->  index
 * POST    /organizations              ->  create
 * GET     /organizations/:id          ->  show
 * PUT     /organizations/:id          ->  update
 * DELETE  /organizations/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Organization = require('./organization.model');
var User = require('../user/user.model');

// Get list of organizations
//exports.index = function(req, res) {
//  Organization.find(function (err, organizations) {
//    if(err) { return handleError(res, err); }
//    return res.status(200).json(organizations);
//  });
//};

// Get a single organization and its active data graph
// TODO - only return jobs where active=true
exports.show = function (req, res) {
  Organization.findById(req.params.id, function (err, organization) {
    if (err) {
      return handleError(res, err);
    }
    if (!organization) {
      return res.status(404).send('Not Found');
    }
    if (req.user) {
      User.findById(req.user._id, function (err, user) {
        if (err) {
          console.log('Error finding user', req.user);
          return res.status(404).send('Not Found');
        }
        if (!organization._id === req.user.organization) {
          return res.status(401).send('Unauthorized');
        }
        return res.json(organization);
      });
    } else {
        console.log('User not found on session');
    }
  });
};

// Creates a new organization in the DB.
exports.create = function (req, res) {
  Organization.create(req.body, function (err, organization) {
    if (err) {
      return handleError(res, err);
    }
    return res.status(201).json(organization);
  });
};

// Updates an existing organization in the DB.
exports.update = function (req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Organization.findById(req.params.id, function (err, organization) {
    if (err) {
      return handleError(res, err);
    }
    if (!organization) {
      return res.status(404).send('Not Found');
    }
    var updated = _.merge(organization, req.body);
    updated.save(function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.status(200).json(organization);
    });
  });
};

// Deletes a organization from the DB.
exports.destroy = function (req, res) {
  Organization.findById(req.params.id, function (err, organization) {
    if (err) {
      return handleError(res, err);
    }
    if (!organization) {
      return res.status(404).send('Not Found');
    }
    organization.remove(function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}

'use strict';

var express = require('express');
var organizationController = require('./organization.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

//router.get('/', organizationController.index);
router.get('/:id', auth.isAuthenticated(), organizationController.show);
router.post('/', auth.isAuthenticated(), organizationController.create);
router.put('/:id', auth.isAuthenticated(), organizationController.update);
router.patch('/:id', auth.isAuthenticated(), organizationController.update);
router.delete('/:id', auth.isAuthenticated(), organizationController.destroy);


module.exports = router;

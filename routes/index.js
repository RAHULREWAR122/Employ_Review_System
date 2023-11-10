const express = require('express');
const passport = require('passport')
const userController = require('./user')
const adminController = require('./admin')
const reviewController = require('./review')

const router = express.Router();



router.use('/' ,userController)
router.use('/admin',passport.checkAuthentication  ,adminController);
router.use('/review' ,passport.checkAuthentication  ,reviewController);


module.exports = router;
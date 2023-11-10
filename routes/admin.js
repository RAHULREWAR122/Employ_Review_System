
const express  = require('express');
const passport = require('passport');
const adminController = require('../controller/adminController');

const router = express.Router();


router.get('/viewEmployees' , passport.checkAuthentication , adminController.viewEmployees)
router.get('/addEmployee' ,passport.checkAuthentication  ,adminController.addEmployee);
router.post('/addEmployees' ,passport.checkAuthentication  ,adminController.addEmployees);



router.get('/admin-page', passport.checkAuthentication, adminController.adminPage);
router.post('/set-Reviewers', passport.checkAuthentication, adminController.setReviewrs);


router.get('/deleteEmployee/:id' ,passport.checkAuthentication  ,adminController.deleteEmployee);

router.post('/makeAdmin', passport.checkAuthentication, adminController.newAdmin);
router.post('/makeEmployee', passport.checkAuthentication, adminController.newEmployee);

module.exports = router;


const express = require('express');
const passport = require('passport')
const userController = require('../controller/userController');
const homeController = require('../controller/homeController');

const router = express.Router();



router.get('/' ,userController.signIn);
router.get('/forgotPassword' ,userController.forgetPasswordPage);
router.post('/forgotPasswordRecover' ,userController.forgotPasswordRecover);

router.get('/signUp' , userController.signUp);
router.get('/home' ,passport.checkAuthentication  ,homeController.home);


router.post('/secret', userController.secretKey);



router.get('/signOut' ,passport.checkAuthentication, userController.signOut);
router.get('/update'  ,passport.checkAuthentication,userController.update);
router.post('/updateUser/:id' ,passport.checkAuthentication ,userController.updateUser);




router.post('/create' ,userController.create);
router.post('/createSession' , passport.authenticate(
    'local',
    {failureRedirect : '/'}
) ,  userController.createSession);




module.exports = router;
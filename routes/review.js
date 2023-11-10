const express = require("express");
const passport = require("passport");
const router = express.Router();

const reviewController = require('../controller/reviewController');

router.get('/newReviews/:id' ,passport.checkAuthentication,reviewController.goReview)
router.get('/newReview/:id',passport.checkAuthentication,reviewController.createReview);


module.exports = router;

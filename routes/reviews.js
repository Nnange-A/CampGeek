const express = require("express");

const catchAsync = require("../utils/catchAsync");

const reviews = require("../controllers/reviews")

const { validateReview, isLoggedIn, storeReturnTo, isReviewAuthor } = require("../middleware");


const router = express.Router({ mergeParams: true });



router.post("/", storeReturnTo, isLoggedIn, validateReview, catchAsync(reviews.createReview));


router.get("/:reviewId/edit", storeReturnTo, isLoggedIn, isReviewAuthor, catchAsync(reviews.renderEditReviewForm));


router.route("/:reviewId")
    .put(validateReview, isReviewAuthor, catchAsync(reviews.editReview))
    .delete(storeReturnTo, isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));



module.exports = router;
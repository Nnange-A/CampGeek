const Campground = require("../models/campground");
const Review = require("../models/review");


module.exports.createReview = async (req, res) => {

    const campground = await Campground.findById(req.params.id);

    const newReview = new Review(req.body.review);

    newReview.author = req.user._id;

    campground.reviews.push(newReview);

    await newReview.save();
    await campground.save();

    req.flash("success", "Successfully created review.");

    res.redirect(`/campgrounds/${campground._id}`);

}


module.exports.renderEditReviewForm = async (req, res) => {

    const campground = await Campground.findById(req.params.id);

    const review = await Review.findById(req.params.reviewId);

    if (!review) {
        req.flash("error", "Review cannot be found. It could have been deleted, or you could have made an error in your request.");
        return res.redirect(`/campgrounds/${campground._id}`);
    }

    res.render("reviews/edit", { review, campground });

}


module.exports.editReview = async (req, res) => {

    const { id, reviewId } = req.params;

    await Review.findByIdAndUpdate(reviewId, {...req.body.review}, { runValidators: true });

    req.flash("success", "Successfully editted review.");

    res.redirect(`/campgrounds/${id}`);

}


module.exports.deleteReview = async (req, res) => {

    const { id, reviewId } = req.params;

    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Successfully deleted review.");

    res.redirect(`/campgrounds/${id}`);

}
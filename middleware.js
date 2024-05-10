const ExpressError = require("./utils/ExpressError");

const Campground = require("./models/campground")
const Review = require("./models/review")

const { campgroundSchema, reviewSchema, userRegisterSchema, userLoginSchema } = require("./schemas")



module.exports.validateCampground = (req, res, next) => {

    const { error } = campgroundSchema.validate(req.body);

    if (error) {

        const message = error.details.map(el => el.message).join(",");

        throw new ExpressError(message, 400);

    }

    next();
}


module.exports.validateReview = (req, res, next) => {

    const { error } = reviewSchema.validate(req.body);

    if (error) {

        const message = error.details.map(el => el.message).join(",");

        throw new ExpressError(message, 400);

    }

    next();
}


module.exports.validateUserRegister = (req, res, next) => {

    const { error } = userRegisterSchema.validate(req.body);

    if (error) {

        const message = error.details.map(el => el.message).join(",");

        throw new ExpressError(message, 400);

    }

    next();
}


module.exports.validateUserLogin = (req, res, next) => {

    const { error } = userLoginSchema.validate(req.body);

    if (error) {

        const message = error.details.map(el => el.message).join(",");

        throw new ExpressError(message, 400);

    }

    next();
}


module.exports.isLoggedIn = (req, res, next) => {
    // passport AUTOMATICALLY ADDS THE isAuthenticated() METHOD TO THE request/req OBJECT
    if (!req.isAuthenticated()) {
        req.flash("error", "You must be signed in.");
        return res.redirect("/login");
    }
    next();
}


module.exports.storeReturnTo = (req, res, next) => {
    if (req.isAuthenticated()) {
        if (req.session.returnTo) {
            delete req.session.returnTo;
        }
    } else {
        req.session.returnTo = req.url;
    }
    next();
}


module.exports.isCampgroundAuthor = async (req, res, next) => {
    const { id } = req.params;

    const campground = await Campground.findById(id);

    if (!campground.author.equals(req.user._id)) {

        req.flash("error", "Unauthorized action.");
        return res.redirect(`/campgrounds/${id}`);

    }
    
    next();
}


module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;

    const review = await Review.findById(reviewId);

    if (!review.author.equals(req.user._id)) {

        req.flash("error", "Unauthorized action.");
        return res.redirect(`/campgrounds/${id}`);

    }
    
    next();
}
const { validationSchema, reviewSchema } = require("./schemas.js");
const ExpressError = require("./utilities/ExpressError");
const Course = require("./models/course");
const Review = require("./models/review");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash("error", "You must be signed in!")
        return res.redirect("/login")
    }
    next()
};

module.exports.validateCourse = (req, res, next) => {
    const { error } = validationSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(",")
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
};

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params
    const verifyCourse = await Course.findById(id)
    if (!verifyCourse.author.equals(req.user._id)) {
        req.flash("error", "You do not have permission to do that!")
        return res.redirect(`/courses/${id}`)
    }
    next()
};

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params
    const verifyAuthor = await Review.findById(reviewId)
    if (!verifyAuthor.author.equals(req.user._id)) {
        req.flash("error", "You do not have permission to do that!")
        return res.redirect(`/courses/${id}`)
    }
    next()
};

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(",")
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
};